"use client";

import type { ProjectRole } from "@prisma/client";
import { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import Button from "@/components/ui/button/Button";
import { trpc } from "@/server/client";

interface MembersTabProps {
	projectId: string;
	currentRole: ProjectRole;
}

export default function MembersTab({
	projectId,
	currentRole,
}: MembersTabProps) {
	const t = useTranslation();
	const isOwner = currentRole === "OWNER";
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<"COLLABORATOR" | "VIEWER">(
		"COLLABORATOR",
	);
	const [inviteError, setInviteError] = useState<string | null>(null);
	const [inviteSuccess, setInviteSuccess] = useState(false);

	const utils = trpc.useUtils();
	const { data: members, isLoading } = trpc.member.list.useQuery({ projectId });

	const invite = trpc.member.invite.useMutation({
		onSuccess: () => {
			setInviteEmail("");
			setInviteError(null);
			setInviteSuccess(true);
			setTimeout(() => setInviteSuccess(false), 3000);
			utils.member.list.invalidate({ projectId });
		},
		onError: (err) => {
			setInviteError(err.message);
			setInviteSuccess(false);
		},
	});

	const remove = trpc.member.remove.useMutation({
		onSuccess: () => utils.member.list.invalidate({ projectId }),
	});

	const updateRole = trpc.member.updateRole.useMutation({
		onSuccess: () => utils.member.list.invalidate({ projectId }),
	});

	function handleInvite(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!inviteEmail.trim()) return;
		setInviteError(null);
		invite.mutate({ projectId, email: inviteEmail.trim(), role: inviteRole });
	}

	const roleOptions: { value: "COLLABORATOR" | "VIEWER"; label: string }[] = [
		{ value: "COLLABORATOR", label: t.roles.COLLABORATOR },
		{ value: "VIEWER", label: t.roles.VIEWER },
	];

	return (
		<div className="space-y-6">
			{/* Invite form (owners only) */}
			{isOwner && (
				<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
					<h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
						{t.members.inviteTitle}
					</h3>
					<form
						onSubmit={handleInvite}
						className="flex flex-col gap-3 sm:flex-row"
					>
						<input
							type="email"
							value={inviteEmail}
							onChange={(e) => setInviteEmail(e.target.value)}
							placeholder={t.members.emailPlaceholder}
							required
							className="h-11 flex-1 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
						/>
						<select
							value={inviteRole}
							onChange={(e) =>
								setInviteRole(e.target.value as "COLLABORATOR" | "VIEWER")
							}
							className="h-11 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
						>
							{roleOptions.map((o) => (
								<option key={o.value} value={o.value}>
									{o.label}
								</option>
							))}
						</select>
						<Button
							type="submit"
							size="sm"
							disabled={invite.isPending || !inviteEmail.trim()}
							startIcon={<HiOutlinePlus className="h-4 w-4" />}
						>
							{invite.isPending ? t.members.inviting : t.members.invite}
						</Button>
					</form>
					{inviteError && (
						<p className="mt-2 text-sm text-error-500">{inviteError}</p>
					)}
					{inviteSuccess && (
						<p className="mt-2 text-sm text-success-500">
							{t.members.inviteSuccess}
						</p>
					)}
				</div>
			)}

			{/* Members list */}
			<div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
				{isLoading ? (
					<div className="p-6 text-sm text-gray-400">
						{t.members.loadingMembers}
					</div>
				) : (
					<table className="w-full text-sm">
						<thead className="bg-gray-50 dark:bg-gray-800/50">
							<tr>
								<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
									{t.members.member}
								</th>
								<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
									{t.members.role}
								</th>
								{isOwner && (
									<th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
										{t.common.actions}
									</th>
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
							{members?.map((m) => (
								<tr
									key={m.id}
									className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
								>
									<td className="px-5 py-3">
										<div className="font-medium text-gray-800 dark:text-white/90">
											{m.user.name ?? m.user.email}
										</div>
										{m.user.name && (
											<div className="text-xs text-gray-400">
												{m.user.email}
											</div>
										)}
									</td>
									<td className="px-5 py-3">
										{isOwner && m.role !== "OWNER" ? (
											<select
												defaultValue={m.role}
												onChange={(e) =>
													updateRole.mutate({
														projectId,
														userId: m.user.id,
														role: e.target.value as "COLLABORATOR" | "VIEWER",
													})
												}
												className="rounded border border-gray-200 bg-transparent px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-900"
											>
												{roleOptions.map((o) => (
													<option key={o.value} value={o.value}>
														{o.label}
													</option>
												))}
											</select>
										) : (
											<span className="text-gray-600 dark:text-gray-400">
												{t.roles[m.role]}
											</span>
										)}
									</td>
									{isOwner && (
										<td className="px-5 py-3 text-right">
											{m.role !== "OWNER" && (
												<button
													type="button"
													title={t.members.removeMember}
													onClick={() =>
														remove.mutate({
															projectId,
															userId: m.user.id,
														})
													}
													className="text-gray-400 hover:text-error-500 dark:hover:text-error-400"
												>
													<HiOutlineTrash className="h-4 w-4" />
												</button>
											)}
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
