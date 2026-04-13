"use client";

import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";


export default function AdminUsersPage() {
	const t = useTranslation();
	const utils = trpc.useUtils();
	const { data: users, isLoading } = trpc.admin.listUsers.useQuery();

	const updateUser = trpc.admin.updateUser.useMutation({
		onSuccess: () => utils.admin.listUsers.invalidate(),
	});

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
						{(users ?? []).map((user) => (
							<tr
								key={user.id}
								className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
							>
								<td className="px-5 py-3">
									<div className="font-medium text-gray-800 dark:text-white/90">
										{user.name ?? "—"}
									</div>
									<div className="text-xs text-gray-400">
										{user._count.projectMembers} projects · {user._count.quotes}{" "}
										quotes
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
										{user.role === "ADMIN" ? t.admin.roleAdmin : t.admin.roleUser}
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
		</div>
	);
}
