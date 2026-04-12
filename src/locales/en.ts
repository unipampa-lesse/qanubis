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
	},

	// Tabs
	tabs: {
		documents: "Documents",
		members: "Members",
		codes: "Codes",
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
