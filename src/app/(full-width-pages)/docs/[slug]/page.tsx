import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPageContent } from "@/components/docs/DocsPageContent";

const PAGE_TITLES: Record<string, string> = {
	"user-manual": "User Manual",
	faq: "FAQ",
	contact: "Contact",
	"how-to-contribute": "How to Contribute",
	features: "Features",
	"domain-model": "Domain Model",
	architecture: "Architecture",
	"migration-plan": "Migration Plan",
	"contribution-guidelines": "Contribution Guidelines",
};

const VALID_SLUGS = new Set(Object.keys(PAGE_TITLES));

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<Metadata> {
	const { slug } = await params;
	const title = PAGE_TITLES[slug];
	if (!title) return {};
	return {
		title: `${title} — QAnubis Docs`,
	};
}

export function generateStaticParams() {
	return Object.keys(PAGE_TITLES).map((slug) => ({ slug }));
}

export default async function DocsPage({ params }: { params: Params }) {
	const { slug } = await params;

	if (!VALID_SLUGS.has(slug)) {
		notFound();
	}

	return <DocsPageContent slug={slug} />;
}
