import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "QAnubis",
		short_name: "QAnubis",
		description: "Plataforma open-source de análise qualitativa de dados",
		start_url: "/dashboard",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#465fff",
		orientation: "natural",
		categories: ["education", "productivity"],
		icons: [
			{
				src: "/icon",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/apple-icon",
				sizes: "180x180",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}
