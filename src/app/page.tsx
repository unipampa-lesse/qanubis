import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LandingContent from "@/components/landing/LandingContent";
import { getAuthSession } from "@/server/get-server-session";

export const metadata: Metadata = {
	title: "QAnubis — Open-Source Qualitative Research Analysis",
	description:
		"QAnubis is a free, open-source platform for qualitative data analysis. Upload research documents, code text passages, collaborate with your team, and generate insightful reports.",
};

export default async function LandingPage() {
	const session = await getAuthSession();
	if (session) redirect("/dashboard");

	return <LandingContent />;
}
