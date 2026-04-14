"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTranslation } from "@/context/LanguageContext";

export function DocsSidebar() {
	const pathname = usePathname();
	const t = useTranslation();
	const d = t.docs;

	const navigation = [
		{
			title: d.sectionDocumentation,
			items: [
				{ label: d.nav.home, slug: "" },
				{ label: d.nav.userManual, slug: "user-manual" },
				{ label: d.nav.faq, slug: "faq" },
				{ label: d.nav.contact, slug: "contact" },
				{ label: d.nav.howToContribute, slug: "how-to-contribute" },
			],
		},
		{
			title: d.sectionDevelopment,
			items: [
				{ label: d.nav.features, slug: "features" },
				{ label: d.nav.domainModel, slug: "domain-model" },
				{ label: d.nav.architecture, slug: "architecture" },
				{ label: d.nav.contributionGuidelines, slug: "contribution-guidelines" },
			],
		},
	];

	return (
		<aside className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-700 min-h-screen py-8 pr-6">
			<nav className="sticky top-8 space-y-8">
				{navigation.map((group) => (
					<div key={group.title}>
						<p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
							{group.title}
						</p>
						<ul className="space-y-1">
							{group.items.map((item) => {
								const href = `/docs${item.slug ? `/${item.slug}` : ""}`;
								const isActive =
									item.slug === ""
										? pathname === "/docs"
										: pathname === href;
								return (
									<li key={item.slug}>
										<Link
											href={href}
											className={clsx(
												"block rounded-md px-3 py-1.5 text-sm transition-colors",
												isActive
													? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-400"
													: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
											)}
										>
											{item.label}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				))}
			</nav>
		</aside>
	);
}
