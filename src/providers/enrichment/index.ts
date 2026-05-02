import "server-only";
import { CrossrefEnrichmentProvider } from "./crossref";
import type { IEnrichmentProvider } from "./interface";

export type { IEnrichmentProvider } from "./interface";

let instance: IEnrichmentProvider | null = null;

export function getEnrichmentProvider(): IEnrichmentProvider {
	if (instance) return instance;
	instance = new CrossrefEnrichmentProvider();
	return instance;
}
