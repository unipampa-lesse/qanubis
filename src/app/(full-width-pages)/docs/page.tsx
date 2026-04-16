import type { Metadata } from "next";
import { DocsPageContent } from "@/components/docs/DocsPageContent";

export const metadata: Metadata = {
	title: "Documentation",
	description:
		"Complete QAnubis documentation: user manual, FAQ, architecture and contribution guides.",
};

export default function DocsHomePage() {
	return <DocsPageContent slug="home" />;
}
