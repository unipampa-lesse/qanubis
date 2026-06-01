export default function DashboardLoading() {
	return (
		<div className="space-y-6">
			{/* Header skeleton */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<div className="h-7 w-40 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
					<div className="h-4 w-64 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
				</div>
				<div className="h-9 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
			</div>

			{/* Content skeleton */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{["card-1", "card-2", "card-3"].map((itemKey) => (
					<div
						key={itemKey}
						className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
					/>
				))}
			</div>
		</div>
	);
}
