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
				{Array.from({ length: 5 }, (_, i) => (
					<div
						key={i}
						className="h-8 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800"
					/>
				))}
			</div>

			{/* Content skeleton */}
			<div className="space-y-3">
				{Array.from({ length: 4 }, (_, i) => (
					<div
						key={i}
						className="h-16 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
					/>
				))}
			</div>
		</div>
	);
}
