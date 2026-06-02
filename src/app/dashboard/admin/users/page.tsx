"use client";

import { useMemo, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

const SELECT_CLASS =
	"h-9 appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";

export default function AdminUsersPage() {
	const t = useTranslation();
	const utils = trpc.useUtils();
	const usersQuery = trpc.admin.listUsers.useInfiniteQuery(
		{ limit: 30 },
		{ getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined },
	);
	const users = useMemo(
		() => usersQuery.data?.pages.flatMap((page) => page.items) ?? [],
		[usersQuery.data],
	);

	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState<"" | "ADMIN" | "USER">("");
	const [statusFilter, setStatusFilter] = useState<"" | "active" | "suspended">(
		"",
	);

	const updateUser = trpc.admin.updateUser.useMutation({
		onSuccess: () => utils.admin.listUsers.invalidate(),
	});

	const filtered = useMemo(() => {
		if (!users.length) return [];
		const q = search.trim().toLowerCase();
		return users.filter((u) => {
			const matchSearch =
				!q ||
				(u.name ?? "").toLowerCase().includes(q) ||
				u.email.toLowerCase().includes(q);
			const matchRole = !roleFilter || u.role === roleFilter;
			const matchStatus =
				!statusFilter ||
				(statusFilter === "suspended" ? u.suspended : !u.suspended);
			return matchSearch && matchRole && matchStatus;
		});
	}, [users, search, roleFilter, statusFilter]);

	const isLoading = usersQuery.isLoading;

	if (isLoading) {
		return (
			<div className="space-y-3">
				{[1, 2, 3, 4].map((k) => (
					<div
						key={k}
						className="h-14 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
				{t.admin.users}
			</h1>

			{/* Filters */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t.admin.searchUsers}
						className="h-9 w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
					/>
				</div>
				<div className="relative">
					<select
						value={roleFilter}
						onChange={(e) =>
							setRoleFilter(e.target.value as "" | "ADMIN" | "USER")
						}
						className={SELECT_CLASS}
					>
						<option value="">{t.admin.filterAllRoles}</option>
						<option value="ADMIN">{t.admin.roleAdmin}</option>
						<option value="USER">{t.admin.roleUser}</option>
					</select>
				</div>
				<div className="relative">
					<select
						value={statusFilter}
						onChange={(e) =>
							setStatusFilter(e.target.value as "" | "active" | "suspended")
						}
						className={SELECT_CLASS}
					>
						<option value="">{t.admin.filterAllStatuses}</option>
						<option value="active">{t.admin.active}</option>
						<option value="suspended">{t.admin.suspended}</option>
					</select>
				</div>
			</div>

			{filtered.length === 0 ? (
				<div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400 dark:border-gray-700">
					{t.admin.noResults}
				</div>
			) : (
				<div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 dark:bg-gray-800/50">
							<tr>
								<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
									{t.admin.user}
								</th>
								<th className="hidden px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400 sm:table-cell">
									{t.admin.email}
								</th>
								<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
									{t.admin.role}
								</th>
								<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
									{t.admin.status}
								</th>
								<th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
									{t.common.actions}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
							{filtered.map((user) => (
								<tr
									key={user.id}
									className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
								>
									<td className="px-5 py-3">
										<div className="font-medium text-gray-800 dark:text-white/90">
											{user.name ?? "—"}
										</div>
										<div className="text-xs text-gray-400">
											{user._count.projectMembers} projects ·{" "}
											{user._count.quotes} quotes
										</div>
									</td>
									<td className="hidden px-5 py-3 text-gray-500 dark:text-gray-400 sm:table-cell">
										{user.email}
									</td>
									<td className="px-5 py-3">
										<span
											className={`rounded px-2 py-0.5 text-xs font-medium ${
												user.role === "ADMIN"
													? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
													: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
											}`}
										>
											{user.role === "ADMIN"
												? t.admin.roleAdmin
												: t.admin.roleUser}
										</span>
									</td>
									<td className="px-5 py-3">
										<span
											className={`rounded px-2 py-0.5 text-xs font-medium ${
												user.suspended
													? "bg-error-100 text-error-600 dark:bg-error-500/20 dark:text-error-400"
													: "bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400"
											}`}
										>
											{user.suspended ? t.admin.suspended : t.admin.active}
										</span>
									</td>
									<td className="px-5 py-3 text-right">
										<div className="flex justify-end gap-2">
											<button
												type="button"
												disabled={updateUser.isPending}
												onClick={() =>
													updateUser.mutate({
														userId: user.id,
														suspended: !user.suspended,
													})
												}
												className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-40 dark:hover:text-gray-200"
											>
												{user.suspended ? t.admin.unsuspend : t.admin.suspend}
											</button>
											<button
												type="button"
												disabled={updateUser.isPending}
												onClick={() =>
													updateUser.mutate({
														userId: user.id,
														role: user.role === "ADMIN" ? "USER" : "ADMIN",
													})
												}
												className="text-xs text-gray-400 hover:text-brand-600 disabled:opacity-40 dark:hover:text-brand-400"
											>
												{user.role === "ADMIN"
													? t.admin.makeUser
													: t.admin.makeAdmin}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{usersQuery.hasNextPage && (
				<div className="flex justify-center">
					<button
						type="button"
						onClick={() => usersQuery.fetchNextPage()}
						disabled={usersQuery.isFetchingNextPage}
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
					>
						{usersQuery.isFetchingNextPage
							? t.audit.loadingMore
							: t.audit.loadMore}
					</button>
				</div>
			)}
		</div>
	);
}
