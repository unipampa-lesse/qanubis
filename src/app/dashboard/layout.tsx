import type { Metadata } from "next";
import DashboardLayoutClient from "./DashboardLayoutClient";

export const metadata: Metadata = {
	title: {
		template: "%s — QAnubis",
		default: "Dashboard",
	},
	description: "Manage your qualitative research projects in QAnubis.",
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
