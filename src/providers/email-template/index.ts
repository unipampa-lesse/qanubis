import "server-only";
import type { IEmailTemplateProvider } from "./interface";
import { ReactEmailTemplateProvider } from "./react-email";

let instance: IEmailTemplateProvider | null = null;

/**
 * Returns the active email template provider.
 * Extend this factory when a new provider is added (e.g. database-backed templates).
 */
export function getEmailTemplateProvider(): IEmailTemplateProvider {
	if (!instance) {
		instance = new ReactEmailTemplateProvider();
	}
	return instance;
}

export type { IEmailTemplateProvider, RenderedEmail } from "./interface";
