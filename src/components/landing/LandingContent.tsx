"use client";

import Link from "next/link";
import {
	HiOutlineArrowDownTray,
	HiOutlineChartBar,
	HiOutlineClipboardDocumentList,
	HiOutlineDocumentText,
	HiOutlineTag,
	HiOutlineUsers,
} from "react-icons/hi2";
import LanguageSelect from "@/components/common/LanguageSelect";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import { useTranslation } from "@/context/LanguageContext";

const featureIcons = [
	HiOutlineDocumentText,
	HiOutlineTag,
	HiOutlineUsers,
	HiOutlineClipboardDocumentList,
	HiOutlineChartBar,
	HiOutlineArrowDownTray,
];

export default function LandingContent() {
	const t = useTranslation();
	const l = t.landing;

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
			{/* Navbar */}
			<header className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
				<div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
					<span className="font-semibold text-lg tracking-tight text-brand-600 dark:text-brand-400">
						QAnubis
					</span>
					<nav className="flex items-center gap-3">
						<ThemeToggleButton />
						<LanguageSelect />
						<div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
						<Link
							href="/signin"
							className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
						>
							{l.ctaSecondary}
						</Link>
						<Link
							href="/signup"
							className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"
						>
							{l.ctaPrimary}
						</Link>
					</nav>
				</div>
			</header>

			{/* Hero */}
			<section className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
				<div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-medium border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50">
					{l.badge}
				</div>
				<h1 className="text-title-lg sm:text-title-xl font-semibold leading-tight tracking-tight mb-6 max-w-3xl mx-auto">
					{l.headline}{" "}
					<span className="text-brand-500">{l.headlineAccent}</span>
				</h1>
				<p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
					{l.subtitle}
				</p>
				<div className="flex items-center justify-center gap-4 flex-wrap">
					<Link
						href="/signup"
						className="px-6 py-3 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors text-sm"
					>
						{l.ctaPrimary}
					</Link>
					<Link
						href="/signin"
						className="px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
					>
						{l.ctaSecondary}
					</Link>
				</div>
			</section>

			{/* Features */}
			<section className="bg-gray-50 dark:bg-gray-800/40 py-20">
				<div className="mx-auto max-w-6xl px-6">
					<div className="text-center mb-14">
						<h2 className="text-title-sm font-semibold mb-3">
							{l.featuresTitle}
						</h2>
						<p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">
							{l.featuresSubtitle}
						</p>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{l.features.map((feature, i) => {
							const Icon = featureIcons[i];
							return (
								<div
									key={feature.title}
									className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700"
								>
									<div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center mb-4">
										<Icon className="w-5 h-5 text-brand-500" />
									</div>
									<h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
									<p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
										{feature.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className="py-20 mx-auto max-w-6xl px-6">
				<div className="text-center mb-14">
					<h2 className="text-title-sm font-semibold mb-3">
						{l.howItWorksTitle}
					</h2>
					<p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
						{l.howItWorksSubtitle}
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{l.steps.map((step) => (
						<div key={step.number} className="text-center">
							<div className="text-4xl font-bold text-brand-100 dark:text-brand-900 mb-4 select-none">
								{step.number}
							</div>
							<h3 className="font-semibold mb-2">{step.title}</h3>
							<p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
								{step.description}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA Banner */}
			<section className="bg-brand-500 dark:bg-brand-600 py-16">
				<div className="mx-auto max-w-6xl px-6 text-center">
					<h2 className="text-title-sm font-semibold text-white mb-3">
						{l.ctaBannerTitle}
					</h2>
					<p className="text-brand-100 text-sm mb-8 max-w-sm mx-auto">
						{l.ctaBannerSubtitle}
					</p>
					<Link
						href="/signup"
						className="inline-block px-6 py-3 rounded-lg bg-white text-brand-600 font-medium hover:bg-brand-50 transition-colors text-sm"
					>
						{l.ctaBannerButton}
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-gray-100 dark:border-gray-800 py-8">
				<div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 dark:text-gray-500">
					<span>© {new Date().getFullYear()} QAnubis. {l.footerCopyright}</span>
					<div className="flex items-center gap-6">
						<a
							href="https://github.com/unipampa-lesse/qanubis"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
						>
							{l.footerGithub}
						</a>
                        <Link
							href="/docs"
							className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
						>
							{l.footerDocs}
						</Link>
						<Link
							href="/signin"
							className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
						>
							{l.footerSignIn}
						</Link>
						<Link
							href="/signup"
							className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
						>
							{l.footerSignUp}
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
