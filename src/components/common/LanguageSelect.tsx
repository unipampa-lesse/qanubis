"use client";
import { useState } from "react";
import { type Language, useLanguage, useTranslation } from "@/context/LanguageContext";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const LANGUAGES: Language[] = ["pt", "en", "es"];

interface Props {
	dropUp?: boolean;
}

const LanguageSelect: React.FC<Props> = ({ dropUp = false }) => {
	const t = useTranslation();
	const { language, setLanguage } = useLanguage();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setIsOpen((v) => !v)}
				aria-label={t.language}
				className="dropdown-toggle relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-100 hover:text-gray-700 h-11 w-11 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white text-xs font-semibold uppercase"
			>
				{language}
			</button>
			<Dropdown
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				className={dropUp ? "bottom-full mb-2 mt-0 min-w-36 p-1" : "min-w-36 p-1"}
			>
				{LANGUAGES.map((lang) => (
					<DropdownItem
						key={lang}
						tag="button"
						baseClassName=""
						onItemClick={() => {
							setLanguage(lang);
							setIsOpen(false);
						}}
						className={`flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm transition-colors ${
							language === lang
								? "text-brand-500 bg-brand-50 dark:text-brand-400 dark:bg-brand-950/40"
								: "text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
						}`}
					>
						{t.languages[lang]}
						{language === lang && (
							<svg
								width="14"
								height="14"
								viewBox="0 0 14 14"
								fill="none"
								aria-hidden="true"
							>
								<path
									d="M2 7.5l3 3L12 3"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)}
					</DropdownItem>
				))}
			</Dropdown>
		</div>
	);
};

export default LanguageSelect;
