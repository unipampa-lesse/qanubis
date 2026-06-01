import "server-only";
import { DefaultBibtexParser } from "./default";
import type { IBibtexParser } from "./interface";

export type { IBibtexParser, ParsedBibEntry } from "./interface";

let instance: IBibtexParser | null = null;

export function getBibtexParser(): IBibtexParser {
	if (instance) return instance;
	instance = new DefaultBibtexParser();
	return instance;
}
