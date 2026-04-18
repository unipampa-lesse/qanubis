# Features

This document defines the full feature set of QAnubis. It separates what will be built in **v1** (the first complete release) from features planned for **future versions**.

Features marked with ⚠️ have architectural implications that must be considered from the start, even if not fully implemented in v1.

---

## UI/UX Principles

Good UI/UX is a first-class requirement of QAnubis, not an afterthought. Researchers should *enjoy* using the tool. These principles apply to every screen:

- **No full-page reloads for core workflows** — creating a quote, assigning a code, saving a memo should feel instant. Use optimistic updates where applicable.
- **Visual feedback always** — every async action gets a loading state. Errors are shown inline, not just in the console.
- **Consistent color language** — code colors defined by the researcher propagate through the PDF viewer, charts, and tables. The visual system is coherent.
- **Responsive layout** — works well on desktop and tablet (the primary research environments). Not optimized for mobile in v1.
- **Dark mode** — supported from the start via the existing `ThemeContext`.
- **Keyboard-accessible main flows** — navigating between quotes, opening the code selector, saving forms should be usable without a mouse.
- **Density appropriate for research** — the UI should accommodate lists of 50+ codes, 200+ quotes, and 10+ documents without feeling cluttered.

---

## v1 — First Release

### Authentication & Accounts

| Feature | Notes |
|---------|-------|
| Sign up with email and password | ✅ Implemented — a verification email is sent after signup; the link must be clicked before signing in |
| Sign in with email and password | ✅ Implemented |
| Sign in with Google OAuth | ✅ Implemented — optional, enabled via `GOOGLE_CLIENT_ID` env var |
| Sign in with GitHub OAuth | ✅ Implemented — optional, enabled via `GITHUB_CLIENT_ID` env var |
| Remember me (30-day session) | ✅ Implemented — default session is 24 h; checking "Keep me logged in" extends to 30 days |
| Password reset via email | ✅ Implemented — sends a reset link to the provided email address |
| User profile (display name + password change) | ✅ Implemented — avatar is v2 |

---

### Projects ⚠️

Projects are the top-level container for all research material. **Collaboration is a v1 requirement** and must be reflected in the data model from Phase 1 — a project has members, not just an owner.

| Feature | Notes |
|---------|-------|
| Create project (name, description, color) | |
| Edit project metadata | |
| Delete project (cascades all data) | Confirmation required |
| Project dashboard with counters | Documents, codes, quotes, memos |
| **Invite collaborators by email** | Core collaboration feature |
| **Member roles: Owner, Collaborator, Viewer** | See role definitions below |
| **Leave a project** | For non-owners |
| **Remove a member** | Owner only |
| List all projects the user belongs to | Own + shared |
| **Search and filter projects** | Search by name or description; filter by role (Owner/Collaborator/Viewer); sort by last updated |

**Role definitions:**

| Role | Can edit content | Can manage members | Can delete project |
|------|-----------------|-------------------|-------------------|
| Owner | ✅ | ✅ | ✅ |
| Collaborator | ✅ | ❌ | ❌ |
| Viewer | ❌ | ❌ | ❌ |

---

### Documents

| Feature | Notes |
|---------|-------|
| Upload PDF to a project | Max **50 MB** per file |
| List documents in a project | With name, upload date, page count, quote count |
| Delete document | Removes file from storage and all associated quotes |
| Download original PDF | ✅ Implemented |

> **File format:** PDF only in v1. Other formats (DOCX, images) are v2.

---

### PDF Viewer & Quote Extraction

This is the core analysis workflow of QAnubis. It must be smooth and reliable.

| Feature | Notes |
|---------|-------|
| In-browser PDF rendering | Via PDF.js |
| Page navigation and zoom | |
| Text search within document | |
| Select text to create a quote | |
| Assign one or more codes to a quote | Multi-select picker |
| Add comment/annotation to a quote | |
| Visual highlight overlay for coded quotes | Color matches the assigned code(s) |
| Click a highlight to view/edit quote | |
| Edit quote text, codes, comments | |
| Delete quote | |
| Display which page each quote comes from | |
| **Scanned PDF warning** | ✅ Implemented — detects missing text layer on page 1 and shows a warning banner. OCR support is v2. |

