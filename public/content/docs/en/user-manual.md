# User Manual

This manual covers every feature available in QAnubis v1. Use the table of contents below to jump to any section.

---

## Table of Contents

1. [Getting started](#getting-started)
2. [Your account](#your-account)
3. [Projects](#projects)
4. [Documents](#documents)
5. [PDF viewer & quote extraction](#pdf-viewer--quote-extraction)
6. [Code scheme](#code-scheme)
7. [Memos](#memos)
8. [Reports](#reports)
9. [Support](#support)
10. [Admin panel](#admin-panel) *(admin only)*

---

## Getting started

### Sign up

Visit `/auth/signup` and fill in your first name, last name, email, and a password of at least 8 characters. Your account is active immediately — no email verification required.

### Sign in

Visit `/auth/signin` and enter your email and password, or use **Continue with Google / GitHub** if your instance has OAuth configured.

Enable **Keep me logged in** to extend your session to 30 days (default is 24 hours).

### Password reset

Click **Forgot password?** on the sign-in page and enter your email. A reset link will be sent if the email address exists in the system.

---

## Your account

Click your name in the top-right header to open the user menu.

### Profile

Go to **Profile** to update your display name. Changes take effect immediately across the application.

### Change password

On the **Profile** page, scroll to **Change password**. You must enter your current password before setting a new one. This section is hidden for accounts that signed up with Google or GitHub (OAuth accounts have no local password).

---

## Projects

Projects are the top-level container for all your research material. Each project has its own documents, codes, memos, and reports.

### Create a project

On the dashboard, click **New project**. Fill in:
- **Name** (required, max 100 characters)
- **Description** (optional)
- **Color** — choose a color from the palette to visually identify the project in your list

### Edit a project

Open the project and click **Edit project** (pencil icon, top-right, owner only). You can update the name, description, and color.

### Delete a project

Click **Delete project** (top-right, owner only) and confirm the dialog. This permanently removes all documents, quotes, codes, and memos inside the project.

### Collaboration

#### Invite a collaborator

Open the **Members** tab and enter the email address of the person you want to invite. They will receive an invitation link. If they don't have an account yet, they can sign up first and then visit the invite link.

#### Roles

| Role | Can edit content | Can manage members | Can delete project |
|------|-----------------|-------------------|-------------------|
| Owner | ✅ | ✅ | ✅ |
| Collaborator | ✅ | ❌ | ❌ |
| Viewer | ❌ | ❌ | ❌ |

#### Leave a project

Non-owners can leave a project from the **Members** tab using the **Leave** button next to their own name.

#### Transfer ownership

Owners can promote another member to Owner from the **Members** tab. The original owner becomes a Collaborator.

---

## Documents

### Upload a PDF

Open the **Documents** tab of a project and click **Upload PDF**. Select a PDF file (max 50 MB). The app extracts page count and embedded title metadata automatically.

### Open a document

Click the document name to open it in the PDF viewer.

### Download a document

Click the download icon (↓) in the document row to download the original PDF file.

### Delete a document

Click the trash icon in the document row (Collaborator/Owner only). This removes the file from storage and deletes all associated quotes.

---

## PDF viewer & quote extraction

### Navigating the document

Use the **← →** buttons to navigate between pages.

### Selecting text and creating a quote

1. Click and drag over text in the PDF to select it.
2. A **Quote** button appears near your selection — click it to create the quote.
3. The new quote is added to the sidebar on the right.

> **Scanned documents:** If the PDF was created by scanning a physical document without OCR, a warning banner will appear at the top of the viewer. Text selection is not available for scanned PDFs.

### Quote sidebar

All quotes are listed on the right, grouped by page. Each quote card shows:
- The selected text
- Assigned code badges
- The highlight color
- A comment count button

#### Assign a code

Click **Assign code** inside the quote card and select a code from the picker. You can assign multiple codes to the same quote.

#### Remove a code

Click the **×** next to a code badge on a quote card.

#### Change highlight color

Click the colored circle on the quote card to open a color picker.

#### Add a comment

Click the comment count button to expand the comment thread. Type in the input and press **Enter** or click **Send**.

#### Delete a quote

Click the trash icon on the quote card (Collaborator/Owner only) and confirm the dialog. This removes all code assignments and comments too.

### Highlights in the viewer

Existing quotes are overlaid on the PDF as colored highlights. Click any highlight to scroll the sidebar to that quote.

---

## Code scheme

Codes (also called categories or tags) are the labels you apply to quotes to organize your analysis.

### Create a code

Open the **Codes** tab and click **New code** or **+ Add sub-code** on an existing code. Fill in:
- **Name** (required)
- **Background color** — pick from the color palette
- **Text color** — auto-calculated for contrast, but adjustable
- **Description** (optional)

### Hierarchy

Codes support unlimited parent-child nesting. Child codes appear indented under their parent in the tree. Deleting a parent makes its children root-level codes — they are **not** deleted.

### Edit a code

Click the pencil icon on any code row.

### Delete a code

Click the trash icon. A confirmation panel shows how many quotes use this code and how many sub-codes it has. Deleting a code removes all its quote associations.

---

## Memos

Memos are shared research notes visible to all project members.

### Create a memo

Open the **Memos** tab and click **New memo**. The memo opens immediately in the editor.

### Edit a memo

- **Title**: Click the memo title to edit it inline. Press **Enter** or click away to save.
- **Content**: The rich-text editor auto-saves 800 ms after you stop typing. A "Saving…" / "Saved" indicator appears next to the title.

The editor supports: bold, italic, strikethrough, inline code, headings (H2, H3), bullet lists, numbered lists, blockquotes, code blocks, and undo/redo.

### Delete a memo

Click the trash icon in the memo header (Collaborator/Owner only) and confirm the dialog.

---

## Reports

Open the **Reports** tab for the analysis and export tools. Reports are built from all quotes in the project across every document.

### Explorer

Filter quotes by:
- **Document** — show only quotes from one document
- **Code** — show only quotes tagged with a specific code
- **Search** — free-text search across quote content

### Charts

Two heatmaps built with Observable Plot:
- **Quotes × Codes** — which codes appear in which documents (cell color = quote count)
- **Code Co-occurrence** — which codes appear together in quotes

Charts require at least one quote with a code assigned to render.

### Summary

Two tables with aggregate statistics:
- **Documents table** — quote count and number of distinct codes used per document
- **Codes table** — quote count and number of distinct documents per code, sorted by most-quoted

### Export

Download your data as plain text or CSV:
- **By code** — quotes grouped under each code heading
- **By document** — quotes grouped under each document heading

Click **Download CSV** or **Download TXT** for any grouping.

---

## Support

Open a support ticket to contact the platform administrators.

### Open a ticket

Go to **Support** in the sidebar (or from the user menu) and click **New ticket**. Enter a subject and a description of your issue.

### View your tickets

The Support page lists all your open and past tickets with their status:
- **Open** — awaiting admin response
- **In progress** — admin is working on it
- **Resolved** — admin has provided a resolution
- **Closed** — ticket is closed, no further replies possible

### Reply to a ticket

Open a ticket and type your reply in the text box at the bottom. Click **Send**. If the ticket was marked Resolved, your reply will re-open it automatically.

---

## Admin panel

The admin panel is available at `/dashboard/admin` for users with the **Admin** role. An **Administration** link appears in the sidebar for admin accounts.

### Stats dashboard

Shows platform-wide totals: registered users, projects, documents, quotes, and open support tickets.

### Users

Lists all registered users with their project count, quote count, role, and status. Available actions per user:
- **Suspend / Unsuspend** — suspended users cannot sign in
- **Make admin / Make user** — toggle the Admin role

### Projects

Lists all projects with member, document, code, memo, and quote counts.

### Support tickets

Lists all tickets opened by any user. Click a ticket to view the message thread, reply on behalf of support, and change the ticket status.
