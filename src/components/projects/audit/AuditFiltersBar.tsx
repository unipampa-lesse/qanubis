import type { AuditAction, AuditEntityType } from "@/lib/audit/catalog";

interface AuditMemberOption {
	id: string;
	label: string;
}

interface AuditFiltersBarProps {
	search: string;
	onSearchChange: (value: string) => void;
	action: AuditAction | "ALL";
	onActionChange: (value: AuditAction | "ALL") => void;
	entityType: AuditEntityType | "ALL";
	onEntityTypeChange: (value: AuditEntityType | "ALL") => void;
	actorSearch: string;
	onActorSearchChange: (value: string) => void;
	actorId: string;
	onActorIdChange: (value: string) => void;
	dateFrom: string;
	onDateFromChange: (value: string) => void;
	dateTo: string;
	onDateToChange: (value: string) => void;
	onClear: () => void;
	actionOptions: readonly AuditAction[];
	entityOptions: readonly AuditEntityType[];
	memberOptions: AuditMemberOption[];
	canLoadMoreMembers: boolean;
	isLoadingMoreMembers: boolean;
	onLoadMoreMembers: () => void;
	labels: {
		searchPlaceholder: string;
		filterAllActions: string;
		filterAllEntities: string;
		filterAllUsers: string;
		dateFrom: string;
		dateTo: string;
		clearFilters: string;
		userSearchPlaceholder: string;
		loadMoreUsers: string;
		loadingUsers: string;
		actions: Record<AuditAction, string>;
		entities: Record<AuditEntityType, string>;
	};
}

export function AuditFiltersBar(props: AuditFiltersBarProps) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<input
				type="text"
				value={props.search}
				onChange={(e) => props.onSearchChange(e.target.value)}
				placeholder={props.labels.searchPlaceholder}
				className="h-9 min-w-56 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
			/>

			<select
				value={props.action}
				onChange={(e) =>
					props.onActionChange(e.target.value as AuditAction | "ALL")
				}
				className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
			>
				<option value="ALL">{props.labels.filterAllActions}</option>
				{props.actionOptions.map((opt) => (
					<option key={opt} value={opt}>
						{props.labels.actions[opt]}
					</option>
				))}
			</select>

			<select
				value={props.entityType}
				onChange={(e) =>
					props.onEntityTypeChange(e.target.value as AuditEntityType | "ALL")
				}
				className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
			>
				<option value="ALL">{props.labels.filterAllEntities}</option>
				{props.entityOptions.map((opt) => (
					<option key={opt} value={opt}>
						{props.labels.entities[opt]}
					</option>
				))}
			</select>

			<input
				type="text"
				value={props.actorSearch}
				onChange={(e) => props.onActorSearchChange(e.target.value)}
				placeholder={props.labels.userSearchPlaceholder}
				className="h-9 min-w-56 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
			/>

			<select
				value={props.actorId}
				onChange={(e) => props.onActorIdChange(e.target.value)}
				className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
			>
				<option value="ALL">{props.labels.filterAllUsers}</option>
				{props.memberOptions.map((member) => (
					<option key={member.id} value={member.id}>
						{member.label}
					</option>
				))}
			</select>

			{props.canLoadMoreMembers && (
				<button
					type="button"
					onClick={props.onLoadMoreMembers}
					disabled={props.isLoadingMoreMembers}
					className="h-9 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
				>
					{props.isLoadingMoreMembers
						? props.labels.loadingUsers
						: props.labels.loadMoreUsers}
				</button>
			)}

			<input
				type="date"
				value={props.dateFrom}
				onChange={(e) => props.onDateFromChange(e.target.value)}
				aria-label={props.labels.dateFrom}
				className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
			/>

			<input
				type="date"
				value={props.dateTo}
				onChange={(e) => props.onDateToChange(e.target.value)}
				aria-label={props.labels.dateTo}
				className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
			/>

			<button
				type="button"
				onClick={props.onClear}
				className="h-9 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
			>
				{props.labels.clearFilters}
			</button>
		</div>
	);
}
