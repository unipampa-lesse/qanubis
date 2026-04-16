"use client";

import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = useTranslation();

	return (
		<div className="flex flex-col items-center justify-center py-20">
			<div className="mx-auto w-full max-w-md text-center">
				<div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/10">
					<svg
						className="h-7 w-7 text-error-500"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
						/>
					</svg>
				</div>

				<h1 className="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">
					{t.errorPage.heading}
				</h1>

				<p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
					{t.errorPage.message}
				</p>

				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						type="button"
						onClick={reset}
						className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
					>
						{t.errorPage.retry}
					</button>
					<Link
						href="/dashboard"
						className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
					>
						{t.errorPage.backHome}
					</Link>
				</div>
			</div>
		</div>
	);
}
