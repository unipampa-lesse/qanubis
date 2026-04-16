import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXTAUTH_URL ?? "https://qanubis.app";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/dashboard/", "/invite/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
