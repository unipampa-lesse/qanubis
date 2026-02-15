"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { IoGridOutline } from "react-icons/io5";
import { FaChartPie, FaChevronDown  } from "react-icons/fa";
import { GoHorizontalRule } from "react-icons/go";
import { CiChat1 } from "react-icons/ci";

type NavItem = {
	name: string;
	icon: React.ReactNode;
	path?: string;
	new?: boolean;
	subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
	{
		icon: <IoGridOutline />,
		name: "Dashboard",
		subItems: [
			{ name: "Ecommerce", path: "/" },
			{ name: "Analytics", path: "/analytics" },
			{ name: "Marketing", path: "/marketing" },
			{ name: "CRM", path: "/crm" },
			{ name: "Stocks", path: "/stocks" },
			{ name: "SaaS", path: "/saas", new: true },
			{ name: "Logistics", path: "/logistics", new: true },
		]
    }
];

const othersItems: NavItem[] = [
	{
		icon: <FaChartPie />,
		name: "Charts",
		subItems: [
			{ name: "Line Chart", path: "/line-chart", pro: false },
			{ name: "Bar Chart", path: "/bar-chart", pro: false },
			{ name: "Pie Chart", path: "/pie-chart", pro: false },
		],
	}
];

const supportItems: NavItem[] = [
	{
		icon: <CiChat1  />,
		name: "Chat",
		path: "/chat",
	}
];

