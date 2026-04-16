import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "QAnubis — Qualitative Research Analysis Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #6366f1 100%)",
				fontFamily: "system-ui, sans-serif",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 120,
					height: 120,
					borderRadius: 28,
					background: "rgba(255,255,255,0.15)",
					marginBottom: 32,
					fontSize: 72,
					fontWeight: 700,
					color: "#fff",
				}}
			>
				Q
			</div>
			<div
				style={{
					fontSize: 56,
					fontWeight: 700,
					color: "#fff",
					letterSpacing: "-0.02em",
					marginBottom: 16,
				}}
			>
				QAnubis
			</div>
			<div
				style={{
					fontSize: 24,
					color: "rgba(255,255,255,0.8)",
					maxWidth: 700,
					textAlign: "center",
					lineHeight: 1.4,
				}}
			>
				Open-Source Qualitative Research Analysis Platform
			</div>
		</div>,
		{ ...size },
	);
}
