import { redirect } from "next/navigation";
import LandingContent from "@/components/landing/LandingContent";
import { getAuthSession } from "@/server/get-server-session";

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebApplication",
	name: "QAnubis",
	url: process.env.NEXTAUTH_URL ?? "https://qanubis.app",
	description:
		"Free, open-source platform for qualitative data analysis. Upload documents, code passages, collaborate, and generate reports.",
	applicationCategory: "ResearchApplication",
	operatingSystem: "Web",
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "USD",
	},
	isAccessibleForFree: true,
	license: "https://opensource.org/licenses/MIT",
};

export default async function LandingPage() {
	const session = await getAuthSession();
	if (session) redirect("/dashboard");

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<LandingContent />
		</>
	);
}
