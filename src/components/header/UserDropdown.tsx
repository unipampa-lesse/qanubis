"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import {
	HiArrowRightOnRectangle,
	HiOutlineBookOpen,
	HiOutlineCog6Tooth,
	HiOutlineLifebuoy,
	HiOutlineUser,
} from "react-icons/hi2";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UserDropdown() {
	const t = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const { data: user } = trpc.user.me.useQuery();

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen((v) => !v)}
				className="flex items-center gap-2 dropdown-toggle text-gray-700 dark:text-gray-400"
			>
				<FaRegCircleUser size={22} />
				<span className="hidden text-sm font-medium sm:block">
					{user?.name ?? "…"}
				</span>
				<svg
					className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
					width="16"
					height="16"
					viewBox="0 0 18 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			<Dropdown
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				className="absolute right-0 mt-4 flex w-60 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
			>
				{/* Identity */}
				<div className="px-1 pb-3">
					<span className="block text-sm font-medium text-gray-800 dark:text-white/90">
						{user?.name ?? "—"}
					</span>
					<span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
						{user?.email ?? ""}
					</span>
				</div>

				<ul className="flex flex-col gap-1 border-t border-gray-200 pt-3 pb-3 border-b dark:border-gray-800">
					<li>
						<DropdownItem
							onItemClick={() => setIsOpen(false)}
							tag="a"
							href="/dashboard/profile"
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
						>
							<HiOutlineUser className="h-5 w-5 text-gray-500" />
							{t.profile.title}
						</DropdownItem>
					</li>
					<li>
						<DropdownItem
							onItemClick={() => setIsOpen(false)}
							tag="a"
							href="/dashboard/support"
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
						>
							<HiOutlineLifebuoy className="h-5 w-5 text-gray-500" />
							{t.support.title}
						</DropdownItem>
					</li>

                    <li>
						<DropdownItem
							onItemClick={() => setIsOpen(false)}
							tag="a"
							href="/docs"
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
						>
							<HiOutlineLifebuoy className="h-5 w-5 text-gray-500" />
							{t.docs.header}
						</DropdownItem>
					</li>
					{user?.role === "ADMIN" && (
						<li>
							<DropdownItem
								onItemClick={() => setIsOpen(false)}
								tag="a"
								href="/dashboard/admin"
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
							>
								<HiOutlineCog6Tooth className="h-5 w-5 text-gray-500" />
								Admin
							</DropdownItem>
						</li>
					)}
				</ul>
				<button
					type="button"
					onClick={() => signOut({ callbackUrl: "/" })}
					className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
				>
					<HiArrowRightOnRectangle className="h-5 w-5 text-gray-500" />
					Sign out
				</button>
			</Dropdown>
		</div>
	);
}
