export interface RenderedEmail {
	subject: string;
	html: string;
	text: string;
}

/**
 * Known email templates. Add a new entry here each time a new template is created.
 * The union type ensures callers can only reference templates that actually exist.
 */
export type EmailTemplateName = "project-invite" | "reset-password";

/** Data shapes expected by each template. */
export interface EmailTemplateData {
	"project-invite": {
		inviterName: string;
		projectName: string;
		role: string;
		acceptUrl: string;
	};
	"reset-password": {
		resetUrl: string;
	};
}

export interface IEmailTemplateProvider {
	/**
	 * Renders a named template with the provided data.
	 * Returns the final subject, HTML body, and plain-text body.
	 */
	render<T extends EmailTemplateName>(
		template: T,
		data: EmailTemplateData[T],
	): Promise<RenderedEmail>;
}
