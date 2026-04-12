export interface SendEmailOptions {
	to: string | string[];
	subject: string;
	html: string;
	text?: string;
}

export interface IEmailProvider {
	send(options: SendEmailOptions): Promise<void>;
}
