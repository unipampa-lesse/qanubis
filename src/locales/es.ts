import type { Translations } from "./en";

export const translations: Translations = {
	// Meta
	language: "Idioma",
	languages: { pt: "Portugués", en: "Inglés", es: "Español" },

	// Roles
	roles: {
		OWNER: "Propietario",
		COLLABORATOR: "Colaborador",
		VIEWER: "Visualizador",
	},

	// Common actions / labels
	common: {
		cancel: "Cancelar",
		save: "Guardar",
		delete: "Eliminar",
		edit: "Editar",
		name: "Nombre",
		description: "Descripción",
		required: "obligatorio",
		loading: "Cargando...",
		actions: "Acciones",
	},

	// Sidebar navigation
	nav: {
		menu: "Menú",
		projects: "Proyectos",
		support: "Soporte",
		admin: "Administración",
		docs: "Documentación",
	},

	// Auth screens
	auth: {
		back: "Volver",
		or: "O",
		email: "Correo electrónico",
		password: "Contraseña",
		emailPlaceholder: "tu@correo.com",
		passwordPlaceholder: "Ingresa tu contraseña",

		// Sign in
		signIn: "Iniciar sesión",
		signInSubtitle: "Ingresa tu correo y contraseña para iniciar sesión",
		signInWithGoogle: "Iniciar sesión con Google",
		signInWithGithub: "Iniciar sesión con Github",
		keepLoggedIn: "Mantener sesión iniciada",
		forgotPassword: "¿Olvidaste tu contraseña?",
		noAccount: "¿No tienes una cuenta?",
		invalidCredentials: "Correo o contraseña incorrectos.",

		// Sign up
		signUp: "Crear cuenta",
		signUpSubtitle: "Ingresa tus datos para crear una cuenta",
		signUpWithGoogle: "Crear cuenta con Google",
		signUpWithGithub: "Crear cuenta con Github",
		firstName: "Nombre",
		lastName: "Apellido",
		firstNamePlaceholder: "Ingresa tu nombre",
		lastNamePlaceholder: "Ingresa tu apellido",
		terms: "Al crear una cuenta aceptas los",
		termsLink: "Términos y Condiciones",
		and: "y nuestra",
		privacyLink: "Política de Privacidad",
		haveAccount: "¿Ya tienes una cuenta?",
		signUpError: "Ocurrió un error. Por favor, inténtalo nuevamente.",
		emailTaken: "Este correo ya está registrado.",

		// Reset password
		resetPassword: "¿Olvidaste tu contraseña?",
		resetPasswordSubtitle:
			"Ingresa el correo vinculado a tu cuenta y te enviaremos un enlace para restablecerla.",
		sendResetLink: "Enviar enlace de restablecimiento",
		sendingResetLink: "Enviando…",
		rememberPassword: "Espera, recordé mi contraseña...",
		clickHere: "Haz clic aquí",
		resetLinkSent: "¡Enlace enviado! Revisa tu correo.",
		resetRequestError: "Algo salió mal. Inténtalo nuevamente.",
		// Confirm reset (token page)
		newPasswordLabel: "Nueva contraseña (mín. 8 caracteres)",
		confirmNewPassword: "Confirmar nueva contraseña",
		setNewPassword: "Establecer nueva contraseña",
		settingPassword: "Actualizando…",
		passwordResetSuccess: "¡Contraseña actualizada! Ya puedes iniciar sesión.",
		resetTokenInvalid:
			"Este enlace es inválido o ha expirado. Solicita uno nuevo.",
		passwordsDoNotMatch: "Las contraseñas no coinciden.",

		// Email verification
		verifyEmailTitle: "Verifica Tu Correo",
		verifyingEmail: "Verificando tu dirección de correo…",
		emailVerified: "¡Tu correo ha sido verificado! Ya puedes iniciar sesión.",
		verifyTokenInvalid:
			"Este enlace de verificación es inválido o ha expirado.",
		verifyEmailError: "Algo salió mal. Inténtalo nuevamente.",
		verificationEmailSent:
			"Se ha enviado un correo de verificación a tu bandeja de entrada.",
		checkInboxMessage:
			"Revisa tu correo y haz clic en el enlace de verificación para activar tu cuenta.",
	},

	// Dashboard (project list)
	dashboard: {
		title: "Proyectos",
		subtitle: "Tus proyectos de investigación y colaboraciones",
		newProject: "Nuevo proyecto",
		noProjects: "Aún no hay proyectos. Crea el primero para comenzar.",
		noResults: "Ningún proyecto coincide con tu búsqueda.",
		memberSingular: "miembro",
		memberPlural: "miembros",
		documentSingular: "documento",
		documentPlural: "documentos",
		codeSingular: "código",
		codePlural: "códigos",
		updatedPrefix: "Actualizado",
		searchPlaceholder: "Buscar por nombre o descripción…",
		roleAll: "Todos los roles",
		sortNewest: "Más reciente",
		sortOldest: "Más antiguo",
	},

	// Create project modal
	createProject: {
		title: "Nuevo proyecto",
		namePlaceholder: "Mi proyecto de investigación",
		nameRequired: "El nombre del proyecto es obligatorio",
		descriptionPlaceholder: "Descripción opcional",
		color: "Color",
		submit: "Crear proyecto",
		submitting: "Creando…",
	},

	// Project detail page
	project: {
		deleteProject: "Eliminar proyecto",
		deleting: "Eliminando…",
		deleteConfirm:
			"Esto eliminará permanentemente todos los documentos, códigos y citas.",
		notFound: "Proyecto no encontrado o no tienes acceso.",
		editProject: "Editar proyecto",
		editSubmit: "Guardar cambios",
		editSubmitting: "Guardando…",
	},

	// Tabs
	tabs: {
		documents: "Documentos",
		members: "Miembros",
		codes: "Códigos",
		memos: "Memorandos",
		reports: "Informes",
	},

	// Codes tab
	codes: {
		newCode: "Nuevo código",
		addSubCode: "Agregar subcódigo",
		noCodes: "Aún no hay códigos.",
		noCodesHint: "Crea tu primer código para comenzar a organizar las citas.",
		codeName: "Nombre",
		codeNamePlaceholder: "ej: Entrevista",
		backgroundColor: "Fondo",
		textColor: "Color del texto",
		description: "Descripción",
		descriptionPlaceholder: "¿Qué representa este código?",
		createCode: "Crear código",
		editCode: "Editar código",
		creating: "Creando…",
		saving: "Guardando…",
		deleteCode: "Eliminar código",
		deleteConfirmLine1: "¿Eliminar este código?",
		deleteUsedIn: "Usado en",
		deleteUsedInSuffix: "cita(s) — las asociaciones serán eliminadas.",
		deleteHasChildren: "Tiene",
		deleteHasChildrenSuffix:
			"subcódigo(s) directo(s) — se convertirán en códigos raíz.",
		quoteSingular: "cita",
		quotePlural: "citas",
	},

	// Members tab
	members: {
		inviteTitle: "Invitar colaborador",
		emailPlaceholder: "colega@universidad.edu",
		invite: "Invitar",
		inviting: "Enviando…",
		inviteSuccess: "Invitación enviada con éxito.",
		member: "Miembro",
		role: "Función",
		loadingMembers: "Cargando miembros…",
		removeMember: "Eliminar miembro",
	},

	// Documents tab
	documents: {
		upload: "Subir PDF",
		uploading: "Subiendo…",
		document: "Documento",
		pages: "Páginas",
		size: "Tamaño",
		quotes: "Citas",
		codingProgress: "codificadas",
		noDocuments: "Aún no hay documentos.",
		noDocumentsHint: "Sube un PDF para comenzar.",
		deleteDocument: "Eliminar documento",
		renameDocument: "Renombrar documento",
		download: "Descargar PDF",
	},

	// Document viewer + quote workflow
	viewer: {
		backToProject: "Volver al proyecto",
		loading: "Cargando PDF…",
		loadError: "Error al cargar el PDF.",
		page: "Página",
		of: "de",
		scannedWarning:
			"Este PDF parece ser una imagen escaneada sin capa de texto. La selección de texto y extracción de citas no están disponibles para este documento.",

		// Quote creation
		quoteButton: "Citar",
		quotesTitle: "Citas",
		noQuotes: "Aún no hay citas.",
		noQuotesHint: "Selecciona texto en el PDF para crear una cita.",

		// Quote actions
		deleteQuote: "Eliminar cita",
		deleteQuoteConfirm:
			"¿Eliminar esta cita? Todos los códigos y comentarios asociados también serán eliminados.",

		// Code assignment
		assignCode: "Asignar código",
		noCodesAvailable: "Aún no hay códigos en este proyecto.",
		removeCode: "Quitar código",

		// Comments
		comments: "comentario",
		commentsPlural: "comentarios",
		addComment: "Agregar un comentario…",
		submitComment: "Enviar",
		deleteComment: "Eliminar comentario",
		noComments: "Aún no hay comentarios.",
		allCodesAssigned: "Todos los códigos ya fueron asignados.",
		quoteCreateTitle: "Nueva cita",
		quoteCreateCodes: "Asignar códigos (opcional)",
		quoteCreateConfirm: "Crear",
		quoteCreateSkip: "Crear sin códigos",
		changeHighlightColor: "Cambiar color del resaltado",
	},

	// Reports tab
	reports: {
		tab: "Informes",
		explorer: "Explorador",
		charts: "Gráficos",
		export: "Exportar",
		allDocuments: "Todos los documentos",
		allCodes: "Todos los códigos",
		noQuotes: "Ninguna cita coincide con los filtros actuales.",
		quoteCount: "cita(s)",
		uncodedOnly: "Solo sin código",
		page: "p.",
		quotesHeatmapTitle: "Citas × Códigos",
		coOccurrenceTitle: "Co-ocurrencia de Códigos",
		noDataForCharts: "Agrega citas y asigna códigos para ver los gráficos.",
		document: "Documento",
		code: "Código",
		count: "Cantidad",
		summary: "Resumen",
		documentsTable: "Documentos",
		codesTable: "Códigos",
		quotesCount: "Citas",
		codesUsed: "Códigos usados",
		documentsUsed: "Documentos",
		noData: "Aún no hay citas.",
		exportByCode: "Exportar por código",
		exportByDocument: "Exportar por documento",
		exportCSV: "Descargar CSV",
		exportTXT: "Descargar TXT",
		exportJSON: "Descargar JSON",
		exportJSONHint: "Datos estructurados para uso con otras herramientas (Atlas.ti, NVivo, etc.).",
		exportEmptyHint: "Aún no hay citas para exportar.",
		// Stats
		stats: "Estadísticas",
		totalDocuments: "Documentos",
		totalQuotes: "Citas",
		totalCodes: "Códigos",
		totalMemos: "Memorandos",
		uncodedQuotes: "Citas sin código",
		codeFrequency: "Frecuencia de códigos",
		documentDistribution: "Citas por documento",
		activityTimeline: "Actividad (últimos 30 días)",
	},

	// Memos tab
	memos: {
		tab: "Memorandos",
		newMemo: "Nuevo memorando",
		creating: "Creando…",
		noMemos: "Aún no hay memorandos.",
		noMemosHint:
			"Crea tu primer memorando para empezar a tomar notas de investigación.",
		untitled: "Memorando sin título",
		namePlaceholder: "Título del memorando",
		deleteMemo: "Eliminar memorando",
		deleteConfirm:
			"¿Eliminar este memorando? Esta acción no se puede deshacer.",
		saving: "Guardando…",
		saved: "Guardado",
		lastUpdated: "Última actualización",
		by: "por",
		editorPlaceholder: "Comienza a escribir tus notas de investigación…",
	},

	// Admin panel
	admin: {
		navTitle: "Administración",
		dashboard: "Panel",
		users: "Usuarios",
		projects: "Proyectos",
		tickets: "Soporte",
		totalUsers: "Total de usuarios",
		totalProjects: "Total de proyectos",
		totalDocuments: "Total de documentos",
		totalQuotes: "Total de citas",
		openTickets: "Solicitudes abiertas",
		user: "Usuario",
		email: "Correo electrónico",
		role: "Función",
		status: "Estado",
		active: "Activo",
		suspended: "Suspendido",
		suspend: "Suspender",
		unsuspend: "Reactivar",
		makeAdmin: "Hacer admin",
		makeUser: "Hacer usuario",
		project: "Proyecto",
		members: "Miembros",
		documents: "Documentos",
		codes: "Códigos",
		memos: "Memorandos",
		quotes: "Citas",
		ticket: "Solicitud",
		subject: "Asunto",
		ticketStatus: "Estado",
		openedBy: "Abierto por",
		lastActivity: "Última actividad",
		reply: "Responder",
		replyPlaceholder: "Escribe tu respuesta…",
		send: "Enviar",
		sending: "Enviando…",
		statusOpen: "Abierto",
		statusInProgress: "En progreso",
		statusResolved: "Resuelto",
		statusClosed: "Cerrado",
		markAs: "Marcar como",
		noTickets: "Aún no hay solicitudes de soporte.",
		backToTickets: "Volver a las solicitudes",
		ticketNotFound: "Solicitud no encontrada.",
		messages: "mensajes",
		roleUser: "Usuario",
		roleAdmin: "Admin",
		searchUsers: "Buscar por nombre o correo…",
		searchProjects: "Buscar por nombre…",
		searchTickets: "Buscar por asunto o usuario…",
		filterAllRoles: "Todos los roles",
		filterAllStatuses: "Todos los estados",
		noResults: "No se encontraron resultados.",
	},

	// Support tickets (user-facing)
	support: {
		title: "Soporte",
		newTicket: "Nueva solicitud",
		myTickets: "Mis solicitudes",
		noTickets: "Aún no has abierto ninguna solicitud de soporte.",
		subject: "Asunto",
		subjectPlaceholder: "Describe brevemente el problema",
		message: "Mensaje",
		messagePlaceholder: "Describe tu problema en detalle…",
		submit: "Abrir solicitud",
		submitting: "Abriendo…",
		backToTickets: "Volver al soporte",
		reply: "Responder",
		replyPlaceholder: "Escribe una respuesta…",
		send: "Enviar",
		sending: "Enviando…",
		ticketClosed: "Esta solicitud está cerrada.",
		statusOpen: "Abierto",
		statusInProgress: "En progreso",
		statusResolved: "Resuelto",
		statusClosed: "Cerrado",
		ticketNotFound: "Solicitud no encontrada.",
		messages: "mensajes",
		supportAgent: "Soporte",
		you: "Tú",
		searchPlaceholder: "Buscar por asunto…",
		filterAllStatuses: "Todos los estados",
		noResults: "No se encontraron solicitudes.",
	},

	// Profile page
	profile: {
		title: "Perfil",
		displayName: "Nombre para mostrar",
		namePlaceholder: "Tu nombre",
		saveProfile: "Guardar cambios",
		savingProfile: "Guardando…",
		profileSaved: "Perfil actualizado.",
		changeEmail: "Cambiar correo",
		newEmail: "Nuevo correo electrónico",
		confirmWithPassword: "Confirmar con contraseña actual",
		saveEmail: "Actualizar correo",
		savingEmail: "Actualizando…",
		emailSaved: "Correo actualizado. Usa el nuevo para iniciar sesión.",
		emailTaken: "Este correo ya está en uso.",
		oauthEmail:
			"El correo es administrado por tu proveedor de inicio de sesión y no puede cambiarse aquí.",
		changePassword: "Cambiar contraseña",
		currentPassword: "Contraseña actual",
		newPassword: "Nueva contraseña (mín. 8 caracteres)",
		savePassword: "Actualizar contraseña",
		savingPassword: "Actualizando…",
		passwordSaved: "Contraseña actualizada.",
		wrongPassword: "La contraseña actual es incorrecta.",
		oauthAccount:
			"Tu cuenta usa inicio de sesión con Google/GitHub — el cambio de contraseña no está disponible.",
		// Delete account
		deleteAccount: "Eliminar cuenta",
		deleteAccountWarning:
			"Esta acción es permanente y no se puede deshacer. Todos tus datos serán eliminados.",
		deleteAccountConfirmPassword:
			"Ingresa tu contraseña actual para confirmar la eliminación de la cuenta.",
		deleteAccountConfirmType:
			'Escribe "DELETE" para confirmar la eliminación de la cuenta.',
		deleteAccountTypePlaceholder: "Escribe DELETE",
		deleteAccountConfirm: "Eliminar mi cuenta",
		deletingAccount: "Eliminando…",
		deleteAccountSoleOwner:
			"Eres el único propietario de uno o más proyectos. Transfiere la propiedad antes de eliminar tu cuenta.",
		deleteAccountError: "Algo salió mal. Inténtalo nuevamente.",
	},

	// Invite acceptance page
	invite: {
		accepting: "Aceptando invitación…",
		signInPrompt: "Inicia sesión para aceptar esta invitación.",
		signIn: "Iniciar sesión",
		goToDashboard: "Ir al panel",
	},

	// 404 page
	notFound: {
		heading: "404",
		message: "¡No podemos encontrar la página que estás buscando!",
		backHome: "Volver al inicio",
	},

	// Error page
	errorPage: {
		heading: "Algo salió mal",
		message: "Ocurrió un error inesperado. Inténtalo nuevamente.",
		retry: "Intentar de nuevo",
		backHome: "Volver al inicio",
	},

	// Public landing page
	landing: {
		badge: "Código abierto · Gratuito",
		headline: "Investigación Cualitativa,",
		headlineAccent: "Organizada.",
		subtitle:
			"QAnubis es una plataforma de código abierto para el análisis de datos cualitativos. Sube documentos, codifica fragmentos de texto y construye conocimiento — de forma colaborativa.",
		ctaPrimary: "Comenzar gratis",
		ctaSecondary: "Iniciar sesión",

		featuresTitle: "Todo lo que necesitas para el análisis cualitativo",
		featuresSubtitle:
			"Desde la gestión de documentos hasta la codificación colaborativa e informes visuales — todo en un solo lugar.",
		features: [
			{
				title: "Visor de PDF",
				description:
					"Sube documentos de investigación y navégalos con un visor integrado. Selecciona cualquier fragmento de texto para crear una cita al instante.",
			},
			{
				title: "Codificación Cualitativa",
				description:
					"Construye árboles de códigos jerárquicos y asígnalos a fragmentos seleccionados. Organiza tu análisis con categorías estructuradas y anidadas.",
			},
			{
				title: "Proyectos Colaborativos",
				description:
					"Invita miembros con permisos por función — Propietario, Colaborador o Visualizador — y trabaja en equipo en tiempo real.",
			},
			{
				title: "Memorandos de Investigación",
				description:
					"Escribe y organiza memorandos analíticos vinculados a cada proyecto. Mantén tus reflexiones teóricas junto a los datos.",
			},
			{
				title: "Informes y Gráficos",
				description:
					"Visualiza distribuciones de códigos, mapas de calor y matrices de co-ocurrencia para identificar patrones en tus datos.",
			},
			{
				title: "Exporta tus Hallazgos",
				description:
					"Descarga todas las citas organizadas por código o por documento en formato CSV o TXT — listas para tu próxima publicación.",
			},
		],

		howItWorksTitle: "¿Cómo funciona?",
		howItWorksSubtitle:
			"Del documento bruto a conocimientos estructurados en tres pasos simples.",
		steps: [
			{
				number: "01",
				title: "Crea un proyecto",
				description:
					"Inicia un nuevo proyecto de investigación, dale un nombre y color, e invita a tus colaboradores.",
			},
			{
				number: "02",
				title: "Anota documentos",
				description:
					"Sube archivos PDF, selecciona fragmentos de texto y asigna códigos para construir tu marco analítico.",
			},
			{
				number: "03",
				title: "Analiza e informa",
				description:
					"Explora informes visuales, escribe memorandos y exporta tus hallazgos codificados en múltiples formatos.",
			},
		],

		ctaBannerTitle: "¿Listo para comenzar tu investigación?",
		ctaBannerSubtitle:
			"Crea una cuenta gratuita y comienza a organizar tus datos cualitativos hoy.",
		ctaBannerButton: "Comenzar gratis",

		footerCopyright: "Código abierto.",
		footerGithub: "GitHub",
		footerDocs: "Documentación",
		footerSignIn: "Iniciar sesión",
		footerSignUp: "Crear cuenta",
	},

	// Docs section
	docs: {
		header: "Documentación",
		backToApp: "← QAnubis",
		loading: "Cargando…",
		notFound: "Página no encontrada.",
		sectionDocumentation: "Documentación",
		sectionDevelopment: "Desarrollo",
		nav: {
			home: "Inicio",
			userManual: "Manual de Usuario",
			faq: "FAQ",
			contact: "Contacto",
			howToContribute: "Cómo Contribuir",
			features: "Funcionalidades",
			domainModel: "Modelo de Dominio",
			architecture: "Arquitectura",
			migrationPlan: "Plan de Migración",
			contributionGuidelines: "Guía de Contribución",
		},
	},
};
