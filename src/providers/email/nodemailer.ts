import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import type { IEmailProvider, SendEmailOptions } from "./interface";

/**
 * Nodemailer-based email provider.
 * Connects to any SMTP server — MailHog for local dev, Brevo/Gmail/etc for production.
 *
 * Required env vars:
 *   SMTP_HOST
 *   SMTP_PORT
 *   SMTP_USER  (leave empty for MailHog)
 *   SMTP_PASS  (leave empty for MailHog)
 *   SMTP_FROM  - e.g. "QAnubis <noreply@qanubis.app>"
 */
export class NodemailerEmailProvider implements IEmailProvider {
	private transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			secure: env.SMTP_PORT === 465,
			auth: env.SMTP_USER
				? {
						user: env.SMTP_USER,
						pass: env.SMTP_PASS,
					}
				: undefined,
		});
	}

	async send(options: SendEmailOptions): Promise<void> {
		await this.transporter.sendMail({
			from: env.SMTP_FROM,
			to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
		});
	}
}
