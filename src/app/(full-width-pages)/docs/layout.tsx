import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsHeader } from "@/components/docs/DocsHeader";

export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-950">
			<DocsHeader />
			<div className="mx-auto max-w-7xl px-6 flex gap-12 py-8">
				<DocsSidebar />
				<main className="flex-1 min-w-0 max-w-3xl">{children}</main>
			</div>
		</div>
	);
}
