import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPageContent } from "@/components/docs/DocsPageContent";
import { DOC_SLUGS } from "@/lib/docs";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<Metadata> {
	const { slug } = await params;
	const title = DOC_SLUGS[slug as keyof typeof DOC_SLUGS];
	if (!title) notFound();
	return {
		title: `${title} — Docs`,
		description: `QAnubis documentation: ${title}. Learn how to use QAnubis for qualitative research analysis.`,
		alternates: { canonical: `/docs/${slug}` },
	};
}

export function generateStaticParams() {
	return Object.keys(DOC_SLUGS).map((slug) => ({ slug }));
}

export default async function DocsPage({ params }: { params: Params }) {
	const { slug } = await params;

	if (!(slug in DOC_SLUGS)) {
		notFound();
	}

	return <DocsPageContent slug={slug} />;
}
