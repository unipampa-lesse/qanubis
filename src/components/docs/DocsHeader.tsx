"use client";

import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";
import LanguageSelect from "@/components/common/LanguageSelect";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";

export function DocsHeader() {
	const t = useTranslation();

	return (
		<header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
			<div className="mx-auto max-w-7xl px-6 flex h-14 items-center gap-6">
				<Link
					href="/"
					className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
				>
					{t.docs.backToApp}
				</Link>
				<span className="text-gray-300 dark:text-gray-600">/</span>
				<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
					{t.docs.header}
				</span>
				<div className="ml-auto flex items-center gap-3">
					<ThemeToggleButton />
					<LanguageSelect />
				</div>
			</div>
		</header>
	);
}
