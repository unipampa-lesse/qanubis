"use client";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { translations as en } from "../locales/en";
import { translations as es } from "../locales/es";
import { translations as pt } from "../locales/pt";

const localeMap = { pt, en, es };

export type Language = keyof typeof localeMap;

export const bcp47Locale: Record<Language, string> = {
	pt: "pt-BR",
	en: "en-US",
	es: "es-ES",
};

const STORAGE_KEY = "qanubis-lang";

function getInitialLanguage(): Language {
	if (typeof window === "undefined") return "pt";
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && stored in localeMap) return stored as Language;
	const browserLang = navigator.language.slice(0, 2);
	if (browserLang in localeMap) return browserLang as Language;
	return "pt";
}

export function useTranslation() {
	const { language } = useLanguage();
	return localeMap[language];
}

interface LanguageContextProps {
	language: Language;
	locale: string;
	setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
	undefined,
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [language, setLanguageState] = useState<Language>("pt");

	useEffect(() => {
		setLanguageState(getInitialLanguage());
	}, []);

	const setLanguage = useCallback((lang: Language) => {
		setLanguageState(lang);
		localStorage.setItem(STORAGE_KEY, lang);
	}, []);

	useEffect(() => {
		document.documentElement.lang = language;
	}, [language]);

	return (
		<LanguageContext.Provider value={{ language, locale: bcp47Locale[language], setLanguage }}>
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
