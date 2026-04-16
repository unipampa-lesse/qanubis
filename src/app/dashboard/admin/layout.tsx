import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type React from "react";

export const metadata: Metadata = {
	title: "Administration",
};

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/server/get-server-session";

export default async function AdminAreaLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getAuthSession();
	if (!session?.user?.id) redirect("/auth/signin");

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { role: true },
	});

	if (!user || user.role !== "ADMIN") redirect("/dashboard");

	return <>{children}</>;
}
