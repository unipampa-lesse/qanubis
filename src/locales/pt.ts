import type { Translations } from "./en";

export const translations: Translations = {
	// Meta
	language: "Idioma",
	languages: ["Português", "Inglês"],

	// Roles
	roles: {
		OWNER: "Proprietário",
		COLLABORATOR: "Colaborador",
		VIEWER: "Visualizador",
	},

	// Common actions / labels
	common: {
		cancel: "Cancelar",
		save: "Salvar",
		delete: "Excluir",
		edit: "Editar",
		name: "Nome",
		description: "Descrição",
		required: "obrigatório",
		loading: "Carregando...",
		actions: "Ações",
	},

	// Sidebar navigation
	nav: {
		menu: "Menu",
		projects: "Projetos",
	},

	// Auth screens
	auth: {
		back: "Voltar",
		or: "Ou",
		email: "E-mail",
		password: "Senha",
		emailPlaceholder: "seu@email.com",
		passwordPlaceholder: "Digite sua senha",

		// Sign in
		signIn: "Entrar",
		signInSubtitle: "Digite seu e-mail e senha para entrar",
		signInWithGoogle: "Entrar com Google",
		signInWithGithub: "Entrar com Github",
		keepLoggedIn: "Manter conectado",
		forgotPassword: "Esqueceu a senha?",
		noAccount: "Não tem uma conta?",
		invalidCredentials: "E-mail ou senha inválidos.",

		// Sign up
		signUp: "Criar Conta",
		signUpSubtitle: "Digite seus dados para criar uma conta",
		signUpWithGoogle: "Criar conta com Google",
		signUpWithGithub: "Criar conta com Github",
		firstName: "Nome",
		lastName: "Sobrenome",
		firstNamePlaceholder: "Digite seu nome",
		lastNamePlaceholder: "Digite seu sobrenome",
		terms: "Ao criar uma conta você concorda com os",
		termsLink: "Termos e Condições",
		and: "e nossa",
		privacyLink: "Política de Privacidade",
		haveAccount: "Já tem uma conta?",
		signUpError: "Ocorreu um erro. Por favor, tente novamente.",
		emailTaken: "Este e-mail já está cadastrado.",

		// Reset password
		resetPassword: "Esqueceu sua senha?",
		resetPasswordSubtitle:
			"Digite o e-mail vinculado à sua conta e enviaremos um link para redefinir sua senha.",
		sendResetLink: "Enviar link de redefinição",
		sendingResetLink: "Enviando…",
		rememberPassword: "Espera, me lembrei da senha...",
		clickHere: "Clique aqui",
		resetLinkSent: "Link enviado! Verifique seu e-mail.",
	},

	// Dashboard (project list)
	dashboard: {
		title: "Projetos",
		subtitle: "Seus projetos de pesquisa e colaborações",
		newProject: "Novo projeto",
		noProjects: "Nenhum projeto ainda. Crie o seu primeiro para começar.",
		memberSingular: "membro",
		memberPlural: "membros",
		documentSingular: "documento",
		documentPlural: "documentos",
		codeSingular: "código",
		codePlural: "códigos",
		updatedPrefix: "Atualizado",
	},

	// Create project modal
	createProject: {
		title: "Novo projeto",
		namePlaceholder: "Meu projeto de pesquisa",
		nameRequired: "O nome do projeto é obrigatório",
		descriptionPlaceholder: "Descrição opcional",
		color: "Cor",
		submit: "Criar projeto",
		submitting: "Criando…",
	},

	// Project detail page
	project: {
		deleteProject: "Excluir projeto",
		deleting: "Excluindo…",
		deleteConfirm:
			"Isso removerá permanentemente todos os documentos, códigos e citações.",
		notFound: "Projeto não encontrado ou você não tem acesso.",
	},

	// Tabs
	tabs: {
		documents: "Documentos",
		members: "Membros",
		codes: "Códigos",
	},

	// Members tab
	members: {
		inviteTitle: "Convidar colaborador",
		emailPlaceholder: "colega@universidade.edu",
		invite: "Convidar",
		inviting: "Enviando…",
		inviteSuccess: "Convite enviado com sucesso.",
		member: "Membro",
		role: "Função",
		loadingMembers: "Carregando membros…",
		removeMember: "Remover membro",
	},

	// Documents tab
	documents: {
		upload: "Enviar PDF",
		uploading: "Enviando…",
		document: "Documento",
		pages: "Páginas",
		size: "Tamanho",
		quotes: "Citações",
		noDocuments: "Nenhum documento ainda.",
		noDocumentsHint: "Envie um PDF para começar.",
		deleteDocument: "Excluir documento",
	},

	// Invite acceptance page
	invite: {
		accepting: "Aceitando convite…",
		signInPrompt: "Entre na sua conta para aceitar este convite.",
		signIn: "Entrar",
		goToDashboard: "Ir para o painel",
	},
};
