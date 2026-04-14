import type { NextConfig } from "next";

const securityHeaders = [
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "X-XSS-Protection", value: "1; mode=block" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
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

export default nextConfig;
