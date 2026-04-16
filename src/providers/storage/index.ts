import "server-only";
import type { IStorageProvider } from "./interface";

export type { IStorageProvider };

let instance: IStorageProvider | null = null;

/**
 * Returns the active storage provider based on STORAGE_PROVIDER env var.
 *
 * STORAGE_PROVIDER=s3    → S3StorageProvider (AWS S3, Cloudflare R2, MinIO)
 *
 * For local development, MinIO runs via Docker Compose and uses the same
 * S3-compatible API. No separate provider implementation is needed.
 *
 * The instance is cached for the lifetime of the process.
 */
export function getStorageProvider(): IStorageProvider {
	if (instance) return instance;

	const provider = process.env.STORAGE_PROVIDER ?? "s3";

	switch (provider) {
		case "s3": {
			const { S3StorageProvider } = require("./s3") as typeof import("./s3");
			instance = new S3StorageProvider();
			return instance;
		}
		default:
			throw new Error(`Unknown STORAGE_PROVIDER: "${provider}"`);
	}
}
