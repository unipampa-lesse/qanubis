import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "Profile | QAnubis",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
