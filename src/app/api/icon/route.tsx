import { ImageResponse } from "next/og";
import { type NextRequest, NextResponse } from "next/server";

const VALID_SIZES = new Set([192, 512]);

export const runtime = "edge";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const size = Number(searchParams.get("size"));

	if (!VALID_SIZES.has(size)) {
		return NextResponse.json({ error: "Invalid size" }, { status: 400 });
	}

	const response = new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: size * 0.2,
				background: "linear-gradient(135deg, #4f46e5, #6366f1)",
				fontFamily: "system-ui, sans-serif",
				fontSize: size * 0.55,
				fontWeight: 700,
				color: "#fff",
			}}
		>
			Q
		</div>,
		{ width: size, height: size },
	);
	response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
	return response;
}
