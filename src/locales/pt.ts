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
		support: "Suporte",
		admin: "Administração",
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
		editProject: "Editar projeto",
		editSubmit: "Salvar alterações",
		editSubmitting: "Salvando…",
	},

	// Tabs
	tabs: {
		documents: "Documentos",
		members: "Membros",
		codes: "Códigos",
		memos: "Memorandos",
		reports: "Relatórios",
	},

	// Codes tab
	codes: {
		newCode: "Novo código",
		addSubCode: "Adicionar subcódigo",
		noCodes: "Nenhum código ainda.",
		noCodesHint:
			"Crie seu primeiro código para começar a organizar as citações.",
		codeName: "Nome",
		codeNamePlaceholder: "ex: Entrevista",
		backgroundColor: "Fundo",
		textColor: "Cor do texto",
		description: "Descrição",
		descriptionPlaceholder: "O que este código representa?",
		createCode: "Criar código",
		editCode: "Editar código",
		creating: "Criando…",
		saving: "Salvando…",
		deleteCode: "Excluir código",
		deleteConfirmLine1: "Excluir este código?",
		deleteUsedIn: "Usado em",
		deleteUsedInSuffix: "citação(ões) — as associações serão removidas.",
		deleteHasChildren: "Possui",
		deleteHasChildrenSuffix:
			"subcódigo(s) direto(s) — eles se tornarão códigos raiz.",
		quoteSingular: "citação",
		quotePlural: "citações",
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
		download: "Baixar PDF",
	},

	// Document viewer + quote workflow
	viewer: {
		backToProject: "Voltar ao projeto",
		loading: "Carregando PDF…",
		loadError: "Falha ao carregar o PDF.",
		page: "Página",
		of: "de",
		scannedWarning: "Este PDF parece ser uma imagem digitalizada sem camada de texto. A seleção de texto e extração de citações não estão disponíveis para este documento.",

		// Quote creation
		quoteButton: "Citar",
		quotesTitle: "Citações",
		noQuotes: "Nenhuma citação ainda.",
		noQuotesHint: "Selecione texto no PDF para criar uma citação.",

		// Quote actions
		deleteQuote: "Excluir citação",
		deleteQuoteConfirm:
			"Excluir esta citação? Todos os códigos e comentários associados também serão removidos.",

		// Code assignment
		assignCode: "Atribuir código",
		noCodesAvailable: "Nenhum código neste projeto ainda.",
		removeCode: "Remover código",

		// Comments
		comments: "comentário",
		commentsPlural: "comentários",
		addComment: "Adicionar um comentário…",
		submitComment: "Enviar",
		deleteComment: "Excluir comentário",
		noComments: "Nenhum comentário ainda.",
	},

	// Reports tab
	reports: {
		tab: "Relatórios",
		explorer: "Explorador",
		charts: "Gráficos",
		export: "Exportar",
		allDocuments: "Todos os documentos",
		allCodes: "Todos os códigos",
		noQuotes: "Nenhuma citação corresponde aos filtros atuais.",
		quoteCount: "citação(ões)",
		page: "p.",
		quotesHeatmapTitle: "Citações × Códigos",
		coOccurrenceTitle: "Co-ocorrência de Códigos",
		noDataForCharts:
			"Adicione citações e atribua códigos para ver os gráficos.",
		document: "Documento",
		code: "Código",
		count: "Quantidade",
		// Summary
		summary: "Resumo",
		documentsTable: "Documentos",
		codesTable: "Códigos",
		quotesCount: "Citações",
		codesUsed: "Códigos usados",
		documentsUsed: "Documentos",
		noData: "Nenhuma citação ainda.",
		exportByCode: "Exportar por código",
		exportByDocument: "Exportar por documento",
		exportCSV: "Baixar CSV",
		exportTXT: "Baixar TXT",
		exportEmptyHint: "Nenhuma citação para exportar ainda.",
	},

	// Memos tab
	memos: {
		tab: "Memorandos",
		newMemo: "Novo memorando",
		creating: "Criando…",
		noMemos: "Nenhum memorando ainda.",
		noMemosHint:
			"Crie seu primeiro memorando para começar a tomar notas de pesquisa.",
		untitled: "Memorando sem título",
		namePlaceholder: "Título do memorando",
		deleteMemo: "Excluir memorando",
		deleteConfirm: "Excluir este memorando? Essa ação não pode ser desfeita.",
		saving: "Salvando…",
		saved: "Salvo",
		lastUpdated: "Última atualização",
		by: "por",
		editorPlaceholder: "Comece a escrever suas notas de pesquisa…",
	},

	// Admin panel
	admin: {
		navTitle: "Administração",
		dashboard: "Painel",
		users: "Usuários",
		projects: "Projetos",
		tickets: "Suporte",
		totalUsers: "Total de usuários",
		totalProjects: "Total de projetos",
		totalDocuments: "Total de documentos",
		totalQuotes: "Total de citações",
		openTickets: "Chamados abertos",
		user: "Usuário",
		email: "E-mail",
		role: "Função",
		status: "Status",
		active: "Ativo",
		suspended: "Suspenso",
		suspend: "Suspender",
		unsuspend: "Reativar",
		makeAdmin: "Tornar admin",
		makeUser: "Tornar usuário",
		project: "Projeto",
		members: "Membros",
		documents: "Documentos",
		codes: "Códigos",
		memos: "Memorandos",
		ticket: "Chamado",
		subject: "Assunto",
		ticketStatus: "Status",
		openedBy: "Aberto por",
		lastActivity: "Última atividade",
		reply: "Responder",
		replyPlaceholder: "Digite sua resposta…",
		send: "Enviar",
		sending: "Enviando…",
		statusOpen: "Aberto",
		statusInProgress: "Em andamento",
		statusResolved: "Resolvido",
		statusClosed: "Encerrado",
		markAs: "Marcar como",
		noTickets: "Nenhum chamado de suporte ainda.",
		backToTickets: "Voltar aos chamados",
	},

	// Support tickets (user-facing)
	support: {
		title: "Suporte",
		newTicket: "Novo chamado",
		myTickets: "Meus chamados",
		noTickets: "Você ainda não abriu nenhum chamado de suporte.",
		subject: "Assunto",
		subjectPlaceholder: "Descreva brevemente o problema",
		message: "Mensagem",
		messagePlaceholder: "Descreva seu problema em detalhes…",
		submit: "Abrir chamado",
		submitting: "Abrindo…",
		backToTickets: "Voltar ao suporte",
		reply: "Responder",
		replyPlaceholder: "Escreva uma resposta…",
		send: "Enviar",
		sending: "Enviando…",
		ticketClosed: "Este chamado está encerrado.",
		statusOpen: "Aberto",
		statusInProgress: "Em andamento",
		statusResolved: "Resolvido",
		statusClosed: "Encerrado",
	},

	// Profile page
	profile: {
		title: "Perfil",
		displayName: "Nome de exibição",
		namePlaceholder: "Seu nome",
		saveProfile: "Salvar alterações",
		savingProfile: "Salvando…",
		profileSaved: "Perfil atualizado.",
		changePassword: "Alterar senha",
		currentPassword: "Senha atual",
		newPassword: "Nova senha (mín. 8 caracteres)",
		savePassword: "Atualizar senha",
		savingPassword: "Atualizando…",
		passwordSaved: "Senha atualizada.",
		wrongPassword: "Senha atual incorreta.",
		oauthAccount: "Sua conta usa login com Google/GitHub — alteração de senha não está disponível.",
	},

	// Invite acceptance page
	invite: {
		accepting: "Aceitando convite…",
		signInPrompt: "Entre na sua conta para aceitar este convite.",
		signIn: "Entrar",
		goToDashboard: "Ir para o painel",
	},
};
