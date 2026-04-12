export const translations = {
	// Meta
	language: "Language",
	languages: ["Portuguese", "English"] as [string, string],

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
	},

	// Sidebar navigation
	nav: {
		menu: "Menu",
		projects: "Projects",
		support: "Support",
		admin: "Administration",
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
	},

	// Dashboard (project list)
	dashboard: {
		title: "Projects",
		subtitle: "Your research projects and collaborations",
		newProject: "New project",
		noProjects: "No projects yet. Create your first one to get started.",
		memberSingular: "member",
		memberPlural: "members",
		documentSingular: "document",
		documentPlural: "documents",
		codeSingular: "code",
		codePlural: "codes",
		updatedPrefix: "Updated",
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
		noDocuments: "No documents yet.",
		noDocumentsHint: "Upload a PDF to get started.",
		deleteDocument: "Delete document",
		download: "Download PDF",
	},

	// Document viewer + quote workflow
	viewer: {
		backToProject: "Back to project",
		loading: "Loading PDF…",
		loadError: "Failed to load PDF.",
		page: "Page",
		of: "of",
		scannedWarning: "This PDF appears to be a scanned image without a text layer. Text selection and quote extraction are not available for this document.",

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
	},

	// Reports tab
	reports: {
		tab: "Reports",
		// Sub-tabs
		explorer: "Explorer",
		charts: "Charts",
		export: "Export",
		// Explorer
		allDocuments: "All documents",
		allCodes: "All codes",
		noQuotes: "No quotes match the current filters.",
		quoteCount: "quote(s)",
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
		// Export
		exportByCode: "Export by code",
		exportByDocument: "Export by document",
		exportCSV: "Download CSV",
		exportTXT: "Download TXT",
		exportEmptyHint: "No quotes to export yet.",
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
	},

	// Profile page
	profile: {
		title: "Profile",
		displayName: "Display name",
		namePlaceholder: "Your name",
		saveProfile: "Save changes",
		savingProfile: "Saving…",
		profileSaved: "Profile updated.",
		changePassword: "Change password",
		currentPassword: "Current password",
		newPassword: "New password (min. 8 characters)",
		savePassword: "Update password",
		savingPassword: "Updating…",
		passwordSaved: "Password updated.",
		wrongPassword: "Current password is incorrect.",
		oauthAccount: "Your account uses Google/GitHub sign-in — password change is not available.",
	},

	// Invite acceptance page
	invite: {
		accepting: "Accepting invitation…",
		signInPrompt: "Sign in to accept this invitation.",
		signIn: "Sign in",
		goToDashboard: "Go to dashboard",
	},
};

export type Translations = typeof translations;
