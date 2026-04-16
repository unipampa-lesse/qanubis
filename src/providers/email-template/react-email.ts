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
import {
	ResetPasswordEmail,
	resetPasswordSubject,
	resetPasswordText,
} from "./templates/ResetPasswordEmail";
import {
	VerifyEmailEmail,
	verifyEmailSubject,
	verifyEmailText,
} from "./templates/VerifyEmailEmail";
import {
	InviteAcceptedEmail,
	inviteAcceptedSubject,
	inviteAcceptedText,
} from "./templates/InviteAcceptedEmail";

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
			case "reset-password": {
				const d = data as EmailTemplateData["reset-password"];
				const html = await render(createElement(ResetPasswordEmail, d), {
					pretty: false,
				});
				return {
					subject: resetPasswordSubject(),
					html,
					text: resetPasswordText(d),
				};
			}
			case "verify-email": {
				const d = data as EmailTemplateData["verify-email"];
				const html = await render(createElement(VerifyEmailEmail, d), {
					pretty: false,
				});
				return {
					subject: verifyEmailSubject(),
					html,
					text: verifyEmailText(d),
				};
			}
			case "invite-accepted": {
				const d = data as EmailTemplateData["invite-accepted"];
				const html = await render(createElement(InviteAcceptedEmail, d), {
					pretty: false,
				});
				return {
					subject: inviteAcceptedSubject(d.memberName, d.projectName),
					html,
					text: inviteAcceptedText(d),
				};
			}
			default:
				throw new Error(`Unknown email template: ${template}`);
		}
	}
}
