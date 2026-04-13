"use client";
import { createContext, type ReactNode, useContext, useState } from "react";
import { translations as en } from "../locales/en";
import { translations as es } from "../locales/es";
import { translations as pt } from "../locales/pt";

const localeMap = { pt, en, es };

export type Language = keyof typeof localeMap;

export function useTranslation() {
	const { language } = useLanguage();
	return localeMap[language];
}

interface LanguageContextProps {
	language: Language;
	setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
	undefined,
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [language, setLanguage] = useState<Language>("pt");

	return (
		<LanguageContext.Provider value={{ language, setLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage deve ser usado dentro de LanguageProvider");
	}
	return context;
};
