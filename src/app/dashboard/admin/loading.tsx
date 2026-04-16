export default function AdminLoading() {
	return (
		<div className="space-y-6">
			<div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
			<div className="space-y-3">
				{Array.from({ length: 3 }, (_, i) => (
					<div
						key={i}
						className="h-14 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
					/>
				))}
			</div>
		</div>
	);
}
