"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

type AuditActionKey =
	| "PROJECT_CREATED"
	| "PROJECT_UPDATED"
	| "PROJECT_DELETED"
	| "PROJECT_OWNERSHIP_TRANSFERRED"
	| "MEMBER_INVITED"
	| "MEMBER_INVITE_ACCEPTED"
	| "MEMBER_ROLE_UPDATED"
	| "MEMBER_REMOVED"
	| "MEMBER_LEFT"
	| "DOCUMENT_UPDATED"
	| "DOCUMENT_DELETED"
	| "CODE_CREATED"
	| "CODE_UPDATED"
	| "CODE_DELETED"
	| "QUOTE_CREATED"
	| "QUOTE_COLOR_UPDATED"
	| "QUOTE_DELETED"
	| "QUOTE_CODE_ASSIGNED"
	| "QUOTE_CODE_REMOVED"
	| "MEMO_CREATED"
	| "MEMO_UPDATED"
	| "MEMO_DELETED";

type AuditEntityKey =
	| "PROJECT"
	| "PROJECT_MEMBER"
	| "DOCUMENT"
	| "CODE"
	| "QUOTE"
	| "QUOTE_CODE"
	| "MEMO";

const actionOptions: AuditActionKey[] = [
	"PROJECT_CREATED",
	"PROJECT_UPDATED",
	"PROJECT_DELETED",
	"PROJECT_OWNERSHIP_TRANSFERRED",
	"MEMBER_INVITED",
	"MEMBER_INVITE_ACCEPTED",
	"MEMBER_ROLE_UPDATED",
	"MEMBER_REMOVED",
	"MEMBER_LEFT",
	"DOCUMENT_UPDATED",
	"DOCUMENT_DELETED",
	"CODE_CREATED",
	"CODE_UPDATED",
	"CODE_DELETED",
	"QUOTE_CREATED",
	"QUOTE_COLOR_UPDATED",
	"QUOTE_DELETED",
	"QUOTE_CODE_ASSIGNED",
	"QUOTE_CODE_REMOVED",
	"MEMO_CREATED",
	"MEMO_UPDATED",
	"MEMO_DELETED",
];

const entityOptions: AuditEntityKey[] = [
	"PROJECT",
	"PROJECT_MEMBER",
	"DOCUMENT",
	"CODE",
	"QUOTE",
	"QUOTE_CODE",
	"MEMO",
];

interface AuditTabProps {
	projectId: string;
}

export default function AuditTab({ projectId }: AuditTabProps) {
	const t = useTranslation();
	const { locale } = useLanguage();
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [action, setAction] = useState<AuditActionKey | "ALL">("ALL");
	const [entityType, setEntityType] = useState<AuditEntityKey | "ALL">("ALL");
	const [actorId, setActorId] = useState<string>("ALL");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [search]);

	const membersQuery = trpc.member.list.useQuery({ projectId, limit: 100 });
	const members = membersQuery.data?.items ?? [];

	const normalizedSearch = debouncedSearch.trim() || undefined;
	const normalizedAction = action === "ALL" ? undefined : action;
	const normalizedEntityType = entityType === "ALL" ? undefined : entityType;
	const normalizedActorId = actorId === "ALL" ? undefined : actorId;
	const normalizedDateFrom = dateFrom
		? new Date(`${dateFrom}T00:00:00`)
		: undefined;
	const normalizedDateTo = dateTo ? new Date(`${dateTo}T00:00:00`) : undefined;

	const query = trpc.audit.list.useInfiniteQuery(
		{
			projectId,
			limit: 30,
			...(normalizedSearch ? { query: normalizedSearch } : {}),
			...(normalizedAction ? { action: normalizedAction } : {}),
			...(normalizedEntityType ? { entityType: normalizedEntityType } : {}),
			...(normalizedActorId ? { actorId: normalizedActorId } : {}),
			...(normalizedDateFrom ? { dateFrom: normalizedDateFrom } : {}),
			...(normalizedDateTo ? { dateTo: normalizedDateTo } : {}),
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
		},
	);

	const items = useMemo(
		() => query.data?.pages.flatMap((p) => p.items) ?? [],
		[query.data],
	);

	if (query.isLoading) {
		return (
			<div className="space-y-3">
				<div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
				<div className="h-16 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800" />
				<div className="h-16 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-2">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t.audit.searchPlaceholder}
					className="h-9 min-w-56 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
				/>

				<select
					value={action}
					onChange={(e) => setAction(e.target.value as AuditActionKey | "ALL")}
					className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
				>
					<option value="ALL">{t.audit.filterAllActions}</option>
					{actionOptions.map((opt) => (
						<option key={opt} value={opt}>
							{t.audit.actions[opt]}
						</option>
					))}
				</select>

				<select
					value={entityType}
					onChange={(e) =>
						setEntityType(e.target.value as AuditEntityKey | "ALL")
					}
					className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
				>
					<option value="ALL">{t.audit.filterAllEntities}</option>
					{entityOptions.map((opt) => (
						<option key={opt} value={opt}>
							{t.audit.entities[opt]}
						</option>
					))}
				</select>

				<select
					value={actorId}
					onChange={(e) => setActorId(e.target.value)}
					className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
				>
					<option value="ALL">{t.audit.filterAllUsers}</option>
					{members.map((member) => (
						<option key={member.user.id} value={member.user.id}>
							{member.user.name ?? member.user.email}
						</option>
					))}
				</select>

				<input
					type="date"
					value={dateFrom}
					onChange={(e) => setDateFrom(e.target.value)}
					aria-label={t.audit.dateFrom}
					className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
				/>

				<input
					type="date"
					value={dateTo}
					onChange={(e) => setDateTo(e.target.value)}
					aria-label={t.audit.dateTo}
					className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
				/>

				<button
					type="button"
					onClick={() => {
						setSearch("");
						setAction("ALL");
						setEntityType("ALL");
						setActorId("ALL");
						setDateFrom("");
						setDateTo("");
					}}
					className="h-9 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
				>
					{t.audit.clearFilters}
				</button>
			</div>

			{items.length === 0 ? (
				<div className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400 dark:border-gray-700">
					{t.audit.empty}
				</div>
			) : (
				<div className="space-y-2">
					{items.map((event) => (
						<div
							key={event.id}
							className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50"
						>
							<div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
								<span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
									{t.audit.actions[event.action as AuditActionKey] ??
										event.action}
								</span>
								<span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
									{t.audit.entities[event.entityType as AuditEntityKey] ??
										event.entityType}
								</span>
								<span>{new Date(event.createdAt).toLocaleString(locale)}</span>
							</div>
							<p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
								{event.summary ??
									t.audit.fallbackSummary.replace("{action}", event.action)}
							</p>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								{event.actor?.name ??
									event.actor?.email ??
									t.audit.unknownActor}
							</p>
						</div>
					))}
				</div>
			)}

			{query.hasNextPage && (
				<div className="pt-2">
					<button
						type="button"
						onClick={() => query.fetchNextPage()}
						disabled={query.isFetchingNextPage}
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
					>
						{query.isFetchingNextPage ? t.audit.loadingMore : t.audit.loadMore}
					</button>
				</div>
			)}
		</div>
	);
}
