import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🌱 Seeding database...");

	// Admin user
	const adminPassword = await bcrypt.hash("admin123", 12);
	const admin = await prisma.user.upsert({
		where: { email: "admin@qanubis.local" },
		update: {
			name: "Admin",
			password: adminPassword,
			emailVerified: new Date(),
			role: "ADMIN",
		},
		create: {
			name: "Admin",
			email: "admin@qanubis.local",
			password: adminPassword,
			emailVerified: new Date(),
			role: "ADMIN",
		},
	});

	// Regular researcher user
	const userPassword = await bcrypt.hash("user123", 12);
	const researcher = await prisma.user.upsert({
		where: { email: "researcher@qanubis.local" },
		update: {
			name: "Researcher",
			password: userPassword,
			emailVerified: new Date(),
			role: "USER",
		},
		create: {
			name: "Researcher",
			email: "researcher@qanubis.local",
			password: userPassword,
			emailVerified: new Date(),
			role: "USER",
		},
	});

	// Sample project
	const project = await prisma.project.upsert({
		where: { id: "seed-project-01" },
		update: {},
		create: {
			id: "seed-project-01",
			name: "Sample Research Project",
			description: "A sample project to explore QAnubis features.",
			color: "#6366f1",
		},
	});

	// Make researcher the owner
	await prisma.projectMember.upsert({
		where: {
			projectId_userId: {
				projectId: project.id,
				userId: researcher.id,
			},
		},
		update: {},
		create: {
			projectId: project.id,
			userId: researcher.id,
			role: "OWNER",
		},
	});

	// Sample codes
	const codeInterview = await prisma.code.upsert({
		where: { id: "seed-code-01" },
		update: {},
		create: {
			id: "seed-code-01",
			projectId: project.id,
			name: "Interview",
			color: "#3b82f6",
			textColor: "#ffffff",
			description: "Quotes from interview transcripts",
		},
	});

	await prisma.code.upsert({
		where: { id: "seed-code-02" },
		update: {},
		create: {
			id: "seed-code-02",
			projectId: project.id,
			parentId: codeInterview.id,
			name: "Challenges",
			color: "#ef4444",
			textColor: "#ffffff",
			description: "Challenges mentioned by participants",
		},
	});

	await prisma.code.upsert({
		where: { id: "seed-code-03" },
		update: {},
		create: {
			id: "seed-code-03",
			projectId: project.id,
			parentId: codeInterview.id,
			name: "Opportunities",
			color: "#22c55e",
			textColor: "#ffffff",
			description: "Opportunities mentioned by participants",
		},
	});

	// Sample memo
	await prisma.memo.upsert({
		where: { id: "seed-memo-01" },
		update: {},
		create: {
			id: "seed-memo-01",
			projectId: project.id,
			createdById: researcher.id,
			name: "Initial observations",
			content: {
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "This is a sample memo. Use memos to record research notes, hypotheses, and observations throughout your analysis.",
							},
						],
					},
				],
			},
		},
	});

	console.log("✅ Seed complete.");
	console.log("   Admin:      admin@qanubis.local      / admin123");
	console.log("   Researcher: researcher@qanubis.local / user123");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
