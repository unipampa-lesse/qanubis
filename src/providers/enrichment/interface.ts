export interface IEnrichmentProvider {
	enrich(documentId: string): Promise<void>;
	schedule(documentIds: string[]): void;
}
