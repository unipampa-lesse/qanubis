import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "X-Content-Type-Options", value: "nosniff" },

	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
	{
		key: "Content-Security-Policy",
		value: [
			"default-src 'self'",
			`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://va.vercel-scripts.com`,
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"img-src 'self' data: blob: https://www.gravatar.com https://www.google-analytics.com",
			"font-src 'self' https://fonts.gstatic.com",
			"connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://vitals.vercel-insights.com",
			"frame-ancestors 'none'",
			"base-uri 'self'",
			"form-action 'self'",
			"object-src 'none'",
		].join("; "),
	},
];

const nextConfig: NextConfig = {
	output: "standalone",
	async headers() {
		return [
			{
				source: "/:path*",
				headers: securityHeaders,
			},
		];
	},
};

export default withBundleAnalyzer(nextConfig);
