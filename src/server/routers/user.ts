import crypto from "node:crypto";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getEmailProvider } from "@/providers/email";
import { getEmailTemplateProvider } from "@/providers/email-template";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	/** Returns the currently authenticated user's profile (role, name, email). */
	me: protectedProcedure.query(async ({ ctx }) => {
		const user = await prisma.user.findUnique({
			where: { id: ctx.userId },
			select: { id: true, name: true, email: true, role: true, password: true },
		});
		if (!user) return null;
		const { password, ...safeUser } = user;
		return { ...safeUser, hasPassword: password !== null };
	}),

	/** Update the current user's display name. */
	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(100),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return prisma.user.update({
				where: { id: ctx.userId },
				data: { name: input.name },
				select: { id: true, name: true, email: true, role: true },
			});
		}),

	/** Update the current user's email address (credential users only). */
	updateEmail: protectedProcedure
		.input(
			z.object({
				email: z.email(),
				currentPassword: z.string().min(8),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await prisma.user.findUnique({
				where: { id: ctx.userId },
				select: { password: true },
			});
			if (!user?.password) {
				throw new TRPCError({ code: "BAD_REQUEST", message: "no_password" });
			}
			const valid = await bcrypt.compare(input.currentPassword, user.password);
			if (!valid) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "wrong_password",
				});
			}
			const conflict = await prisma.user.findUnique({
				where: { email: input.email },
				select: { id: true },
			});
			if (conflict && conflict.id !== ctx.userId) {
				throw new TRPCError({ code: "CONFLICT", message: "email_taken" });
			}
			return prisma.user.update({
				where: { id: ctx.userId },
				data: { email: input.email },
				select: { id: true, name: true, email: true, role: true },
			});
		}),

	/** Change password — requires the current password for verification. */
	changePassword: protectedProcedure
		.input(
			z.object({
				currentPassword: z.string().min(8),
				newPassword: z.string().min(8),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await prisma.user.findUnique({
				where: { id: ctx.userId },
				select: { password: true },
			});
			if (!user?.password) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "no_password",
				});
			}
			const valid = await bcrypt.compare(input.currentPassword, user.password);
			if (!valid) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "wrong_password",
				});
			}
			const hash = await bcrypt.hash(input.newPassword, 12);
			await prisma.user.update({
				where: { id: ctx.userId },
				data: { password: hash },
			});
			return { success: true };
		}),

	/**
	 * Send a password-reset email. Always returns success to avoid leaking
	 * whether the email exists in the system.
	 */
	requestPasswordReset: publicProcedure
		.input(z.object({ email: z.string().email() }))
		.mutation(async ({ input }) => {
			const user = await prisma.user.findUnique({
				where: { email: input.email },
				select: { id: true, password: true },
			});

			// Silently succeed for unknown emails or OAuth-only accounts.
			if (!user?.password) return { success: true };

			// Invalidate any previous tokens for this email.
			await prisma.verificationToken.deleteMany({
				where: { identifier: input.email },
			});

			const token = crypto.randomBytes(32).toString("hex");
			const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
			await prisma.verificationToken.create({
				data: { identifier: input.email, token, expires },
			});

			const resetUrl = `${env.NEXTAUTH_URL}/reset-password/${token}`;
			const emailContent = await getEmailTemplateProvider().render(
				"reset-password",
				{ resetUrl },
			);
			await getEmailProvider().send({
				to: input.email,
				subject: emailContent.subject,
				html: emailContent.html,
				text: emailContent.text,
			});

			return { success: true };
		}),

	/** Validate a reset token and set a new password. */
	confirmPasswordReset: publicProcedure
		.input(
			z.object({
				token: z.string().min(1),
				newPassword: z.string().min(8),
			}),
		)
		.mutation(async ({ input }) => {
			const record = await prisma.verificationToken.findUnique({
				where: { token: input.token },
			});

			if (!record || record.expires < new Date()) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "invalid_or_expired",
				});
			}

			const user = await prisma.user.findUnique({
				where: { email: record.identifier },
				select: { id: true },
			});
			if (!user) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const hash = await bcrypt.hash(input.newPassword, 12);
			await prisma.user.update({
				where: { id: user.id },
				data: { password: hash },
			});

			// Consume the token so it can't be reused.
			await prisma.verificationToken.delete({
				where: { token: input.token },
			});

			return { success: true };
		}),

	register: publicProcedure
		.input(
			z.object({
				firstName: z.string().min(1),
				lastName: z.string().min(1),
				email: z.string().email(),
				password: z.string().min(8),
			}),
		)
		.mutation(async ({ input }) => {
			const existing = await prisma.user.findUnique({
				where: { email: input.email },
				select: { id: true },
			});
			if (existing) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "email_taken",
				});
			}

			const hash = await bcrypt.hash(input.password, 12);
			await prisma.user.create({
				data: {
					name: `${input.firstName} ${input.lastName}`.trim(),
					email: input.email,
					password: hash,
				},
			});

			// Send verification email.
			await sendVerificationEmail(input.email);

			return { success: true };
		}),

	/** Resend the email-verification link for the current user. */
	resendVerificationEmail: protectedProcedure.mutation(async ({ ctx }) => {
		const user = await prisma.user.findUniqueOrThrow({
			where: { id: ctx.userId },
			select: { email: true, emailVerified: true },
		});

		if (user.emailVerified) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "email_already_verified",
			});
		}

		await sendVerificationEmail(user.email);
		return { success: true };
	}),

	/** Confirm the email address via token sent by email. */
	verifyEmail: publicProcedure
		.input(z.object({ token: z.string().min(1) }))
		.mutation(async ({ input }) => {
			const record = await prisma.verificationToken.findUnique({
				where: { token: input.token },
			});

			if (!record || record.expires < new Date()) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "invalid_or_expired",
				});
			}

			// Only process tokens with the verify-email prefix.
			if (!record.identifier.startsWith("verify-email:")) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "invalid_or_expired",
				});
			}

			const email = record.identifier.replace("verify-email:", "");

			const user = await prisma.user.findUnique({
				where: { email },
				select: { id: true },
			});
			if (!user) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			await prisma.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});

			// Consume the token.
			await prisma.verificationToken.delete({
				where: { token: input.token },
			});

			return { success: true };
		}),

	/**
	 * Permanently delete the current user's account.
	 * Credential users must provide their password; OAuth-only users confirm
	 * by providing the string "DELETE".
	 * Fails if the user is the sole OWNER of any project.
	 */
	deleteAccount: protectedProcedure
		.input(
			z.object({
				confirmation: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await prisma.user.findUniqueOrThrow({
				where: { id: ctx.userId },
				select: { password: true },
			});

			// Credential users must confirm with their current password.
			if (user.password) {
				const valid = await bcrypt.compare(input.confirmation, user.password);
				if (!valid) {
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "wrong_password",
					});
				}
			} else {
				// OAuth-only users must type "DELETE" to confirm.
				if (input.confirmation !== "DELETE") {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "confirmation_required",
					});
				}
			}

			// Prevent deletion if user is the sole owner of any project.
			const ownedProjects = await prisma.projectMember.findMany({
				where: { userId: ctx.userId, role: "OWNER" },
				select: { projectId: true },
			});

			for (const { projectId } of ownedProjects) {
				const otherOwners = await prisma.projectMember.count({
					where: {
						projectId,
						role: "OWNER",
						userId: { not: ctx.userId },
					},
				});
				if (otherOwners === 0) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "sole_owner",
					});
				}
			}

			// Delete the user — Prisma cascade handles related records.
			await prisma.user.delete({ where: { id: ctx.userId } });

			return { success: true };
		}),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VERIFY_EMAIL_TTL_HOURS = 24;

async function sendVerificationEmail(email: string): Promise<void> {
	// Invalidate any previous verification tokens for this email.
	await prisma.verificationToken.deleteMany({
		where: { identifier: `verify-email:${email}` },
	});

	const token = crypto.randomBytes(32).toString("hex");
	const expires = new Date(
		Date.now() + VERIFY_EMAIL_TTL_HOURS * 60 * 60 * 1000,
	);
	await prisma.verificationToken.create({
		data: { identifier: `verify-email:${email}`, token, expires },
	});

	const verifyUrl = `${env.NEXTAUTH_URL}/verify-email/${token}`;
	const emailContent = await getEmailTemplateProvider().render("verify-email", {
		verifyUrl,
	});
	await getEmailProvider().send({
		to: email,
		subject: emailContent.subject,
		html: emailContent.html,
		text: emailContent.text,
	});
}