---

### Code Scheme

| Feature | Notes |
|---------|-------|
| Create a code (name, color, description) | |
| Hierarchical structure (parent-child) | Unlimited depth |
| Edit code name, color, description | |
| Delete code | Cascades to quotes with only that code |
| View quote count per code | |
| Code tree visualization | Client-side, collapsible |

---

### Memos

Memos are **shared by all project members** — everyone with access to the project can see, create, and edit any memo. There is no per-user memo visibility. This matches the collaborative research model where notes are team artifacts.

| Feature | Notes |
|---------|-------|
| Create memo (name + rich text content) | Visible to all project members |
| Edit memo | Any OWNER or COLLABORATOR can edit |
| Delete memo | Any OWNER or COLLABORATOR can delete |
| List memos per project | |

---

### Reports & Visualizations

All charts are filterable by document and/or code.

| Feature | Library | Notes |
|---------|---------|-------|
| Quotes × Codes heatmap | Observable Plot | Which codes appear in which documents |
| Code co-occurrence heatmap | Observable Plot | Which codes appear together in quotes |
| Codes treemap | d3-hierarchy | Hierarchical view with quote counts |
| Documents summary table | React | Doc name, quote count, codes used |
| Codes summary table | React | Code name, quote count, documents |
| Quote explorer | React | Browse/edit quotes filtered by code + document |

---

### Export

| Feature | Format | Notes |
|---------|--------|-------|
| Quotes grouped by code | Plain text | |
| Quotes grouped by document | Plain text | |
| Quotes grouped by code | CSV | |
| Quotes grouped by document | CSV | |

---

### Admin Panel

Accessible only to users with `role = ADMIN`. A separate area of the application at `/admin`.

**User management**

| Feature | Notes |
|---------|-------|
| List all users with stats | Projects count, quotes count, last active |
| Promote user to admin / revoke admin | |
| Suspend / reactivate account | Suspended users cannot sign in |

**Projects overview**

| Feature | Notes |
|---------|-------|
| List all projects with stats | Member count, document count, quote count |
| View members of any project | Read-only |

**Usage metrics**

| Feature | Notes |
|---------|-------|
| Total registered users | |
| Active users (last 30 days) | |
| Projects, documents, quotes, memos created over time | Shown as a chart |

**Support**

| Feature | Notes |
|---------|-------|
| Users open a support ticket (subject + description) | From within the app |
| Admin views all tickets, filters by status | |
| Message thread per ticket | Admin and user can exchange messages |
| Admin changes ticket status | OPEN → IN_PROGRESS → RESOLVED → CLOSED |

---

## v2 — Future Versions

These features are desirable but will not block the first release. They are listed here so that architectural decisions in v1 don't accidentally make them harder to implement later.

| Feature | Why deferred |
|---------|-------------|
| **Quote text word cloud** | High implementation cost (d3-cloud), low analytical value compared to heatmaps |
| **Codes word cloud** | Same as above |
| **Inter-rater reliability** | Requires a second coding pass workflow; complex UX |
| **Code network/graph view** | Codes as nodes, co-occurrence as edges; new visualization type |
| **Full-text search across quotes** | Requires search index (PostgreSQL full-text or external) |
| **Codebook export** (formatted PDF/DOCX) | Document generation library needed |
| **Full project export/import** | Complex serialization; useful for backup and portability |
| **Public share link** (read-only report) | Auth model extension |
| **Change history** for quotes and codes | Audit log table |
| **XLSX export** | Additional export format |
| **Additional language support** | ✅ PT, EN, and ES implemented — further languages are v2 |
| **Mobile-optimized layout** | Requires separate UX design for small screens |
