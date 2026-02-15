import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Error 503 | QAnubis",
	description: "This is Error 503 page for QAnubis",
};

export default function Error503() {
	return (
		<div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
			<div className="mx-auto w-full max-w-60.5 text-center sm:max-w-123">
				<h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
					ERROR
				</h1>

				<p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
					We can’t seem to find the page you are looking for!
				</p>

				<Link
					href="/"
					className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
				>
					Back to Home Page
				</Link>
			</div>

			{/* <!-- Footer --> */}
			<p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
				&copy; {new Date().getFullYear()} - QAnubis
			</p>
		</div>
	);
}
