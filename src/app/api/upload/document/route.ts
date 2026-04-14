import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { extractPdfMetadata } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { getStorageProvider } from "@/providers/storage";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_MIME = "application/pdf";
const UUID_RE =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// PDF magic bytes: "%PDF-"
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]);

/**
 * POST /api/upload/document
 *
 * Multipart form fields:
 *   projectId  — string (required)
 *   name       — string (optional, falls back to filename)
 *   description — string (optional)
 *   file       — the PDF binary (required)
 *
 * Responds with the created Document record.
 */
export async function POST(req: NextRequest) {
	// Auth check
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	if (!token?.sub) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const userId = token.sub;

	let formData: FormData;
	try {
		formData = await req.formData();
	} catch {
		return NextResponse.json(
			{ error: "Invalid multipart form data" },
			{ status: 400 },
		);
	}

	const projectId = formData.get("projectId");
	if (typeof projectId !== "string" || !projectId) {
		return NextResponse.json(
			{ error: "projectId is required" },
			{ status: 400 },
		);
	}
	if (!UUID_RE.test(projectId)) {
		return NextResponse.json(
			{ error: "projectId must be a valid UUID" },
			{ status: 400 },
		);
	}

	// Verify the caller is a collaborator or owner in the project
	const member = await prisma.projectMember.findUnique({
		where: { projectId_userId: { projectId, userId } },
	});
	if (!member || member.role === "VIEWER") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const fileEntry = formData.get("file");
	if (!(fileEntry instanceof File)) {
		return NextResponse.json({ error: "file is required" }, { status: 400 });
	}

	if (fileEntry.type !== ALLOWED_MIME) {
		return NextResponse.json(
			{ error: "Only PDF files are accepted" },
			{ status: 415 },
		);
	}
	if (fileEntry.size > MAX_FILE_SIZE) {
		return NextResponse.json(
			{
				error: `File exceeds the 50 MB limit (got ${(fileEntry.size / 1024 / 1024).toFixed(1)} MB)`,
			},
			{ status: 413 },
		);
	}

	const nameField = formData.get("name");
	const description = formData.get("description");
	const documentName =
		typeof nameField === "string" && nameField.trim()
			? nameField.trim()
			: fileEntry.name.replace(/\.pdf$/i, "");

	// Read the file buffer
	const arrayBuffer = await fileEntry.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// Validate PDF magic bytes (%PDF-) to prevent MIME spoofing
	if (
		buffer.length < PDF_MAGIC.length ||
		!buffer.subarray(0, PDF_MAGIC.length).equals(PDF_MAGIC)
	) {
		return NextResponse.json(
			{ error: "File is not a valid PDF" },
			{ status: 415 },
		);
	}

	// Extract metadata from the PDF
	let pageCount = 0;
	let extractedTitle: string | null = null;
	try {
		const meta = await extractPdfMetadata(buffer);
		pageCount = meta.pageCount;
		extractedTitle = meta.extractedTitle;
	} catch {
		// Non-fatal — proceed with defaults
	}

	// Create DB record first to get the ID for the storage key
	const document = await prisma.document.create({
		data: {
			projectId,
			name: documentName,
			description: typeof description === "string" ? description : null,
			mimeType: fileEntry.type,
			storageKey: "", // placeholder, updated after upload
			pageCount,
			fileSize: fileEntry.size,
			extractedTitle,
		},
	});

	const storageKey = `projects/${projectId}/documents/${document.id}.pdf`;

	try {
		const storage = getStorageProvider();
		await storage.upload(storageKey, buffer, ALLOWED_MIME);
	} catch (err) {
		// Roll back the DB record if storage upload fails
		await prisma.document.delete({ where: { id: document.id } });
		console.error("[upload/document] storage upload failed:", err);
		return NextResponse.json(
			{ error: "Storage upload failed" },
			{ status: 502 },
		);
	}

	// Update the record with the real storage key
	const updated = await prisma.document.update({
		where: { id: document.id },
		data: { storageKey },
	});

	return NextResponse.json(updated, { status: 201 });
}
