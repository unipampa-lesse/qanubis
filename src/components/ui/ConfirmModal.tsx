"use client";

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmLabel: string;
	cancelLabel: string;
	isPending?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmModal({
	isOpen,
	title,
	message,
	confirmLabel,
	cancelLabel,
	isPending = false,
	onConfirm,
	onCancel,
}: ConfirmModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100000] flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onCancel}
				aria-hidden
			/>

			{/* Dialog */}
			<div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
				<h2 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
					{title}
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>

				<div className="mt-5 flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={isPending}
						className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isPending}
						className="rounded-lg bg-error-500 px-4 py-2 text-sm font-medium text-white hover:bg-error-600 disabled:opacity-50"
					>
						{isPending ? "…" : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
