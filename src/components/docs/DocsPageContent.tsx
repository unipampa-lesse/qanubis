"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/context/LanguageContext";
import { MarkdownContent } from "./MarkdownContent";

interface DocsPageContentProps {
	slug: string;
}

export function DocsPageContent({ slug }: DocsPageContentProps) {
	const { language } = useLanguage();
	const t = useTranslation();
	const [content, setContent] = useState<string | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setContent(null);
		setError(false);

		async function load() {
			// Try the current language first, then fall back to English
			const urls = [
				`/content/docs/${language}/${slug}.md`,
				`/content/docs/en/${slug}.md`,
			];

			for (const url of urls) {
				const res = await fetch(url);
				if (res.ok) {
					const text = await res.text();
					if (!cancelled) setContent(text);
					return;
				}
			}

			if (!cancelled) setError(true);
		}

		load();
		return () => {
			cancelled = true;
		};
	}, [language, slug]);

	if (error) {
		return (
			<p className="text-gray-500 dark:text-gray-400">{t.docs.notFound}</p>
		);
	}

	if (content === null) {
		return (
			<p className="text-gray-400 dark:text-gray-500 animate-pulse">
				{t.docs.loading}
			</p>
		);
	}

	return <MarkdownContent content={content} />;
}
