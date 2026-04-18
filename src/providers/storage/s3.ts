import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";
import type { IStorageProvider } from "./interface";

/**
 * S3-compatible storage provider.
 * Works with AWS S3, Cloudflare R2, MinIO, and any S3-compatible service.
 *
 * Required env vars:
 *   STORAGE_ENDPOINT  - e.g. http://localhost:9000 (MinIO) or https://<account>.r2.cloudflarestorage.com (R2)
 *   STORAGE_REGION    - e.g. "us-east-1" or "auto" for R2
 *   STORAGE_ACCESS_KEY
 *   STORAGE_SECRET_KEY
 *   STORAGE_BUCKET
 */
export class S3StorageProvider implements IStorageProvider {
	private client: S3Client;
	private bucket: string;

	constructor() {
		this.bucket = env.STORAGE_BUCKET;
		this.client = new S3Client({
			endpoint: env.STORAGE_ENDPOINT,
			region: env.STORAGE_REGION,
			credentials: {
				accessKeyId: env.STORAGE_ACCESS_KEY,
				secretAccessKey: env.STORAGE_SECRET_KEY,
			},
			// Required for MinIO and Cloudflare R2 path-style URLs
			forcePathStyle: true,
		});
	}

	async upload(
		key: string,
		buffer: Buffer,
		contentType: string,
	): Promise<void> {
		await this.client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: buffer,
				ContentType: contentType,
			}),
		);
	}

	async getPresignedUrl(
		key: string,
		expiresInSeconds = 300,
		options?: { filename?: string },
	): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
			...(options?.filename && {
				ResponseContentDisposition: `attachment; filename="${options.filename.replace(/[\r\n"\\]/g, "").slice(0, 200)}"`,
			}),
		});
		return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
	}

	async delete(key: string): Promise<void> {
		await this.client.send(
			new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
		);
	}

	async exists(key: string): Promise<boolean> {
		try {
			await this.client.send(
				new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
			);
			return true;
		} catch {
			return false;
		}
	}
}
