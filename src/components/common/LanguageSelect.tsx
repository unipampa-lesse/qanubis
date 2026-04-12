"use client";
import { useLanguage, useTranslation } from "@/context/LanguageContext";

const LanguageSelect: React.FC = () => {
	const t = useTranslation();
	const { language, setLanguage } = useLanguage();
	return (
		<select
			value={language}
			onChange={(e) => setLanguage(e.target.value as "pt" | "en")}
			className="ml-2 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 text-sm"
			aria-label={t.language}
		>
			<option value="pt">{t.languages[0]}</option>
			<option value="en">{t.languages[1]}</option>
		</select>
	);
};

export default LanguageSelect;
