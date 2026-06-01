import "server-only";
import { S3StorageProvider } from "./s3";
import type { IStorageProvider } from "./interface";

export type { IStorageProvider };

let instance: IStorageProvider | null = null;

export function getStorageProvider(): IStorageProvider {
	if (instance) return instance;
	instance = new S3StorageProvider();
	return instance;
}
