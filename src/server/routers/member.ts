import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getEmailProvider } from "@/providers/email";
import { getEmailTemplateProvider } from "@/providers/email-template";
import { recordAuditEventSafe } from "@/server/services/audit";
import {
	createTRPCRouter,
	ownerProcedure,
	projectProcedure,
	protectedProcedure,
} from "../trpc";

const INVITE_TTL_HOURS = 48;

export const memberRouter = createTRPCRouter({
	/** List members of a project. Available to all project members. */
	list: projectProcedure
		.input(
			z.object({
				projectId: z.string(),
				limit: z.number().int().min(1).max(100).default(30),
				cursor: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			const items = await prisma.projectMember.findMany({
				where: { projectId: input.projectId },
				include: {
					user: {
						select: { id: true, name: true, email: true, avatar: true },
					},
				},
				orderBy: [{ joinedAt: "asc" }, { id: "asc" }],
				take: input.limit + 1,
				...(input.cursor
					? {
							cursor: { id: input.cursor },
							skip: 1,
						}
					: {}),
			});

			const hasMore = items.length > input.limit;
			const page = hasMore ? items.slice(0, -1) : items;
			const nextCursor = hasMore ? page[page.length - 1]?.id : null;

			return {
				items: page,
				nextCursor,
			};
		}),

	/** Invite a user by email (owner only). Sends an invite email with a tokenized link. */
	invite: ownerProcedure
		.input(
			z.object({
				projectId: z.string(),
				email: z.email(),
				role: z.enum(["COLLABORATOR", "VIEWER"]).default("COLLABORATOR"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Prevent inviting existing members.
			const existingUser = await prisma.user.findUnique({
				where: { email: input.email },
			});
			if (existingUser) {
				const isMember = await prisma.projectMember.findUnique({
					where: {
						projectId_userId: {
							projectId: input.projectId,
							userId: existingUser.id,
						},
					},
				});
				if (isMember) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "User is already a project member",
					});
				}
			}

			// Create a new invite or refresh an existing open one for the same email.
			const expiresAt = new Date(
				Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000,
			);
			const existing = await prisma.projectInvite.findFirst({
				where: {
					projectId: input.projectId,
					email: input.email,
					acceptedAt: null,
				},
			});
			const invite = existing
				? await prisma.projectInvite.update({
						where: { id: existing.id },
						data: { expiresAt, role: input.role },
					})
				: await prisma.projectInvite.create({
						data: {
							projectId: input.projectId,
							createdById: ctx.userId,
							email: input.email,
							role: input.role,
							expiresAt,
						},
					});

			// Fetch project + inviter for the email.
			const [project, inviter] = await Promise.all([
				prisma.project.findUniqueOrThrow({
					where: { id: input.projectId },
					select: { name: true },
				}),
				prisma.user.findUniqueOrThrow({
					where: { id: ctx.userId },
					select: { name: true, email: true },
				}),
			]);

			const acceptUrl = `${env.NEXTAUTH_URL}/invite/${invite.token}`;
			const emailContent = await getEmailTemplateProvider().render(
				"project-invite",
				{
					inviterName: inviter.name ?? inviter.email,
					projectName: project.name,
					role: input.role,
					acceptUrl,
				},
			);

			await getEmailProvider().send({
				to: input.email,
				subject: emailContent.subject,
				html: emailContent.html,
				text: emailContent.text,
			});

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "MEMBER_INVITED",
				entityType: "PROJECT_MEMBER",
				entityId: invite.id,
				summary: `Invite sent to ${input.email}`,
				details: {
					email: input.email,
					role: input.role,
					expiresAt: expiresAt.toISOString(),
				},
			});

			return { success: true, expiresAt };
		}),

	/** Accept an invitation via token (public — user may not be signed in yet). */
	acceptInvite: protectedProcedure
		.input(z.object({ token: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const invite = await prisma.projectInvite.findUnique({
				where: { token: input.token },
			});

			if (!invite || invite.acceptedAt) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Invitation not found or already used",
				});
			}
			if (invite.expiresAt < new Date()) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invitation has expired",
				});
			}

			// Check the signed-in user's email matches the invite.
			const user = await prisma.user.findUniqueOrThrow({
				where: { id: ctx.userId },
				select: { name: true, email: true },
			});
			if (user.email.toLowerCase() !== invite.email.toLowerCase()) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "This invitation was sent to a different email address",
				});
			}

			// Add member + mark invite accepted in a transaction.
			await prisma.$transaction([
				prisma.projectMember.upsert({
					where: {
						projectId_userId: {
							projectId: invite.projectId,
							userId: ctx.userId,
						},
					},
					update: { role: invite.role },
					create: {
						projectId: invite.projectId,
						userId: ctx.userId,
						role: invite.role,
					},
				}),
				prisma.projectInvite.update({
					where: { id: invite.id },
					data: { acceptedAt: new Date() },
				}),
			]);

			// Notify the project owner that the invite was accepted.
			const [project, owner] = await Promise.all([
				prisma.project.findUniqueOrThrow({
					where: { id: invite.projectId },
					select: { name: true },
				}),
				prisma.projectMember.findFirst({
					where: { projectId: invite.projectId, role: "OWNER" },
					select: { user: { select: { email: true } } },
				}),
			]);

			if (owner) {
				const emailContent = await getEmailTemplateProvider().render(
					"invite-accepted",
					{
						memberName: user.name ?? user.email,
						projectName: project.name,
						role: invite.role,
					},
				);
				await getEmailProvider().send({
					to: owner.user.email,
					subject: emailContent.subject,
					html: emailContent.html,
					text: emailContent.text,
				});
			}

			await recordAuditEventSafe({
				projectId: invite.projectId,
				actorId: ctx.userId,
				action: "MEMBER_INVITE_ACCEPTED",
				entityType: "PROJECT_MEMBER",
				entityId: ctx.userId,
				summary: `${user.name ?? user.email} joined project`,
				details: {
					role: invite.role,
					email: user.email,
				},
			});

			return { projectId: invite.projectId };
		}),

	/** Change the role of a member (owner only; cannot demote yourself). */
	updateRole: ownerProcedure
		.input(
			z.object({
				projectId: z.string(),
				userId: z.string(),
				role: z.enum(["COLLABORATOR", "VIEWER"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.userId === ctx.userId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Cannot change your own role",
				});
			}
			const updated = await prisma.projectMember.update({
				where: {
					projectId_userId: {
						projectId: input.projectId,
						userId: input.userId,
					},
				},
				data: { role: input.role },
			});

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "MEMBER_ROLE_UPDATED",
				entityType: "PROJECT_MEMBER",
				entityId: input.userId,
				summary: `Member role changed to ${input.role}`,
				details: { role: input.role },
			});

			return updated;
		}),

	/** Remove a member from the project (owner only; cannot remove themselves). */
	remove: ownerProcedure
		.input(
			z.object({
				projectId: z.string(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.userId === ctx.userId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Cannot remove yourself — use leave instead",
				});
			}
			await prisma.projectMember.delete({
				where: {
					projectId_userId: {
						projectId: input.projectId,
						userId: input.userId,
					},
				},
			});

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "MEMBER_REMOVED",
				entityType: "PROJECT_MEMBER",
				entityId: input.userId,
				summary: "Member removed from project",
			});
			return { success: true };
		}),

	/** Leave a project (any non-owner member). Owners must transfer ownership first. */
	leave: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (ctx.member.role === "OWNER") {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"Owners cannot leave. Transfer ownership or delete the project.",
				});
			}
			await prisma.projectMember.delete({
				where: {
					projectId_userId: {
						projectId: input.projectId,
						userId: ctx.userId,
					},
				},
			});

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "MEMBER_LEFT",
				entityType: "PROJECT_MEMBER",
				entityId: ctx.userId,
				summary: "Member left project",
			});
			return { success: true };
		}),

	/** Transfer ownership to another member (owner only). */
	transferOwnership: ownerProcedure
		.input(
			z.object({
				projectId: z.string(),
				newOwnerId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.newOwnerId === ctx.userId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Already the owner",
				});
			}
			await prisma.$transaction([
				prisma.projectMember.update({
					where: {
						projectId_userId: {
							projectId: input.projectId,
							userId: input.newOwnerId,
						},
					},
					data: { role: "OWNER" },
				}),
				prisma.projectMember.update({
					where: {
						projectId_userId: {
							projectId: input.projectId,
							userId: ctx.userId,
						},
					},
					data: { role: "COLLABORATOR" },
				}),
			]);

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "PROJECT_OWNERSHIP_TRANSFERRED",
				entityType: "PROJECT_MEMBER",
				entityId: input.newOwnerId,
				summary: "Project ownership transferred",
				details: { fromUserId: ctx.userId, toUserId: input.newOwnerId },
			});
			return { success: true };
		}),
});
