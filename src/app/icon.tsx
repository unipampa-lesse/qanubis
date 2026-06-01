import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				background: "#465fff",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: "22%",
			}}
		>
			<span
				style={{
					color: "white",
					fontSize: 112,
					fontWeight: 700,
					letterSpacing: "-3px",
					lineHeight: 1,
				}}
			>
				Q
			</span>
		</div>,
		size,
	);
}
