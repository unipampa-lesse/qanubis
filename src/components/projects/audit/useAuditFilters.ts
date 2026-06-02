import { useEffect, useMemo, useState } from "react";
import type { AuditAction, AuditEntityType } from "@/lib/audit/catalog";

const ALL_VALUE = "ALL" as const;

export function useAuditFilters() {
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [actorSearch, setActorSearch] = useState("");
	const [debouncedActorSearch, setDebouncedActorSearch] = useState("");
	const [action, setAction] = useState<AuditAction | typeof ALL_VALUE>(
		ALL_VALUE,
	);
	const [entityType, setEntityType] = useState<
		AuditEntityType | typeof ALL_VALUE
	>(ALL_VALUE);
	const [actorId, setActorId] = useState<string>(ALL_VALUE);
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [search]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedActorSearch(actorSearch);
		}, 250);

		return () => clearTimeout(timeoutId);
	}, [actorSearch]);

	const normalizedFilters = useMemo(
		() => ({
			query: debouncedSearch.trim() || undefined,
			action: action === ALL_VALUE ? undefined : action,
			entityType: entityType === ALL_VALUE ? undefined : entityType,
			actorId: actorId === ALL_VALUE ? undefined : actorId,
			dateFrom: dateFrom || undefined,
			dateTo: dateTo || undefined,
			actorSearch: debouncedActorSearch.trim() || undefined,
		}),
		[
			action,
			actorId,
			dateFrom,
			dateTo,
			debouncedActorSearch,
			debouncedSearch,
			entityType,
		],
	);

	const clearFilters = () => {
		setSearch("");
		setAction(ALL_VALUE);
		setEntityType(ALL_VALUE);
		setActorSearch("");
		setActorId(ALL_VALUE);
		setDateFrom("");
		setDateTo("");
	};

	return {
		state: {
			search,
			actorSearch,
			action,
			entityType,
			actorId,
			dateFrom,
			dateTo,
		},
		setters: {
			setSearch,
			setActorSearch,
			setAction,
			setEntityType,
			setActorId,
			setDateFrom,
			setDateTo,
		},
		normalizedFilters,
		clearFilters,
	};
}
