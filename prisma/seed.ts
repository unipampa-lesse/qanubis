import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function hashPassword(plain: string) {
	return bcrypt.hash(plain, 12);
}

async function upsertUser(opts: {
	id: string;
	email: string;
	name: string;
	password: string;
	role?: "USER" | "ADMIN";
}) {
	const hash = await hashPassword(opts.password);
	return prisma.user.upsert({
		where: { email: opts.email },
		update: {
			name: opts.name,
			password: hash,
			emailVerified: new Date(),
			role: opts.role ?? "USER",
		},
		create: {
			id: opts.id,
			name: opts.name,
			email: opts.email,
			password: hash,
			emailVerified: new Date(),
			role: opts.role ?? "USER",
		},
	});
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
	console.log("🌱 Seeding database…");

	// -------------------------------------------------------------------------
	// Users
	// -------------------------------------------------------------------------

	const admin = await upsertUser({
		id: "seed-user-admin",
		email: "admin@qanubis.local",
		name: "Admin",
		password: "admin123",
		role: "ADMIN",
	});

	const owner = await upsertUser({
		id: "seed-user-owner",
		email: "owner@qanubis.local",
		name: "Alice Owner",
		password: "user123",
	});

	const collaborator = await upsertUser({
		id: "seed-user-collab",
		email: "collaborator@qanubis.local",
		name: "Bob Collaborator",
		password: "user123",
	});

	const viewer = await upsertUser({
		id: "seed-user-viewer",
		email: "viewer@qanubis.local",
		name: "Carol Viewer",
		password: "user123",
	});

	// Kept for backwards-compatibility with existing dev workflows
	const researcher = await upsertUser({
		id: "seed-user-researcher",
		email: "researcher@qanubis.local",
		name: "Researcher",
		password: "user123",
	});

	// -------------------------------------------------------------------------
	// Project A — full-featured, all three member roles
	// -------------------------------------------------------------------------

	const projectA = await prisma.project.upsert({
		where: { id: "seed-project-01" },
		update: { name: "Remote Work Study", color: "#6366f1" },
		create: {
			id: "seed-project-01",
			name: "Remote Work Study",
			description:
				"A qualitative study on how remote work affects team dynamics and individual productivity.",
			color: "#6366f1",
		},
	});

	const membersA = [
		{ userId: owner.id, role: "OWNER" as const },
		{ userId: collaborator.id, role: "COLLABORATOR" as const },
		{ userId: viewer.id, role: "VIEWER" as const },
		{ userId: researcher.id, role: "COLLABORATOR" as const },
	];
	for (const m of membersA) {
		await prisma.projectMember.upsert({
			where: { projectId_userId: { projectId: projectA.id, userId: m.userId } },
			update: { role: m.role },
			create: { projectId: projectA.id, userId: m.userId, role: m.role },
		});
	}

	// Codes — Project A
	const codeMotivation = await prisma.code.upsert({
		where: { id: "seed-code-01" },
		update: {},
		create: {
			id: "seed-code-01",
			projectId: projectA.id,
			name: "Motivation",
			color: "#6366f1",
			textColor: "#ffffff",
			description: "Factors that affect worker motivation",
		},
	});

	const codeAutonomy = await prisma.code.upsert({
		where: { id: "seed-code-01a" },
		update: {},
		create: {
			id: "seed-code-01a",
			projectId: projectA.id,
			parentId: codeMotivation.id,
			name: "Autonomy",
			color: "#818cf8",
			textColor: "#ffffff",
			description: "Sense of independence and ownership over work",
		},
	});

	await prisma.code.upsert({
		where: { id: "seed-code-01b" },
		update: {},
		create: {
			id: "seed-code-01b",
			projectId: projectA.id,
			parentId: codeMotivation.id,
			name: "Recognition",
			color: "#a5b4fc",
			textColor: "#1e1b4b",
			description: "Peer and management recognition of work",
		},
	});

	const codeChallenges = await prisma.code.upsert({
		where: { id: "seed-code-02" },
		update: {},
		create: {
			id: "seed-code-02",
			projectId: projectA.id,
			name: "Challenges",
			color: "#ef4444",
			textColor: "#ffffff",
			description: "Difficulties experienced while working remotely",
		},
	});

	await prisma.code.upsert({
		where: { id: "seed-code-02a" },
		update: {},
		create: {
			id: "seed-code-02a",
			projectId: projectA.id,
			parentId: codeChallenges.id,
			name: "Communication",
			color: "#fca5a5",
			textColor: "#7f1d1d",
			description: "Barriers to async and sync communication",
		},
	});

	await prisma.code.upsert({
		where: { id: "seed-code-02b" },
		update: {},
		create: {
			id: "seed-code-02b",
			projectId: projectA.id,
			parentId: codeChallenges.id,
			name: "Work-life balance",
			color: "#f97316",
			textColor: "#ffffff",
			description: "Difficulty separating work from personal life",
		},
	});

	const codeBenefits = await prisma.code.upsert({
		where: { id: "seed-code-03" },
		update: {},
		create: {
			id: "seed-code-03",
			projectId: projectA.id,
			name: "Benefits",
			color: "#22c55e",
			textColor: "#ffffff",
			description: "Positive outcomes of remote work",
		},
	});

	await prisma.code.upsert({
		where: { id: "seed-code-03a" },
		update: {},
		create: {
			id: "seed-code-03a",
			projectId: projectA.id,
			parentId: codeBenefits.id,
			name: "Flexibility",
			color: "#86efac",
			textColor: "#14532d",
			description: "Flexibility in schedule and location",
		},
	});

	// Memos — Project A
	await prisma.memo.upsert({
		where: { id: "seed-memo-01" },
		update: {},
		create: {
			id: "seed-memo-01",
			projectId: projectA.id,
			createdById: owner.id,
			name: "Initial observations",
			content: {
				type: "doc",
				content: [
					{
						type: "heading",
						attrs: { level: 2 },
						content: [{ type: "text", text: "Preliminary findings" }],
					},
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "Participants consistently mention increased autonomy as the primary driver of job satisfaction when working remotely. However, communication overhead and boundary-setting remain persistent challenges.",
							},
						],
					},
					{
						type: "bulletList",
						content: [
							{
								type: "listItem",
								content: [
									{
										type: "paragraph",
										content: [
											{
												type: "text",
												text: "All 12 participants reported improved focus without open-plan office noise.",
											},
										],
									},
								],
							},
							{
								type: "listItem",
								content: [
									{
										type: "paragraph",
										content: [
											{
												type: "text",
												text: "8 out of 12 mentioned difficulty switching off at the end of the day.",
											},
										],
									},
								],
							},
						],
					},
				],
			},
		},
	});

	await prisma.memo.upsert({
		where: { id: "seed-memo-02" },
		update: {},
		create: {
			id: "seed-memo-02",
			projectId: projectA.id,
			createdById: collaborator.id,
			name: "Coding guide",
			content: {
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "Use ",
							},
							{
								type: "text",
								marks: [{ type: "bold" }],
								text: "Motivation > Autonomy",
							},
							{
								type: "text",
								text: " for quotes where participants describe having control over their schedule or task order.",
							},
						],
					},
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "Reserve ",
							},
							{
								type: "text",
								marks: [{ type: "bold" }],
								text: "Challenges > Communication",
							},
							{
								type: "text",
								text: " specifically for friction caused by asynchrony — not general complaints about remote work.",
							},
						],
					},
				],
			},
		},
	});

	// -------------------------------------------------------------------------
	// Project B — smaller project, owned by collaborator user
	// -------------------------------------------------------------------------

	const projectB = await prisma.project.upsert({
		where: { id: "seed-project-02" },
		update: { name: "Interview Archive", color: "#14b8a6" },
		create: {
			id: "seed-project-02",
			name: "Interview Archive",
			description: "Raw interview recordings and initial transcripts.",
			color: "#14b8a6",
		},
	});

	await prisma.projectMember.upsert({
		where: {
			projectId_userId: { projectId: projectB.id, userId: collaborator.id },
		},
		update: { role: "OWNER" },
		create: {
			projectId: projectB.id,
			userId: collaborator.id,
			role: "OWNER",
		},
	});

	await prisma.projectMember.upsert({
		where: {
			projectId_userId: { projectId: projectB.id, userId: owner.id },
		},
		update: { role: "VIEWER" },
		create: {
			projectId: projectB.id,
			userId: owner.id,
			role: "VIEWER",
		},
	});

	await prisma.code.upsert({
		where: { id: "seed-code-b01" },
		update: {},
		create: {
			id: "seed-code-b01",
			projectId: projectB.id,
			name: "Theme: Identity",
			color: "#8b5cf6",
			textColor: "#ffffff",
		},
	});

	await prisma.code.upsert({
		where: { id: "seed-code-b02" },
		update: {},
		create: {
			id: "seed-code-b02",
			projectId: projectB.id,
			name: "Theme: Power",
			color: "#ec4899",
			textColor: "#ffffff",
		},
	});

	await prisma.memo.upsert({
		where: { id: "seed-memo-b01" },
		update: {},
		create: {
			id: "seed-memo-b01",
			projectId: projectB.id,
			createdById: collaborator.id,
			name: "Session log",
			content: {
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "Interview sessions conducted Jan–Feb. Transcripts pending. Begin first-pass coding once transcripts are ready.",
							},
						],
					},
				],
			},
		},
	});

	// -------------------------------------------------------------------------
	// Support tickets
	// -------------------------------------------------------------------------

	// Ticket 1 — OPEN, from owner
	const ticket1 = await prisma.supportTicket.upsert({
		where: { id: "seed-ticket-01" },
		update: {},
		create: {
			id: "seed-ticket-01",
			userId: owner.id,
			subject: "PDF viewer not loading on Firefox",
			description:
				"When I open a document on Firefox 124, the PDF viewer shows a blank white area. The same document works fine on Chrome. Console shows: 'TypeError: Cannot read properties of undefined (reading render)'.",
			status: "IN_PROGRESS",
		},
	});

	await prisma.ticketMessage.upsert({
		where: { id: "seed-ticket-01-msg-01" },
		update: {},
		create: {
			id: "seed-ticket-01-msg-01",
			ticketId: ticket1.id,
			userId: admin.id,
			content:
				"Thanks for the report! This looks like a PDF.js compatibility issue with Firefox's strict CSP. We're investigating. Could you confirm which version of the extension you're using?",
		},
	});

	await prisma.ticketMessage.upsert({
		where: { id: "seed-ticket-01-msg-02" },
		update: {},
		create: {
			id: "seed-ticket-01-msg-02",
			ticketId: ticket1.id,
			userId: owner.id,
			content:
				"I'm using Firefox 124.0.1. No extension installed, this is the self-hosted instance at our university.",
		},
	});

	// Ticket 2 — RESOLVED, from researcher
	const ticket2 = await prisma.supportTicket.upsert({
		where: { id: "seed-ticket-02" },
		update: {},
		create: {
			id: "seed-ticket-02",
			userId: researcher.id,
			subject: "How do I export quotes as Excel?",
			description:
				"I need to share the quotes with a supervisor who only uses Excel. Is there a way to export as .xlsx instead of .csv?",
			status: "RESOLVED",
		},
	});

	await prisma.ticketMessage.upsert({
		where: { id: "seed-ticket-02-msg-01" },
		update: {},
		create: {
			id: "seed-ticket-02-msg-01",
			ticketId: ticket2.id,
			userId: admin.id,
			content:
				"XLSX export is on our roadmap for v2. For now, the CSV export can be opened directly in Excel — just double-click the .csv file and Excel will import it automatically. Let us know if that works for you!",
		},
	});

	// -------------------------------------------------------------------------
	// Done
	// -------------------------------------------------------------------------

	console.log("\n✅ Seed complete.\n");
	console.log("  Accounts:");
	console.log("    admin@qanubis.local          / admin123  (Admin)");
	console.log("    owner@qanubis.local           / user123   (Owner of 'Remote Work Study')");
	console.log("    collaborator@qanubis.local    / user123   (Collaborator on A, Owner of B)");
	console.log("    viewer@qanubis.local          / user123   (Viewer on 'Remote Work Study')");
	console.log("    researcher@qanubis.local      / user123   (Collaborator on A — legacy)");
	console.log("\n  Projects:");
	console.log("    Remote Work Study  — owner + collaborator + viewer + 7 codes + 2 memos");
	console.log("    Interview Archive  — collaborator as owner, owner as viewer + 2 codes + 1 memo");
	console.log("\n  Support tickets:");
	console.log("    #1 IN_PROGRESS — PDF viewer bug (2 replies)");
	console.log("    #2 RESOLVED    — Excel export question (1 reply)");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
