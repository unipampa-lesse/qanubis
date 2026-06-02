import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { extractPdfMetadata } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { getStorageProvider } from "@/providers/storage";
import { recordAuditEventSafe } from "@/server/services/audit";

const log = logger.child({ module: "upload/bibtex-pdf" });

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]);
const DOC_ID_RE = /^[a-z0-9][\w-]{1,}$/i;

/**
 * POST /api/upload/bibtex-pdf
 *
 * Attaches or replaces a PDF for a bib-sourced Document.
 * Multipart fields:
 *   projectId  — string (required)
 *   documentId — string (required)
 *   file       — PDF binary (required)
 */
export async function POST(req: NextRequest) {
	const token = await getToken({ req, secret: env.NEXTAUTH_SECRET });
	if (!token?.sub) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const userId = token.sub;

	const allowed = await checkRateLimit(`upload:${userId}`, {
		windowMs: 60 * 60 * 1000,
		max: 30,
	});
	if (!allowed) {
		return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
	}

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
	const documentId = formData.get("documentId");

	if (
		typeof projectId !== "string" ||
		!projectId ||
		!DOC_ID_RE.test(projectId)
	) {
		return NextResponse.json(
			{ error: "projectId is required" },
			{ status: 400 },
		);
	}
	if (typeof documentId !== "string" || !documentId) {
		return NextResponse.json(
			{ error: "documentId is required" },
			{ status: 400 },
		);
	}

	const member = await prisma.projectMember.findUnique({
		where: { projectId_userId: { projectId, userId } },
	});
	if (!member || member.role === "VIEWER") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const doc = await prisma.document.findUnique({
		where: { id: documentId, projectId },
		select: { id: true, storageKey: true },
	});
	if (!doc) {
		return NextResponse.json({ error: "Document not found" }, { status: 404 });
	}

	const fileEntry = formData.get("file");
	if (!(fileEntry instanceof File)) {
		return NextResponse.json({ error: "file is required" }, { status: 400 });
	}
	if (fileEntry.type !== "application/pdf") {
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

	const buffer = Buffer.from(await fileEntry.arrayBuffer());
	if (
		buffer.length < PDF_MAGIC.length ||
		!buffer.subarray(0, PDF_MAGIC.length).equals(PDF_MAGIC)
	) {
		return NextResponse.json(
			{ error: "File is not a valid PDF" },
			{ status: 415 },
		);
	}

	const storage = getStorageProvider();

	// Remove previous PDF if it exists at a different key
	const newKey = `projects/${projectId}/documents/${documentId}.pdf`;
	if (doc.storageKey && doc.storageKey !== newKey) {
		await storage.delete(doc.storageKey).catch(() => {});
	}

	try {
		await storage.upload(newKey, buffer, "application/pdf");
	} catch (err) {
		log.error({ err }, "storage upload failed");
		return NextResponse.json(
			{ error: "Storage upload failed" },
			{ status: 502 },
		);
	}

	let pageCount = 0;
	try {
		const meta = await extractPdfMetadata(buffer);
		pageCount = meta.pageCount;
	} catch {
		// non-fatal
	}

	const updated = await prisma.document.update({
		where: { id: documentId },
		data: { storageKey: newKey, fileSize: buffer.length, pageCount },
	});

	await recordAuditEventSafe({
		projectId,
		actorId: userId,
		action: "DOCUMENT_PDF_ATTACHED",
		entityType: "DOCUMENT",
		entityId: updated.id,
		summary: `PDF attached to document: ${updated.name}`,
		details: {
			fileSize: updated.fileSize,
			pageCount: updated.pageCount,
			source: updated.source,
		},
	});

	return NextResponse.json(updated, { status: 200 });
}
