"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { GoHorizontalRule } from "react-icons/go";
import {
	HiOutlineCog6Tooth,
	HiOutlineLifebuoy,
	HiOutlineSquares2X2,
} from "react-icons/hi2";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
	name: string;
	icon: React.ReactNode;
	path?: string;
	subItems?: { name: string; path: string }[];
};

const AppSidebar: React.FC = () => {
	const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
	const pathname = usePathname();
	const t = useTranslation();

	// Fetch current user's role to conditionally show the admin link
	const { data: me } = trpc.user.me.useQuery(undefined, {
		staleTime: Number.POSITIVE_INFINITY,
	});
	const isAdmin = me?.role === "ADMIN";

	const navItems: NavItem[] = [
		{
			icon: <HiOutlineSquares2X2 />,
			name: t.nav.projects,
			path: "/dashboard",
		},
		{
			icon: <HiOutlineLifebuoy />,
			name: t.nav.support,
			path: "/dashboard/support",
		},
		...(isAdmin
			? [
					{
						icon: <HiOutlineCog6Tooth />,
						name: t.nav.admin,
						path: "/dashboard/admin",
					},
				]
			: []),
	];

	const [openSubmenu, setOpenSubmenu] = useState<{
		type: "main";
		index: number;
	} | null>(null);
	const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
		{},
	);
	const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
	const isActive = useCallback((path: string) => path === pathname, [pathname]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: navItems changes only on language change; pathname is the relevant trigger
	useEffect(() => {
		let submenuMatched = false;
		navItems.forEach((nav, index) => {
			if (nav.subItems) {
				nav.subItems.forEach((subItem) => {
					if (isActive(subItem.path)) {
						setOpenSubmenu({ type: "main", index });
						submenuMatched = true;
					}
				});
			}
		});
		if (!submenuMatched) setOpenSubmenu(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	useEffect(() => {
		if (openSubmenu !== null) {
			const key = `main-${openSubmenu.index}`;
			if (subMenuRefs.current[key]) {
				setSubMenuHeight((prev) => ({
					...prev,
					[key]: subMenuRefs.current[key]?.scrollHeight || 0,
				}));
			}
		}
	}, [openSubmenu]);

	const handleSubmenuToggle = (index: number) => {
		setOpenSubmenu((prev) =>
			prev && prev.type === "main" && prev.index === index
				? null
				: { type: "main", index },
		);
	};

	const renderMenuItems = (items: NavItem[]) => (
		<ul className="flex flex-col gap-1">
			{items.map((nav, index) => (
				<li key={nav.name}>
					{nav.subItems ? (
						<button
							type="button"
							onClick={() => handleSubmenuToggle(index)}
							className={`menu-item group ${
								openSubmenu?.index === index
									? "menu-item-active"
									: "menu-item-inactive"
							} cursor-pointer ${
								!isExpanded && !isHovered
									? "lg:justify-center"
									: "lg:justify-start"
							}`}
						>
							<span
								className={
									openSubmenu?.index === index
										? "menu-item-icon-active"
										: "menu-item-icon-inactive"
								}
							>
								{nav.icon}
							</span>
							{(isExpanded || isHovered || isMobileOpen) && (
								<span className="menu-item-text">{nav.name}</span>
							)}
							{(isExpanded || isHovered || isMobileOpen) && (
								<FaChevronDown
									className={`ml-auto w-5 h-5 transition-transform duration-200 ${
										openSubmenu?.index === index
											? "rotate-180 text-brand-500"
											: ""
									}`}
								/>
							)}
						</button>
					) : (
						nav.path && (
							<Link
								href={nav.path}
								className={`menu-item group ${
									isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
								}`}
							>
								<span
									className={
										isActive(nav.path)
											? "menu-item-icon-active"
											: "menu-item-icon-inactive"
									}
								>
									{nav.icon}
								</span>
								{(isExpanded || isHovered || isMobileOpen) && (
									<span className="menu-item-text">{nav.name}</span>
								)}
							</Link>
						)
					)}
					{nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
						<div
							ref={(el) => {
								subMenuRefs.current[`main-${index}`] = el;
							}}
							className="overflow-hidden transition-all duration-300"
							style={{
								height:
									openSubmenu?.index === index
										? `${subMenuHeight[`main-${index}`]}px`
										: "0px",
							}}
						>
							<ul className="mt-2 space-y-1 ml-9">
								{nav.subItems.map((subItem) => (
									<li key={subItem.name}>
										<Link
											href={subItem.path}
											className={`menu-dropdown-item ${
												isActive(subItem.path)
													? "menu-dropdown-item-active"
													: "menu-dropdown-item-inactive"
											}`}
										>
											{subItem.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
				</li>
			))}
		</ul>
	);

	return (
		<aside
			className={`fixed flex flex-col xl:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-full transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen ? "w-72.5" : isHovered ? "w-72.5" : "w-22.5"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        xl:translate-x-0`}
			onMouseEnter={() => !isExpanded && setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				className={`py-8 flex ${
					!isExpanded && !isHovered ? "xl:justify-center" : "justify-start"
				}`}
			>
				<Link href="/dashboard">
					<h2 className="text-2xl font-bold">QAnubis</h2>
				</Link>
			</div>
			<div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
				<nav className="mb-6">
					<div className="flex flex-col gap-4">
						<div>
							<h2
								className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
									!isExpanded && !isHovered
										? "xl:justify-center"
										: "justify-start"
								}`}
							>
								{isExpanded || isHovered || isMobileOpen ? (
									t.nav.menu
								) : (
									<GoHorizontalRule />
								)}
							</h2>
							{renderMenuItems(navItems)}
						</div>
					</div>
				</nav>
			</div>
		</aside>
	);
};

export default AppSidebar;
