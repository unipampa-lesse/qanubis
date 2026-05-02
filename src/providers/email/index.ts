import "server-only";
import { NodemailerEmailProvider } from "./nodemailer";
import type { IEmailProvider } from "./interface";

export type { IEmailProvider, SendEmailOptions } from "./interface";

let instance: IEmailProvider | null = null;

export function getEmailProvider(): IEmailProvider {
	if (instance) return instance;
	instance = new NodemailerEmailProvider();
	return instance;
}
