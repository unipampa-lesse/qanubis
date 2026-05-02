import type { IBibtexParser, ParsedBibEntry } from "./interface";

/** Extract a brace-balanced or quote-delimited value starting at pos in s. */
function extractValue(s: string, pos: number): { value: string; end: number } {
	while (pos < s.length && /\s/.test(s[pos])) pos++;

	if (pos >= s.length) return { value: "", end: pos };

	if (s[pos] === "{") {
		let depth = 1;
		let j = pos + 1;
		while (j < s.length && depth > 0) {
			if (s[j] === "{") depth++;
			else if (s[j] === "}") depth--;
			j++;
		}
		return { value: s.slice(pos + 1, j - 1), end: j };
	}

	if (s[pos] === '"') {
		let j = pos + 1;
		while (j < s.length && s[j] !== '"') {
			if (s[j] === "\\") j++;
			j++;
		}
		return { value: s.slice(pos + 1, j), end: j + 1 };
	}

	// Unquoted token (integer year, macro name)
	const m = s.slice(pos).match(/^[^\s,}]+/);
	if (m) return { value: m[0], end: pos + m[0].length };

	return { value: "", end: pos + 1 };
}

/**
 * Walk the input finding all @type{...} blocks.
 * Handles nested braces correctly; skips @comment/@string/@preamble.
 */
function extractEntryBlocks(input: string): Array<{ type: string; body: string }> {
	const results: Array<{ type: string; body: string }> = [];
	let i = 0;

	while (i < input.length) {
		const atPos = input.indexOf("@", i);
		if (atPos === -1) break;

		const typeMatch = input.slice(atPos).match(/^@(\w+)\s*\{/i);
		if (!typeMatch) {
			i = atPos + 1;
			continue;
		}

		const entryType = typeMatch[1].toLowerCase();
		const braceStart = input.indexOf("{", atPos);
		if (braceStart === -1) break;

		let depth = 1;
		let j = braceStart + 1;
		while (j < input.length && depth > 0) {
			if (input[j] === "{") depth++;
			else if (input[j] === "}") depth--;
			j++;
		}

		if (depth === 0 && !["comment", "preamble", "string"].includes(entryType)) {
			results.push({ type: entryType, body: input.slice(braceStart + 1, j - 1) });
		}
		i = j;
	}

	return results;
}

/** Parse field = value pairs from an entry body. Returns a map including _citekey. */
function parseFieldMap(body: string): Map<string, string> {
	const fields = new Map<string, string>();

	const commaIdx = body.indexOf(",");
	if (commaIdx === -1) return fields;

	fields.set("_citekey", body.slice(0, commaIdx).trim());

	let pos = commaIdx + 1;

	while (pos < body.length) {
		while (pos < body.length && /[\s,]/.test(body[pos])) pos++;
		if (pos >= body.length) break;

		const nameMatch = body.slice(pos).match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*=/);
		if (!nameMatch) {
			// Skip past the next comma — handles # concatenation and unexpected tokens
			const next = body.indexOf(",", pos);
			if (next === -1) break;
			pos = next + 1;
			continue;
		}

		const fieldName = nameMatch[1].toLowerCase();
		pos += nameMatch[0].length;

		const { value, end } = extractValue(body, pos);
		fields.set(fieldName, value);
		pos = end;
	}

	return fields;
}

/** Remove common LaTeX markup, leaving plain text. */
function stripLatex(s: string): string {
	return s
		.replace(/\{([^}]*)\}/g, "$1")
		.replace(/\\[a-zA-Z]+\{([^}]*)\}/g, "$1")
		.replace(/\\[a-zA-Z]+\s*/g, "")
		.replace(/\\./g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function parseAuthors(raw: string): string[] {
	if (!raw.trim()) return [];
	return raw
		.split(/\s+and\s+/i)
		.map((a) => a.trim())
		.filter(Boolean);
}

function parseYear(raw: string | undefined): number | null {
	if (!raw) return null;
	const n = Number.parseInt(raw, 10);
	return Number.isFinite(n) && n > 999 && n < 2200 ? n : null;
}

function normalizeDoi(raw: string | undefined): string | null {
	if (!raw?.trim()) return null;
	return raw.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim() || null;
}

export class DefaultBibtexParser implements IBibtexParser {
	parse(input: string): ParsedBibEntry[] {
		const blocks = extractEntryBlocks(input);
		const results: ParsedBibEntry[] = [];

		for (const { type, body } of blocks) {
			const fields = parseFieldMap(body);
			const title = stripLatex(fields.get("title") ?? "");
			if (!title) continue;

			results.push({
				citeKey: fields.get("_citekey") ?? null,
				entryType: type,
				title,
				authors: parseAuthors(fields.get("author") ?? ""),
				year: parseYear(fields.get("year")),
				doi: normalizeDoi(fields.get("doi")),
				abstract: fields.has("abstract")
					? stripLatex(fields.get("abstract") ?? "")
					: null,
				journal: fields.has("journal")
					? stripLatex(fields.get("journal") ?? "")
					: null,
				volume: fields.get("volume") ?? null,
				issue: fields.get("number") ?? fields.get("issue") ?? null,
				pages: fields.get("pages") ?? null,
				publisher: fields.has("publisher")
					? stripLatex(fields.get("publisher") ?? "")
					: null,
				url: fields.get("url") ?? null,
			});
		}

		return results;
	}
}
