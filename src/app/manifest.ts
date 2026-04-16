import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "QAnubis — Qualitative Research Analysis",
		short_name: "QAnubis",
		description:
			"Free, open-source platform for qualitative data analysis.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#6366f1",
		icons: [
			{
				src: "/api/icon?size=192",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/api/icon?size=512",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
