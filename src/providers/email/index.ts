import "server-only";
import type { IEmailProvider } from "./interface";

export type { IEmailProvider, SendEmailOptions } from "./interface";

let instance: IEmailProvider | null = null;

/**
 * Returns the active email provider based on EMAIL_PROVIDER env var.
 *
 * EMAIL_PROVIDER=nodemailer → NodemailerEmailProvider (default)
 *   Uses SMTP — MailHog for local dev, any SMTP for production.
 *
 * To add a new provider (e.g. Resend):
 *   1. Create src/providers/email/resend.ts implementing IEmailProvider
 *   2. Add a case here
 *   3. Set EMAIL_PROVIDER=resend in your environment
 */
export function getEmailProvider(): IEmailProvider {
	if (instance) return instance;

	const provider = process.env.EMAIL_PROVIDER ?? "nodemailer";

	switch (provider) {
		case "nodemailer": {
			const { NodemailerEmailProvider } =
				require("./nodemailer") as typeof import("./nodemailer");
			instance = new NodemailerEmailProvider();
			break;
		}
		default:
			throw new Error(`Unknown EMAIL_PROVIDER: "${provider}"`);
	}

	return instance!;
}
