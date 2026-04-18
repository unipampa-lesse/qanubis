import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	const email = process.env.ADMIN_EMAIL;
	const password = process.env.ADMIN_PASSWORD;

	if (!email || !password) {
		throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
	}

	const hash = await bcrypt.hash(password, 12);
	await prisma.user.upsert({
		where: { email },
		update: { role: "ADMIN", emailVerified: new Date() },
		create: {
			name: "Admin",
			email,
			password: hash,
			emailVerified: new Date(),
			role: "ADMIN",
		},
	});

	console.log(`✅ Admin upserted: ${email}`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
