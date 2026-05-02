export interface ParsedBibEntry {
	citeKey: string | null;
	entryType: string;
	title: string;
	authors: string[];
	year: number | null;
	doi: string | null;
	abstract: string | null;
	journal: string | null;
	volume: string | null;
	issue: string | null;
	pages: string | null;
	publisher: string | null;
	url: string | null;
}

export interface IBibtexParser {
	parse(input: string): ParsedBibEntry[];
}