const AppSidebar: React.FC = () => {
	const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
	const pathname = usePathname();

	const renderMenuItems = (
		navItems: NavItem[],
		menuType: "main" | "support" | "others",
	) => (
		<ul className="flex flex-col gap-1">
			{navItems.map((nav, index) => (
				<li key={nav.name}>
					{nav.subItems ? (
						<button
							onClick={() => handleSubmenuToggle(index, menuType)}
							className={`menu-item group  ${
								openSubmenu?.type === menuType && openSubmenu?.index === index
									? "menu-item-active"
									: "menu-item-inactive"
							} cursor-pointer ${
								!isExpanded && !isHovered
									? "lg:justify-center"
									: "lg:justify-start"
							}`}
						>
							<span
								className={` ${
									openSubmenu?.type === menuType && openSubmenu?.index === index
										? "menu-item-icon-active"
										: "menu-item-icon-inactive"
								}`}
							>
								{nav.icon}
							</span>
							{(isExpanded || isHovered || isMobileOpen) && (
								<span className={`menu-item-text`}>{nav.name}</span>
							)}
							{nav.new && (isExpanded || isHovered || isMobileOpen) && (
								<span
									className={`ml-auto absolute right-10 ${
										openSubmenu?.type === menuType &&
										openSubmenu?.index === index
											? "menu-dropdown-badge-active"
											: "menu-dropdown-badge-inactive"
									} menu-dropdown-badge`}
								>
									new
								</span>
							)}
							{(isExpanded || isHovered || isMobileOpen) && (
								<FaChevronDown 
									className={`ml-auto w-5 h-5 transition-transform duration-200  ${
										openSubmenu?.type === menuType &&
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
									className={`${
										isActive(nav.path)
											? "menu-item-icon-active"
											: "menu-item-icon-inactive"
									}`}
								>
									{nav.icon}
								</span>
								{(isExpanded || isHovered || isMobileOpen) && (
									<span className={`menu-item-text`}>{nav.name}</span>
								)}
							</Link>
						)
					)}
					{nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
						<div
							ref={(el) => {
								subMenuRefs.current[`${menuType}-${index}`] = el;
							}}
							className="overflow-hidden transition-all duration-300"
							style={{
								height:
									openSubmenu?.type === menuType && openSubmenu?.index === index
										? `${subMenuHeight[`${menuType}-${index}`]}px`
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
											<span className="flex items-center gap-1 ml-auto">
												{subItem.new && (
													<span
														className={`ml-auto ${
															isActive(subItem.path)
																? "menu-dropdown-badge-active"
																: "menu-dropdown-badge-inactive"
														} menu-dropdown-badge `}
													>
														new
													</span>
												)}
												{subItem.pro && (
													<span
														className={`ml-auto ${
															isActive(subItem.path)
																? "menu-dropdown-badge-pro-active"
																: "menu-dropdown-badge-pro-inactive"
														} menu-dropdown-badge-pro `}
													>
														pro
													</span>
												)}
											</span>
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

	const [openSubmenu, setOpenSubmenu] = useState<{
		type: "main" | "support" | "others";
		index: number;
	} | null>(null);
	const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
		{},
	);
	const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
	const isActive = useCallback((path: string) => path === pathname, [pathname]);

	useEffect(() => {
		let submenuMatched = false;
		["main", "support", "others"].forEach((menuType) => {
			const items =
				menuType === "main"
					? navItems
					: menuType === "support"
						? supportItems
						: othersItems;
			items.forEach((nav, index) => {
				if (nav.subItems) {
					nav.subItems.forEach((subItem) => {
						if (isActive(subItem.path)) {
							setOpenSubmenu({
								type: menuType as "main" | "support" | "others",
								index,
							});
							submenuMatched = true;
						}
					});
				}
			});
		});

		if (!submenuMatched) {
			setOpenSubmenu(null);
		}
	}, [pathname, isActive]);

	useEffect(() => {
		if (openSubmenu !== null) {
			const key = `${openSubmenu.type}-${openSubmenu.index}`;
			if (subMenuRefs.current[key]) {
				setSubMenuHeight((prevHeights) => ({
					...prevHeights,
					[key]: subMenuRefs.current[key]?.scrollHeight || 0,
				}));
			}
		}
	}, [openSubmenu]);

	const handleSubmenuToggle = (
		index: number,
		menuType: "main" | "support" | "others",
	) => {
		setOpenSubmenu((prevOpenSubmenu) => {
			if (
				prevOpenSubmenu &&
				prevOpenSubmenu.type === menuType &&
				prevOpenSubmenu.index === index
			) {
				return null;
			}
			return { type: menuType, index };
		});
	};

	return (
		<aside
			className={`fixed  flex flex-col xl:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-full transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
					isExpanded || isMobileOpen
						? "w-72.5"
						: isHovered
							? "w-72.5"
							: "w-22.5"
				}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        xl:translate-x-0`}
			onMouseEnter={() => !isExpanded && setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				className={`py-8 flex  ${
					!isExpanded && !isHovered ? "xl:justify-center" : "justify-start"
				}`}
			>
				<Link href="/">
					{isExpanded || isHovered || isMobileOpen ? (
						<h2 className="text-2xl font-bold">QAnubis</h2>
					) : (
						<h2 className="text-2xl font-bold">QAnubis</h2>
					)}
				</Link>
			</div>
			<div className="flex flex-col overflow-y-auto  duration-300 ease-linear no-scrollbar">
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
									"Menu"
								) : (
									<GoHorizontalRule  />
								)}
							</h2>
							{renderMenuItems(navItems, "main")}
						</div>
						<div>
							<h2
								className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
									!isExpanded && !isHovered
										? "xl:justify-center"
										: "justify-start"
								}`}
							>
								{isExpanded || isHovered || isMobileOpen ? (
									"Support"
								) : (
									<GoHorizontalRule  />
								)}
							</h2>
							{renderMenuItems(supportItems, "support")}
						</div>
						<div>
							<h2
								className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
									!isExpanded && !isHovered
										? "xl:justify-center"
										: "justify-start"
								}`}
							>
								{isExpanded || isHovered || isMobileOpen ? "Others" : <GoHorizontalRule />}
							</h2>
							{renderMenuItems(othersItems, "others")}
						</div>
					</div>
				</nav>
				{isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
			</div>
		</aside>
	);
};

export default AppSidebar;
