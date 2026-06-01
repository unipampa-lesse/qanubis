import "server-only";
import type { IEmailProvider } from "./interface";
import { NodemailerEmailProvider } from "./nodemailer";

export type { IEmailProvider, SendEmailOptions } from "./interface";

let instance: IEmailProvider | null = null;

export function getEmailProvider(): IEmailProvider {
	if (instance) return instance;
	instance = new NodemailerEmailProvider();
	return instance;
}
