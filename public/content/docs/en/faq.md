# Frequently Asked Questions

## General

**What is QAnubis?**
QAnubis is a CAQDAS (Computer-Assisted Qualitative Data Analysis) platform. It lets researchers upload PDF documents, select text passages to create quotes, organize them with a hierarchical code scheme, write collaborative memos, and generate visual reports — all within a shared project workspace.

**What file formats are supported?**
PDF only. Other formats (DOCX, images) are planned for a future release. If you have a scanned document without a text layer, the viewer will display a warning banner and text selection will not be available.

**Is QAnubis free?**
Yes. QAnubis is open-source (MIT license). You can use the hosted instance or self-host your own — see [Architecture](/docs/architecture) for deployment options.

---

## Account

**How do I verify my email after signing up?**
After you create your account, a verification email is sent to the address you provided. Click the link in that email to activate your account. If you don't see it, check your spam folder. You can request a new link from the sign-in page.

**I forgot my password. What do I do?**
Click **Forgot password?** on the sign-in page and enter your email address. A reset link will be sent if an account with that email exists.

**Can I sign in with Google or GitHub instead of email?**
Yes, if the instance you're using has OAuth configured. Look for the **Continue with Google** or **Continue with GitHub** buttons on the sign-in page. OAuth accounts do not have a local password.

**How do I delete my account?**
Go to **Profile** and scroll to the **Delete account** section. Deleting your account is permanent and removes your personal data, but it does not delete projects you belong to — you will simply be removed as a member.

---

## Projects & Collaboration

**How do invitations work?**
Project owners can invite anyone by email from the **Members** tab. The invited person receives a link valid for 48 hours. If they don't have an account, they can sign up first and then visit the invite link to join. After 48 hours the link expires, but the owner can send a new one.

**How do I change a member's role?**
Open the **Members** tab (owner only), click the role badge next to the member's name, and select the new role. Roles are: Owner, Collaborator, and Viewer.

**What is the difference between roles?**

| Action | Owner | Collaborator | Viewer |
|--------|-------|-------------|--------|
| View all content | ✅ | ✅ | ✅ |
| Create/edit/delete quotes, codes, memos | ✅ | ✅ | ❌ |
| Invite/remove members | ✅ | ❌ | ❌ |
| Edit project settings | ✅ | ❌ | ❌ |
| Delete project | ✅ | ❌ | ❌ |

**Can multiple people work in the same project at the same time?**
Yes. All members share the same documents, codes, quotes, and memos in real time (changes appear after page refresh or navigation).

---

## Documents & Quotes

**What happens to quotes if I delete a document?**
All quotes associated with that document are permanently deleted, including their code assignments and comments.

**What happens if I delete a code that has quotes assigned?**
The code is removed from all quotes it was assigned to. The quotes themselves are not deleted. If you want to reassign them, do so before deleting the code.

**Can I change the highlight color of a quote?**
Yes. Click the colored circle on the quote card in the PDF viewer sidebar to open a color picker.

---

## Reports & Export

**Can I export my data?**
Yes. The **Reports** tab offers downloads in plain text and CSV format, grouped either by code or by document.

**What charts are available in Reports?**
- **Quotes × Codes heatmap** — shows which codes appear in which documents
- **Code co-occurrence heatmap** — shows which codes appear together in the same quotes
- Charts require at least one quote with a code assigned to render.

---

## Self-hosting

**How do I run QAnubis locally?**
See the [Contribution Guidelines](/docs/contribution-guidelines) for a step-by-step local setup guide.

**What infrastructure does QAnubis need?**
A PostgreSQL database, an S3-compatible object storage (AWS S3, Cloudflare R2, or MinIO), and an SMTP server for email. All can run locally via Docker Compose for development.
