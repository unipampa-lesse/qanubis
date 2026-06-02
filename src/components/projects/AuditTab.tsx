"use client";

import { useMemo } from "react";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import {
	AUDIT_ACTIONS,
	AUDIT_ENTITY_TYPES,
	type AuditAction,
	type AuditEntityType,
} from "@/lib/audit/catalog";
import { trpc } from "@/server/client";
import { AuditFiltersBar } from "./audit/AuditFiltersBar";
import { useAuditFilters } from "./audit/useAuditFilters";

interface AuditTabProps {
	projectId: string;
}

export default function AuditTab({ projectId }: AuditTabProps) {
	const t = useTranslation();
	const { locale } = useLanguage();
	const { state, setters, normalizedFilters, clearFilters } = useAuditFilters();

	const membersQuery = trpc.member.list.useInfiniteQuery(
		{
			projectId,
			limit: 30,
			...(normalizedFilters.actorSearch
				? { query: normalizedFilters.actorSearch }
				: {}),
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
		},
	);

	const members = useMemo(
		() =>
			membersQuery.data?.pages
				.flatMap((page) => page.items)
				.map((member) => ({
					id: member.user.id,
					label: member.user.name ?? member.user.email,
				})) ?? [],
		[membersQuery.data],
	);

	const query = trpc.audit.list.useInfiniteQuery(
		{
			projectId,
			limit: 30,
			...(normalizedFilters.query ? { query: normalizedFilters.query } : {}),
			...(normalizedFilters.action ? { action: normalizedFilters.action } : {}),
			...(normalizedFilters.entityType
				? { entityType: normalizedFilters.entityType }
				: {}),
			...(normalizedFilters.actorId
				? { actorId: normalizedFilters.actorId }
				: {}),
			...(normalizedFilters.dateFrom
				? { dateFrom: normalizedFilters.dateFrom }
				: {}),
			...(normalizedFilters.dateTo ? { dateTo: normalizedFilters.dateTo } : {}),
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
			<AuditFiltersBar
				search={state.search}
				onSearchChange={setters.setSearch}
				action={state.action}
				onActionChange={setters.setAction}
				entityType={state.entityType}
				onEntityTypeChange={setters.setEntityType}
				actorSearch={state.actorSearch}
				onActorSearchChange={setters.setActorSearch}
				actorId={state.actorId}
				onActorIdChange={setters.setActorId}
				dateFrom={state.dateFrom}
				onDateFromChange={setters.setDateFrom}
				dateTo={state.dateTo}
				onDateToChange={setters.setDateTo}
				onClear={clearFilters}
				actionOptions={AUDIT_ACTIONS}
				entityOptions={AUDIT_ENTITY_TYPES}
				memberOptions={members}
				canLoadMoreMembers={Boolean(membersQuery.hasNextPage)}
				isLoadingMoreMembers={membersQuery.isFetchingNextPage}
				onLoadMoreMembers={() => membersQuery.fetchNextPage()}
				labels={{
					searchPlaceholder: t.audit.searchPlaceholder,
					filterAllActions: t.audit.filterAllActions,
					filterAllEntities: t.audit.filterAllEntities,
					filterAllUsers: t.audit.filterAllUsers,
					dateFrom: t.audit.dateFrom,
					dateTo: t.audit.dateTo,
					clearFilters: t.audit.clearFilters,
					userSearchPlaceholder: t.audit.userSearchPlaceholder,
					loadMoreUsers: t.audit.loadMoreUsers,
					loadingUsers: t.audit.loadingUsers,
					actions: t.audit.actions as Record<AuditAction, string>,
					entities: t.audit.entities as Record<AuditEntityType, string>,
				}}
			/>

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
									{t.audit.actions[event.action as AuditAction] ?? event.action}
								</span>
								<span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
									{t.audit.entities[event.entityType as AuditEntityType] ??
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
