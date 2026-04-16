import type { MetadataRoute } from "next";
import { DOC_SLUGS } from "@/lib/docs";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = process.env.NEXTAUTH_URL ?? "https://qanubis.app";

	const docPages: MetadataRoute.Sitemap = Object.keys(DOC_SLUGS).map(
		(slug) => ({
			url: `${baseUrl}/docs/${slug}`,
			changeFrequency: "weekly",
			priority: 0.7,
		}),
	);

	return [
		{
			url: baseUrl,
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${baseUrl}/docs`,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		...docPages,
		{
			url: `${baseUrl}/signin`,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/signup`,
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];
}
