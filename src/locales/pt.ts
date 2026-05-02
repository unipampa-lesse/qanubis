import type { Translations } from "./en";

export const translations: Translations = {
	// Meta
	language: "Idioma",
	languages: { pt: "Português", en: "Inglês", es: "Espanhol" },

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
		expand: "Ver detalhes",
		collapse: "Ocultar detalhes",
	},

	// Sidebar navigation
	nav: {
		menu: "Menu",
		projects: "Projetos",
		support: "Suporte",
		admin: "Administração",
		docs: "Documentação",
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
		resetRequestError: "Algo deu errado. Tente novamente.",
		// Confirm reset (token page)
		newPasswordLabel: "Nova senha (mín. 8 caracteres)",
		confirmNewPassword: "Confirmar nova senha",
		setNewPassword: "Definir nova senha",
		settingPassword: "Atualizando…",
		passwordResetSuccess: "Senha atualizada! Você já pode entrar.",
		resetTokenInvalid: "Este link é inválido ou expirou. Solicite um novo.",
		passwordsDoNotMatch: "As senhas não coincidem.",

		// Email verification
		verifyEmailTitle: "Verifique Seu E-mail",
		verifyingEmail: "Verificando seu endereço de e-mail…",
		emailVerified: "Seu e-mail foi verificado! Você já pode entrar.",
		verifyTokenInvalid:
			"Este link de verificação é inválido ou expirou.",
		verifyEmailError: "Algo deu errado. Tente novamente.",
		verificationEmailSent:
			"Um e-mail de verificação foi enviado para sua caixa de entrada.",
		checkInboxMessage:
			"Verifique seu e-mail e clique no link de verificação para ativar sua conta.",
	},

	// Dashboard (project list)
	dashboard: {
		title: "Projetos",
		subtitle: "Seus projetos de pesquisa e colaborações",
		newProject: "Novo projeto",
		noProjects: "Nenhum projeto ainda. Crie o seu primeiro para começar.",
		noResults: "Nenhum projeto corresponde à sua busca.",
		memberSingular: "membro",
		memberPlural: "membros",
		documentSingular: "documento",
		documentPlural: "documentos",
		codeSingular: "código",
		codePlural: "códigos",
		updatedPrefix: "Atualizado",
		searchPlaceholder: "Buscar por nome ou descrição…",
		roleAll: "Todos os papéis",
		sortNewest: "Mais recente",
		sortOldest: "Mais antigo",
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
		bibliography: "Bibliografia",
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
		// Comments
		addComment: "Adicionar um comentário…",
		submitComment: "Enviar",
		deleteComment: "Excluir comentário",
		noComments: "Nenhum comentário ainda.",
		commentSingular: "comentário",
		commentPlural: "comentários",
		viewComments: "Comentários",
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
		codingProgress: "codificadas",
		noDocuments: "Nenhum documento ainda.",
		noDocumentsHint: "Envie um PDF para começar.",
		deleteDocument: "Excluir documento",
		renameDocument: "Renomear documento",
		download: "Baixar PDF",
		noPdf: "Sem PDF",
		status: "Status",
	},

	// Document viewer + quote workflow
	viewer: {
		backToProject: "Voltar ao projeto",
		loading: "Carregando PDF…",
		loadError: "Falha ao carregar o PDF.",
		page: "Página",
		of: "de",
		scannedWarning:
			"Este PDF parece ser uma imagem digitalizada sem camada de texto. A seleção de texto e extração de citações não estão disponíveis para este documento.",

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
		allCodesAssigned: "Todos os códigos já foram atribuídos.",
		quoteCreateTitle: "Nova citação",
		quoteCreateCodes: "Atribuir códigos (opcional)",
		quoteCreateConfirm: "Criar",
		quoteCreateSkip: "Criar sem códigos",
		changeHighlightColor: "Alterar cor do destaque",
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
		uncodedOnly: "Apenas sem código",
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
		// Busca no explorador
		searchPlaceholder: "Buscar citações…",
		// Export
		exportByCode: "Exportar por código",
		exportByDocument: "Exportar por documento",
		exportCSV: "Baixar CSV",
		exportTXT: "Baixar TXT",
		exportJSON: "Baixar JSON",
		exportJSONHint: "Dados estruturados para uso com outras ferramentas (Atlas.ti, NVivo, etc.).",
		exportEmptyHint: "Nenhuma citação para exportar ainda.",
		exportNarrative: "Relatório Narrativo",
		exportNarrativeHint: "Relatório estruturado por código → citações → trechos de memorando. Ideal para defesa de dissertação ou publicação acadêmica.",
		exportMarkdown: "Baixar Markdown",
		exportNarrativeEmpty: "Adicione códigos e citações para gerar um relatório narrativo.",
		// Stats
		stats: "Estatísticas",
		totalDocuments: "Documentos",
		totalQuotes: "Citações",
		totalCodes: "Códigos",
		totalMemos: "Memorandos",
		uncodedQuotes: "Citações sem código",
		codeFrequency: "Frequência de códigos",
		documentDistribution: "Citações por documento"
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
		quotePicker: "Inserir referência de citação",
		quotePickerSearch: "Buscar citações…",
		quotePickerEmpty: "Nenhuma citação encontrada.",
	},

	// Notificações
	notifications: {
		title: "Notificações",
		empty: "Nenhuma notificação ainda.",
		markAllRead: "Marcar todas como lidas",
		newComment: "Novo comentário",
		viewAll: "Ver todas",
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
		quotes: "Citações",
		storage: "Armazenamento",
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
		ticketNotFound: "Chamado não encontrado.",
		messages: "mensagens",
		roleUser: "Usuário",
		roleAdmin: "Admin",
		searchUsers: "Buscar por nome ou e-mail…",
		searchProjects: "Buscar por nome…",
		searchTickets: "Buscar por assunto ou usuário…",
		filterAllRoles: "Todas as funções",
		filterAllStatuses: "Todos os status",
		noResults: "Nenhum resultado encontrado.",
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
		ticketNotFound: "Chamado não encontrado.",
		messages: "mensagens",
		supportAgent: "Suporte",
		you: "Você",
		searchPlaceholder: "Buscar por assunto…",
		filterAllStatuses: "Todos os status",
		noResults: "Nenhum chamado encontrado.",
	},

	// Profile page
	profile: {
		title: "Perfil",
		displayName: "Nome de exibição",
		namePlaceholder: "Seu nome",
		saveProfile: "Salvar alterações",
		savingProfile: "Salvando…",
		profileSaved: "Perfil atualizado.",
		changeEmail: "Alterar e-mail",
		newEmail: "Novo endereço de e-mail",
		confirmWithPassword: "Confirmar com senha atual",
		saveEmail: "Atualizar e-mail",
		savingEmail: "Atualizando…",
		emailSaved: "E-mail atualizado. Use o novo endereço para entrar.",
		emailTaken: "Este e-mail já está em uso.",
		oauthEmail:
			"O e-mail é gerenciado pelo seu provedor de login e não pode ser alterado aqui.",
		changePassword: "Alterar senha",
		currentPassword: "Senha atual",
		newPassword: "Nova senha (mín. 8 caracteres)",
		savePassword: "Atualizar senha",
		savingPassword: "Atualizando…",
		passwordSaved: "Senha atualizada.",
		wrongPassword: "Senha atual incorreta.",
		oauthAccount:
			"Sua conta usa login com Google/GitHub — alteração de senha não está disponível.",
		// Delete account
		deleteAccount: "Excluir conta",
		deleteAccountWarning:
			"Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos.",
		deleteAccountConfirmPassword:
			"Digite sua senha atual para confirmar a exclusão da conta.",
		deleteAccountConfirmType:
			'Digite "DELETE" para confirmar a exclusão da conta.',
		deleteAccountTypePlaceholder: "Digite DELETE",
		deleteAccountConfirm: "Excluir minha conta",
		deletingAccount: "Excluindo…",
		deleteAccountSoleOwner:
			"Você é o único dono de um ou mais projetos. Transfira a propriedade antes de excluir sua conta.",
		deleteAccountError: "Algo deu errado. Tente novamente.",
	},

	// 404 page
	notFound: {
		heading: "404",
		message: "Não conseguimos encontrar a página que você está procurando!",
		backHome: "Voltar para a página inicial",
	},

	// Error page
	errorPage: {
		heading: "Algo deu errado",
		message: "Ocorreu um erro inesperado. Tente novamente.",
		retry: "Tentar novamente",
		backHome: "Voltar para a página inicial",
	},

	// Invite acceptance page
	invite: {
		accepting: "Aceitando convite…",
		signInPrompt: "Entre na sua conta para aceitar este convite.",
		signIn: "Entrar",
		goToDashboard: "Ir para o painel",
		errorNotFound: "Convite não encontrado ou já utilizado.",
		errorExpired: "Este convite expirou.",
		errorWrongEmail: "Este convite foi enviado para outro endereço de e-mail.",
		errorGeneric: "Não foi possível aceitar o convite. Tente novamente.",
	},

	// Public landing page
	landing: {
		badge: "Código aberto · Gratuito",
		headline: "Pesquisa Qualitativa,",
		headlineAccent: "Organizada.",
		subtitle:
			"QAnubis é uma plataforma de código aberto para análise qualitativa de dados. Envie documentos, codifique trechos de texto e construa insights — de forma colaborativa.",
		ctaPrimary: "Começar gratuitamente",
		ctaSecondary: "Entrar",

		featuresTitle: "Tudo que você precisa para análise qualitativa",
		featuresSubtitle:
			"Do gerenciamento de documentos à codificação colaborativa e relatórios visuais — tudo em um só lugar.",
		features: [
			{
				title: "Visualizador de PDF",
				description:
					"Envie documentos de pesquisa e navegue por eles com um visualizador integrado. Selecione qualquer trecho de texto para criar uma citação instantaneamente.",
			},
			{
				title: "Codificação Qualitativa",
				description:
					"Construa árvores de códigos hierárquicas e atribua códigos a trechos selecionados. Organize sua análise com categorias estruturadas e aninhadas.",
			},
			{
				title: "Projetos Colaborativos",
				description:
					"Convide membros com permissões por função — Proprietário, Colaborador ou Visualizador — e trabalhe em equipe em tempo real.",
			},
			{
				title: "Memorandos de Pesquisa",
				description:
					"Escreva e organize memorandos analíticos vinculados a cada projeto. Mantenha suas reflexões teóricas junto aos dados.",
			},
			{
				title: "Relatórios e Gráficos",
				description:
					"Visualize distribuições de códigos, mapas de calor e matrizes de co-ocorrência para identificar padrões nos seus dados.",
			},
			{
				title: "Exporte seus Achados",
				description:
					"Baixe todas as citações organizadas por código ou por documento nos formatos CSV ou TXT — prontas para sua próxima publicação.",
			},
		],

		howItWorksTitle: "Como funciona",
		howItWorksSubtitle:
			"Do documento bruto a insights estruturados em três etapas simples.",
		steps: [
			{
				number: "01",
				title: "Crie um projeto",
				description:
					"Inicie um novo projeto de pesquisa, dê um nome e cor, e convide seus colaboradores.",
			},
			{
				number: "02",
				title: "Anote documentos",
				description:
					"Envie arquivos PDF, selecione trechos de texto e atribua códigos para construir seu referencial analítico.",
			},
			{
				number: "03",
				title: "Analise e relate",
				description:
					"Explore relatórios visuais, escreva memorandos e exporte seus achados codificados em múltiplos formatos.",
			},
		],

		ctaBannerTitle: "Pronto para iniciar sua pesquisa?",
		ctaBannerSubtitle:
			"Crie uma conta gratuita e comece a organizar seus dados qualitativos hoje.",
		ctaBannerButton: "Começar gratuitamente",

		footerCopyright: "Código aberto.",
		footerGithub: "GitHub",
		footerDocs: "Documentação",
		footerSignIn: "Entrar",
		footerSignUp: "Criar conta",
	},

	// Bibliography tab
	bibliography: {
		importBibtex: "Importar BibTeX",
		importPlaceholder: "Cole o conteúdo do seu arquivo .bib aqui…",
		importButton: "Importar",
		importing: "Importando…",
		importedCount: "importado(s)",
		skippedCount: "ignorado(s) (duplicado)",
		noEntries: "Nenhuma referência bibliográfica ainda.",
		noEntriesHint: "Importe um arquivo .bib para começar.",
		reference: "Referência",
		year: "Ano",
		venue: "Veículo",
		enriched: "Enriquecido",
		pending: "Pendente",
		viewPdf: "Ver PDF",
		uploadPdf: "Enviar PDF",
		uploadingPdf: "Enviando…",
		enrich: "Enriquecer metadados",
		deleteEntry: "Excluir entrada",
		deleteConfirm: "será removido permanentemente.",
		abstract: "Resumo",
		openForCoding: "Abrir para codificação",
		openingForCoding: "Abrindo…",
		linkedToDocument: "Em Documentos",
		uploadBibFile: "Enviar arquivo .bib",
		orPaste: "ou cole abaixo",
		authors: "Autores",
		vol: "vol.",
	},

	// Docs section
	docs: {
		header: "Documentação",
		backToApp: "← QAnubis",
		loading: "Carregando…",
		notFound: "Página não encontrada.",
		sectionDocumentation: "Documentação",
		sectionDevelopment: "Desenvolvimento",
		nav: {
			home: "Início",
			userManual: "Manual do Usuário",
			faq: "FAQ",
			contact: "Contato",
			howToContribute: "Como Contribuir",
			features: "Funcionalidades",
			domainModel: "Modelo de Domínio",
			architecture: "Arquitetura",
			migrationPlan: "Plano de Migração",
			contributionGuidelines: "Guia de Contribuição",
		},
	},
};
