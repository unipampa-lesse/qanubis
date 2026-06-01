import "server-only";
import type { IStorageProvider } from "./interface";
import { S3StorageProvider } from "./s3";

export type { IStorageProvider };

let instance: IStorageProvider | null = null;

export function getStorageProvider(): IStorageProvider {
	if (instance) return instance;
	instance = new S3StorageProvider();
	return instance;
}
