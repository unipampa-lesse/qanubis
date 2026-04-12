import "server-only";
import { render } from "@react-email/render";
import { createElement } from "react";
import type {
	EmailTemplateData,
	EmailTemplateName,
	IEmailTemplateProvider,
	RenderedEmail,
} from "./interface";
import {
	ProjectInviteEmail,
	projectInviteSubject,
	projectInviteText,
} from "./templates/ProjectInviteEmail";

export class ReactEmailTemplateProvider implements IEmailTemplateProvider {
	async render<T extends EmailTemplateName>(
		template: T,
		data: EmailTemplateData[T],
	): Promise<RenderedEmail> {
		switch (template) {
			case "project-invite": {
				const d = data as EmailTemplateData["project-invite"];
				const html = await render(createElement(ProjectInviteEmail, d), {
					pretty: false,
				});
				return {
					subject: projectInviteSubject(d.inviterName, d.projectName),
					html,
					text: projectInviteText(d),
				};
			}
			default:
				throw new Error(`Unknown email template: ${template}`);
		}
	}
}
