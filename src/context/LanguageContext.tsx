'use client';
import { createContext, useState, useContext, ReactNode } from 'react';
import { translations as pt } from '../locales/pt';
import { translations as en } from '../locales/en';

const localeMap = {
  pt,
  en,
};
export function useTranslation() {
  const { language } = useLanguage();
  return localeMap[language];
}

export type Language = 'pt' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de LanguageProvider');
  }
  return context;
};
