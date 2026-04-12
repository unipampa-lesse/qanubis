import nodemailer from "nodemailer";
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
			host: process.env.SMTP_HOST!,
			port: Number(process.env.SMTP_PORT ?? 1025),
			secure: false,
			auth: process.env.SMTP_USER
				? {
						user: process.env.SMTP_USER,
						pass: process.env.SMTP_PASS,
					}
				: undefined,
		});
	}

	async send(options: SendEmailOptions): Promise<void> {
		await this.transporter.sendMail({
			from: process.env.SMTP_FROM ?? "QAnubis <noreply@qanubis.app>",
			to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
		});
	}
}
