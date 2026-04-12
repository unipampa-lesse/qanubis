export interface IStorageProvider {
	/**
	 * Upload a file to object storage.
	 * @param key - Object path, e.g. "projects/abc/documents/def.pdf"
	 * @param buffer - File contents
	 * @param contentType - MIME type, e.g. "application/pdf"
	 */
	upload(key: string, buffer: Buffer, contentType: string): Promise<void>;

	/**
	 * Generate a pre-signed URL for temporary read access.
	 * @param key - Object path
	 * @param expiresInSeconds - Defaults to 3600 (1 hour)
	 * @param options.filename - When set, adds ResponseContentDisposition: attachment to force download
	 */
	getPresignedUrl(
		key: string,
		expiresInSeconds?: number,
		options?: { filename?: string },
	): Promise<string>;

	/**
	 * Delete an object from storage.
	 */
	delete(key: string): Promise<void>;

	/**
	 * Check whether an object exists.
	 */
	exists(key: string): Promise<boolean>;
}
