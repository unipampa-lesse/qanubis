import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import Providers from "./Providers";
import { GoogleAnalytics } from "@/components/common/GoogleAnalytics";
import ServiceWorkerRegistration from "@/components/common/ServiceWorkerRegistration";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfit = Outfit({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXTAUTH_URL ?? "https://qanubis.app",
	),
	title: {
		default: "QAnubis — Open-Source Qualitative Research Analysis",
		template: "%s — QAnubis",
	},
	description:
		"QAnubis is a free, open-source platform for qualitative data analysis. Upload research documents, code text passages, collaborate with your team, and generate insightful reports.",
	openGraph: {
		type: "website",
		locale: "pt_BR",
		alternateLocale: ["en_US", "es_ES"],
		siteName: "QAnubis",
		title: "QAnubis — Open-Source Qualitative Research Analysis",
		description:
			"Free, open-source platform for qualitative data analysis. Upload documents, code passages, collaborate, and generate reports.",
	},
	twitter: {
		card: "summary_large_image",
		title: "QAnubis — Open-Source Qualitative Research Analysis",
		description:
			"Free, open-source platform for qualitative data analysis. Upload documents, code passages, collaborate, and generate reports.",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

};

export const viewport: Viewport = {
	themeColor: "#465fff",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt" suppressHydrationWarning>
			<body className={`${outfit.className} dark:bg-gray-900`}>
				<GoogleAnalytics />
				<Analytics />
				<SpeedInsights />
				<ServiceWorkerRegistration />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
