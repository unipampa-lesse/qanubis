import type React from "react";
import { useSidebar } from "@/context/SidebarContext";

const Backdrop: React.FC = () => {
	const { isMobileOpen, toggleMobileSidebar } = useSidebar();

	if (!isMobileOpen) return null;

	return (
		<button
			type="button"
			aria-label="Close sidebar"
			className="fixed inset-0 z-40 bg-gray-900/50 xl:hidden cursor-default"
			onClick={toggleMobileSidebar}
		/>
	);
};

export default Backdrop;
