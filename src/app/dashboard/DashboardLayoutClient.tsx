"use client";

import type React from "react";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";

export default function DashboardLayoutClient({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isExpanded, isHovered, isMobileOpen } = useSidebar();

	const mainContentMargin = isMobileOpen
		? "ml-0"
		: isExpanded || isHovered
			? "xl:ml-[290px]"
			: "xl:ml-[90px]";

	return (
		<div className="min-h-screen xl:flex">
			<AppSidebar />
			<Backdrop />
			<div
				className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
			>
				<AppHeader />
				<div className="overflow-x-hidden p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
					{children}
				</div>
			</div>
		</div>
	);
}
