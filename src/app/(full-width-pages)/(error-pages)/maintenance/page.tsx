import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Maintenance Page | QAnubis",
	description: "This is Maintenance page for QAnubis",
};

export default function Maintenance() {
	return (
		<div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
			<div>
				<div className="mx-auto w-full max-w-68.5 text-center sm:max-w-138.75">
					<h1 className="mb-2 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
						MAINTENANCE
					</h1>

					<p className="mt-6 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
						Our Site is Currently under maintenance We will be back Shortly
						Thank You For Patience
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
		</div>
	);
}
