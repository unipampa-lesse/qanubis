export default function ProjectLoading() {
	return (
		<div className="space-y-6">
			{/* Breadcrumb + title skeleton */}
			<div className="space-y-3">
				<div className="h-4 w-32 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
				<div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
			</div>

			{/* Tabs skeleton */}
			<div className="flex gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
				{["tab-1", "tab-2", "tab-3", "tab-4", "tab-5"].map((itemKey) => (
					<div
						key={itemKey}
						className="h-8 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800"
					/>
				))}
			</div>

			{/* Content skeleton */}
			<div className="space-y-3">
				{["row-1", "row-2", "row-3", "row-4"].map((itemKey) => (
					<div
						key={itemKey}
						className="h-16 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
					/>
				))}
			</div>
		</div>
	);
}
