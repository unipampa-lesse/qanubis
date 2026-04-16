export const DOC_SLUGS = {
	"user-manual": "User Manual",
	faq: "FAQ",
	contact: "Contact",
	"how-to-contribute": "How to Contribute",
	features: "Features",
	"domain-model": "Domain Model",
	architecture: "Architecture",
	"contribution-guidelines": "Contribution Guidelines",
} as const;

export type DocSlug = keyof typeof DOC_SLUGS;
