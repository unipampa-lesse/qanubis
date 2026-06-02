export const translations = {
	// Meta
	language: "Language",
	languages: { pt: "Portuguese", en: "English", es: "Spanish" },

	// Roles
	roles: {
		OWNER: "Owner",
		COLLABORATOR: "Collaborator",
		VIEWER: "Viewer",
	},

	// Common actions / labels
	common: {
		cancel: "Cancel",
		save: "Save",
		delete: "Delete",
		edit: "Edit",
		name: "Name",
		description: "Description",
		required: "required",
		loading: "Loading...",
		actions: "Actions",
		expand: "Show details",
		collapse: "Hide details",
	},

	// Sidebar navigation
	nav: {
		menu: "Menu",
		projects: "Projects",
		support: "Support",
		admin: "Administration",
		docs: "Documentation",
	},

	// Auth screens
	auth: {
		back: "Back",
		or: "Or",
		email: "Email",
		password: "Password",
		emailPlaceholder: "your@email.com",
		passwordPlaceholder: "Enter your password",

		// Sign in
		signIn: "Sign In",
		signInSubtitle: "Enter your email and password to sign in",
		signInWithGoogle: "Sign in with Google",
		signInWithGithub: "Sign in with Github",
		keepLoggedIn: "Keep me logged in",
		forgotPassword: "Forgot password?",
		noAccount: "Don't have an account?",
		invalidCredentials: "Invalid email or password.",

		// Sign up
		signUp: "Sign Up",
		signUpSubtitle: "Enter your details to create an account",
		signUpWithGoogle: "Sign up with Google",
		signUpWithGithub: "Sign up with Github",
		firstName: "First Name",
		lastName: "Last Name",
		firstNamePlaceholder: "Enter your first name",
		lastNamePlaceholder: "Enter your last name",
		terms: "By creating an account you agree to the",
		termsLink: "Terms and Conditions",
		and: "and our",
		privacyLink: "Privacy Policy",
		haveAccount: "Already have an account?",
		signUpError: "Something went wrong. Please try again.",
		emailTaken: "This email is already registered.",

		// Reset password
		resetPassword: "Forgot Your Password?",
		resetPasswordSubtitle:
			"Enter the email address linked to your account and we'll send you a reset link.",
		sendResetLink: "Send Reset Link",
		sendingResetLink: "Sending…",
		rememberPassword: "Wait, I remember my password...",
		clickHere: "Click here",
		resetLinkSent: "Reset link sent! Check your email.",
		resetRequestError: "Something went wrong. Please try again.",
		// Confirm reset (token page)
		newPasswordLabel: "New password (min. 8 characters)",
		confirmNewPassword: "Confirm new password",
		setNewPassword: "Set new password",
		settingPassword: "Updating…",
		passwordResetSuccess: "Password updated! You can now sign in.",
		resetTokenInvalid:
			"This link is invalid or has expired. Please request a new one.",
		passwordsDoNotMatch: "Passwords do not match.",

		// Email verification
		verifyEmailTitle: "Verify Your Email",
		verifyingEmail: "Verifying your email address…",
		emailVerified: "Your email has been verified! You can now sign in.",
		verifyTokenInvalid: "This verification link is invalid or has expired.",
		verifyEmailError: "Something went wrong. Please try again.",
		verificationEmailSent: "A verification email has been sent to your inbox.",
		checkInboxMessage:
			"Please check your email and click the verification link to activate your account.",
	},

	// Dashboard (project list)
	dashboard: {
		title: "Projects",
		subtitle: "Your research projects and collaborations",
		newProject: "New project",
		noProjects: "No projects yet. Create your first one to get started.",
		noResults: "No projects match your search.",
		memberSingular: "member",
		memberPlural: "members",
		documentSingular: "document",
		documentPlural: "documents",
		codeSingular: "code",
		codePlural: "codes",
		updatedPrefix: "Updated",
		searchPlaceholder: "Search by name or description…",
		roleAll: "All roles",
		sortNewest: "Newest first",
		sortOldest: "Oldest first",
	},

	// Create project modal
	createProject: {
		title: "New project",
		namePlaceholder: "My research project",
		nameRequired: "Project name is required",
		descriptionPlaceholder: "Optional description",
		color: "Color",
		submit: "Create project",
		submitting: "Creating…",
	},

	// Project detail page
	project: {
		deleteProject: "Delete project",
		deleting: "Deleting…",
		deleteConfirm:
			"This will permanently remove all documents, codes, and quotes.",
		notFound: "Project not found or you don't have access.",
		editProject: "Edit project",
		editSubmit: "Save changes",
		editSubmitting: "Saving…",
	},

	// Tabs
	tabs: {
		documents: "Documents",
		members: "Members",
		codes: "Codes",
		memos: "Memos",
		reports: "Reports",
		audit: "Audit Trail",
		bibliography: "Bibliography",
	},

	audit: {
		empty: "No audit events found.",
		unknownActor: "System",
		fallbackSummary: "Action executed: {action}",
		searchPlaceholder: "Search by action, summary, entity or user…",
		filterAllActions: "All actions",
		filterAllEntities: "All entities",
		filterAllUsers: "All users",
		userSearchPlaceholder: "Search user by name or email…",
		loadMoreUsers: "Load more users",
		loadingUsers: "Loading users…",
		dateFrom: "From date",
		dateTo: "To date",
		clearFilters: "Clear filters",
		loadMore: "Load more",
		loadingMore: "Loading…",
		actions: {
			PROJECT_CREATED: "Project created",
			PROJECT_UPDATED: "Project updated",
			PROJECT_DELETED: "Project deleted",
			PROJECT_OWNERSHIP_TRANSFERRED: "Ownership transferred",
			MEMBER_INVITED: "Member invited",
			MEMBER_INVITE_ACCEPTED: "Invitation accepted",
			MEMBER_ROLE_UPDATED: "Member role updated",
			MEMBER_REMOVED: "Member removed",
			MEMBER_LEFT: "Member left",
			DOCUMENT_UPDATED: "Document updated",
			DOCUMENT_DELETED: "Document deleted",
			CODE_CREATED: "Code created",
			CODE_UPDATED: "Code updated",
			CODE_DELETED: "Code deleted",
			QUOTE_CREATED: "Quote created",
			QUOTE_COLOR_UPDATED: "Quote color updated",
			QUOTE_DELETED: "Quote deleted",
			QUOTE_CODE_ASSIGNED: "Code assigned to quote",
			QUOTE_CODE_REMOVED: "Code removed from quote",
			MEMO_CREATED: "Memo created",
			MEMO_UPDATED: "Memo updated",
			MEMO_DELETED: "Memo deleted",
			DOCUMENT_UPLOADED: "Document uploaded",
			DOCUMENT_PDF_ATTACHED: "PDF attached to document",
			BIBTEX_IMPORTED: "BibTeX imported",
			DOCUMENT_ENRICHMENT_SCHEDULED: "Document enrichment scheduled",
			CODE_COMMENT_ADDED: "Comment added to code",
			CODE_COMMENT_DELETED: "Comment removed from code",
			QUOTE_COMMENT_ADDED: "Comment added to quote",
			QUOTE_COMMENT_DELETED: "Comment removed from quote",
		},
		entities: {
			PROJECT: "Project",
			PROJECT_MEMBER: "Member",
			DOCUMENT: "Document",
			CODE: "Code",
			QUOTE: "Quote",
			QUOTE_CODE: "Quote-Code",
			MEMO: "Memo",
		},
	},

	// Codes tab
	codes: {
		newCode: "New code",
		addSubCode: "Add sub-code",
		noCodes: "No codes yet.",
		noCodesHint: "Create your first code to start organizing quotes.",
		codeName: "Name",
		codeNamePlaceholder: "e.g. Interview",
		backgroundColor: "Background",
		textColor: "Text color",
		description: "Description",
		descriptionPlaceholder: "What does this code represent?",
		createCode: "Create code",
		editCode: "Edit code",
		creating: "Creating…",
		saving: "Saving…",
		deleteCode: "Delete code",
		deleteConfirmLine1: "Delete this code?",
		deleteUsedIn: "Used in",
		deleteUsedInSuffix: "quote(s) — those associations will be removed.",
		deleteHasChildren: "Has",
		deleteHasChildrenSuffix:
			"direct sub-code(s) — they will become root-level codes.",
		quoteSingular: "quote",
		quotePlural: "quotes",
		// Comments
		addComment: "Add a comment…",
		submitComment: "Send",
		deleteComment: "Delete comment",
		noComments: "No comments yet.",
		commentSingular: "comment",
		commentPlural: "comments",
		viewComments: "Comments",
	},

	// Members tab
	members: {
		inviteTitle: "Invite collaborator",
		emailPlaceholder: "colleague@university.edu",
		invite: "Invite",
		inviting: "Sending…",
		inviteSuccess: "Invitation sent successfully.",
		member: "Member",
		role: "Role",
		loadingMembers: "Loading members…",
		removeMember: "Remove member",
	},

	// Documents tab
	documents: {
		upload: "Upload PDF",
		uploading: "Uploading…",
		document: "Document",
		pages: "Pages",
		size: "Size",
		quotes: "Quotes",
		codingProgress: "coded",
		noDocuments: "No documents yet.",
		noDocumentsHint: "Upload a PDF to get started.",
		deleteDocument: "Delete document",
		renameDocument: "Rename document",
		download: "Download PDF",
		noPdf: "No PDF",
		status: "Status",
	},

	// Document viewer + quote workflow
	viewer: {
		backToProject: "Back to project",
		loading: "Loading PDF…",
		loadError: "Failed to load PDF.",
		page: "Page",
		of: "of",
		scannedWarning:
			"This PDF appears to be a scanned image without a text layer. Text selection and quote extraction are not available for this document.",

		// Quote creation
		quoteButton: "Quote",
		quotesTitle: "Quotes",
		noQuotes: "No quotes yet.",
		noQuotesHint: "Select text in the PDF to create a quote.",

		// Quote actions
		deleteQuote: "Delete quote",
		deleteQuoteConfirm:
			"Delete this quote? All code assignments and comments will also be removed.",

		// Code assignment
		assignCode: "Assign code",
		noCodesAvailable: "No codes in this project yet.",
		removeCode: "Remove code",

		// Comments
		comments: "comment",
		commentsPlural: "comments",
		addComment: "Add a comment…",
		submitComment: "Send",
		deleteComment: "Delete comment",
		noComments: "No comments yet.",
		allCodesAssigned: "All codes assigned.",
		quoteCreateTitle: "New quote",
		quoteCreateCodes: "Assign codes (optional)",
		quoteCreateConfirm: "Create",
		quoteCreateSkip: "Create without codes",
		changeHighlightColor: "Change highlight color",
	},

	// Reports tab
	reports: {
		tab: "Reports",
		// Sub-tabs
		explorer: "Explorer",
		charts: "Charts",
		analysis: "Analysis Workspace",
		export: "Export",
		// Explorer
		allDocuments: "All documents",
		allCodes: "All codes",
		noQuotes: "No quotes match the current filters.",
		quoteCount: "quote(s)",
		uncodedOnly: "Uncoded only",
		page: "p.",
		// Charts
		quotesHeatmapTitle: "Quotes × Codes",
		coOccurrenceTitle: "Code Co-occurrence",
		noDataForCharts: "Add quotes and assign codes to see charts.",
		document: "Document",
		code: "Code",
		count: "Count",
		// Summary
		summary: "Summary",
		documentsTable: "Documents",
		codesTable: "Codes",
		quotesCount: "Quotes",
		codesUsed: "Codes used",
		documentsUsed: "Documents",
		noData: "No quotes yet.",
		// Explorer search
		searchPlaceholder: "Search quotes…",
		// Export
		exportByCode: "Export by code",
		exportByDocument: "Export by document",
		exportCSV: "Download CSV",
		exportTXT: "Download TXT",
		exportJSON: "Download JSON",
		exportJSONHint:
			"Structured data for use with other tools (Atlas.ti, NVivo, etc.).",
		exportEmptyHint: "No quotes to export yet.",
		exportNarrative: "Narrative Report",
		exportNarrativeHint:
			"Report structured by code → quotes → memo excerpts. Ideal for thesis defense or academic publication.",
		exportMarkdown: "Download Markdown",
		exportNarrativeEmpty:
			"Add codes and quotes to generate a narrative report.",
		// Stats
		stats: "Statistics",
		totalDocuments: "Documents",
		totalQuotes: "Quotes",
		totalCodes: "Codes",
		totalMemos: "Memos",
		uncodedQuotes: "Uncoded quotes",
		codeFrequency: "Code frequency",
		documentDistribution: "Quotes per document",
		matrixTitle: "Analytical Matrix (Codes × Documents)",
		agreementTitle: "Inter-coder Agreement",
		selectCode: "Select a code",
		selectCoderA: "Select coder A",
		selectCoderB: "Select coder B",
		kappa: "Cohen's Kappa",
		observedAgreement: "Observed agreement",
		units: "Units",
		savedQueriesTitle: "Saved Queries",
		savedQueryName: "Query name",
		savedQueryDefaultName: "Saved query",
		saveQuery: "Save query",
		selectSavedQuery: "Select saved query",
		savedQueryResults: "Resulting quotes",
	},

	// Memos tab
	memos: {
		tab: "Memos",
		newMemo: "New memo",
		creating: "Creating…",
		noMemos: "No memos yet.",
		noMemosHint: "Create your first memo to start taking research notes.",
		untitled: "Untitled memo",
		namePlaceholder: "Memo title",
		deleteMemo: "Delete memo",
		deleteConfirm: "Delete this memo? This cannot be undone.",
		saving: "Saving…",
		saved: "Saved",
		lastUpdated: "Last updated",
		by: "by",
		editorPlaceholder: "Start writing your research notes…",
		quotePicker: "Insert quote reference",
		quotePickerSearch: "Search quotes…",
		quotePickerEmpty: "No quotes found.",
	},

	// Notifications
	notifications: {
		title: "Notifications",
		empty: "No notifications yet.",
		markAllRead: "Mark all as read",
		newComment: "New comment",
		viewAll: "View all",
	},

	// Admin panel
	admin: {
		// Nav
		navTitle: "Administration",
		dashboard: "Dashboard",
		users: "Users",
		projects: "Projects",
		tickets: "Support Tickets",
		// Stats cards
		totalUsers: "Total users",
		totalProjects: "Total projects",
		totalDocuments: "Total documents",
		totalQuotes: "Total quotes",
		openTickets: "Open tickets",
		// Users page
		user: "User",
		email: "Email",
		role: "Role",
		status: "Status",
		active: "Active",
		suspended: "Suspended",
		suspend: "Suspend",
		unsuspend: "Unsuspend",
		makeAdmin: "Make admin",
		makeUser: "Make user",
		// Projects page
		project: "Project",
		members: "Members",
		documents: "Documents",
		codes: "Codes",
		memos: "Memos",
		quotes: "Quotes",
		storage: "Storage",
		// Tickets page
		ticket: "Ticket",
		subject: "Subject",
		ticketStatus: "Status",
		openedBy: "Opened by",
		lastActivity: "Last activity",
		reply: "Reply",
		replyPlaceholder: "Type your reply…",
		send: "Send",
		sending: "Sending…",
		statusOpen: "Open",
		statusInProgress: "In progress",
		statusResolved: "Resolved",
		statusClosed: "Closed",
		markAs: "Mark as",
		noTickets: "No support tickets yet.",
		backToTickets: "Back to tickets",
		ticketNotFound: "Ticket not found.",
		messages: "messages",
		roleUser: "User",
		roleAdmin: "Admin",
		searchUsers: "Search by name or email…",
		searchProjects: "Search by name…",
		searchTickets: "Search by subject or user…",
		filterAllRoles: "All roles",
		filterAllStatuses: "All statuses",
		noResults: "No results found.",
	},

	// Support tickets (user-facing)
	support: {
		title: "Support",
		newTicket: "New ticket",
		myTickets: "My tickets",
		noTickets: "You haven't opened any support tickets yet.",
		subject: "Subject",
		subjectPlaceholder: "Briefly describe your issue",
		message: "Message",
		messagePlaceholder: "Describe your issue in detail…",
		submit: "Open ticket",
		submitting: "Opening…",
		backToTickets: "Back to support",
		reply: "Reply",
		replyPlaceholder: "Write a reply…",
		send: "Send",
		sending: "Sending…",
		ticketClosed: "This ticket is closed.",
		statusOpen: "Open",
		statusInProgress: "In progress",
		statusResolved: "Resolved",
		statusClosed: "Closed",
		ticketNotFound: "Ticket not found.",
		messages: "messages",
		supportAgent: "Support",
		you: "You",
		searchPlaceholder: "Search by subject…",
		filterAllStatuses: "All statuses",
		noResults: "No tickets found.",
	},

	// Profile page
	profile: {
		title: "Profile",
		displayName: "Display name",
		namePlaceholder: "Your name",
		saveProfile: "Save changes",
		savingProfile: "Saving…",
		profileSaved: "Profile updated.",
		changeEmail: "Change email",
		newEmail: "New email address",
		confirmWithPassword: "Confirm with current password",
		saveEmail: "Update email",
		savingEmail: "Updating…",
		emailSaved: "Email updated. Use the new address to sign in.",
		emailTaken: "This email is already in use.",
		oauthEmail:
			"Email is managed by your sign-in provider and cannot be changed here.",
		changePassword: "Change password",
		currentPassword: "Current password",
		newPassword: "New password (min. 8 characters)",
		savePassword: "Update password",
		savingPassword: "Updating…",
		passwordSaved: "Password updated.",
		wrongPassword: "Current password is incorrect.",
		oauthAccount:
			"Your account uses Google/GitHub sign-in — password change is not available.",
		// Delete account
		deleteAccount: "Delete account",
		deleteAccountWarning:
			"This action is permanent and cannot be undone. All your data will be removed.",
		deleteAccountConfirmPassword:
			"Enter your current password to confirm account deletion.",
		deleteAccountConfirmType: 'Type "DELETE" to confirm account deletion.',
		deleteAccountTypePlaceholder: "Type DELETE",
		deleteAccountConfirm: "Delete my account",
		deletingAccount: "Deleting…",
		deleteAccountSoleOwner:
			"You are the sole owner of one or more projects. Transfer ownership before deleting your account.",
		deleteAccountError: "Something went wrong. Please try again.",
	},

	// 404 page
	notFound: {
		heading: "404",
		message: "We can't seem to find the page you are looking for!",
		backHome: "Back to Home Page",
	},

	// Error page
	errorPage: {
		heading: "Something went wrong",
		message: "An unexpected error occurred. Please try again.",
		retry: "Try again",
		backHome: "Back to Home Page",
	},

	// Invite acceptance page
	invite: {
		accepting: "Accepting invitation…",
		signInPrompt: "Sign in to accept this invitation.",
		signIn: "Sign in",
		goToDashboard: "Go to dashboard",
		errorNotFound: "Invitation not found or already used.",
		errorExpired: "This invitation has expired.",
		errorWrongEmail: "This invitation was sent to a different email address.",
		errorGeneric: "Could not accept the invitation. Please try again.",
	},

	// Public landing page
	landing: {
		badge: "Open source · Free to use",
		headline: "Qualitative Research,",
		headlineAccent: "Organized.",
		subtitle:
			"QAnubis is an open-source platform for qualitative data analysis. Upload documents, code text passages, and build insights — collaboratively.",
		ctaPrimary: "Get started for free",
		ctaSecondary: "Sign in",

		featuresTitle: "Everything you need for qualitative analysis",
		featuresSubtitle:
			"From document management to collaborative coding and visual reporting — all in one place.",
		features: [
			{
				title: "PDF Document Viewer",
				description:
					"Upload research documents and navigate them with a built-in PDF viewer. Select any text passage to create a quote instantly.",
			},
			{
				title: "Qualitative Coding",
				description:
					"Build hierarchical code trees and assign codes to selected passages. Organize your analysis with structured, nested categories.",
			},
			{
				title: "Collaborative Projects",
				description:
					"Invite team members with role-based permissions — Owner, Collaborator, or Viewer — and work together in real time.",
			},
			{
				title: "Research Memos",
				description:
					"Write and organize analytical memos tied to each project. Keep your theoretical reflections alongside your data.",
			},
			{
				title: "Reports & Charts",
				description:
					"Visualize code distributions, frequency heatmaps, and code co-occurrence matrices to surface patterns in your data.",
			},
			{
				title: "Export Your Findings",
				description:
					"Download all quotes organized by code or by document in CSV or TXT format — ready for your next publication.",
			},
		] as { title: string; description: string }[],

		howItWorksTitle: "How it works",
		howItWorksSubtitle:
			"Get from raw documents to structured insights in three simple steps.",
		steps: [
			{
				number: "01",
				title: "Create a project",
				description:
					"Start a new research project, give it a name and color, and invite your collaborators.",
			},
			{
				number: "02",
				title: "Annotate documents",
				description:
					"Upload PDF files, select text passages, and assign codes to build your analytical framework.",
			},
			{
				number: "03",
				title: "Analyze & report",
				description:
					"Explore visual reports, write memos, and export your coded findings in multiple formats.",
			},
		] as { number: string; title: string; description: string }[],

		ctaBannerTitle: "Ready to begin your research?",
		ctaBannerSubtitle:
			"Create a free account and start organizing your qualitative data today.",
		ctaBannerButton: "Get started for free",

		footerCopyright: "Open source.",
		footerGithub: "GitHub",
		footerDocs: "Documentation",
		footerSignIn: "Sign in",
		footerSignUp: "Sign up",
	},

	// Bibliography tab
	bibliography: {
		importBibtex: "Import BibTeX",
		importPlaceholder: "Paste your .bib content here…",
		importButton: "Import",
		importing: "Importing…",
		importedCount: "imported",
		skippedCount: "skipped (duplicate)",
		noEntries: "No bibliography entries yet.",
		noEntriesHint: "Import a .bib file to get started.",
		reference: "Reference",
		year: "Year",
		venue: "Venue",
		enriched: "Enriched",
		pending: "Pending",
		viewPdf: "View PDF",
		uploadPdf: "Upload PDF",
		uploadingPdf: "Uploading…",
		enrich: "Enrich metadata",
		deleteEntry: "Delete entry",
		deleteConfirm: "will be permanently removed.",
		abstract: "Abstract",
		openForCoding: "Open for coding",
		openingForCoding: "Opening…",
		linkedToDocument: "In Documents",
		uploadBibFile: "Upload .bib file",
		orPaste: "or paste below",
		authors: "Authors",
		vol: "vol.",
	},

	// Docs section
	docs: {
		header: "Documentation",
		backToApp: "← QAnubis",
		loading: "Loading…",
		notFound: "Page not found.",
		sectionDocumentation: "Documentation",
		sectionDevelopment: "Development",
		nav: {
			home: "Home",
			userManual: "User Manual",
			faq: "FAQ",
			contact: "Contact",
			howToContribute: "How to Contribute",
			features: "Features",
			domainModel: "Domain Model",
			architecture: "Architecture",
			migrationPlan: "Migration Plan",
			contributionGuidelines: "Contribution Guidelines",
		},
	},
};

export type Translations = typeof translations;
