"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

const PRESET_COLORS = [
	"#6366f1",
	"#8b5cf6",
	"#ec4899",
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#14b8a6",
	"#3b82f6",
	"#64748b",
];

interface CreateProjectModalProps {
	onClose: () => void;
	onCreated: (projectId: string) => void;
}

export default function CreateProjectModal({
	onClose,
	onCreated,
}: CreateProjectModalProps) {
	const t = useTranslation();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState(PRESET_COLORS[0]);
	const [error, setError] = useState<string | null>(null);

	const utils = trpc.useUtils();
	const create = trpc.project.create.useMutation({
		onSuccess: (project) => {
			utils.project.list.invalidate();
			onCreated(project.id);
		},
		onError: (err) => setError(err.message),
	});

	function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!name.trim()) {
			setError(t.createProject.nameRequired);
			return;
		}
		setError(null);
		create.mutate({
			name: name.trim(),
			description: description.trim() || undefined,
			color,
		});
	}

	return (
		<div className="fixed inset-0 z-[100000] flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
				aria-hidden
			/>

			{/* Modal */}
			<div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
				<h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
					{t.createProject.title}
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Name */}
					<div>
						<label
							htmlFor="project-name"
							className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							{t.common.name} <span className="text-error-500">*</span>
						</label>
						<input
							id="project-name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder={t.createProject.namePlaceholder}
							maxLength={100}
							className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
						/>
					</div>

					{/* Description */}
					<div>
						<label
							htmlFor="project-desc"
							className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							{t.common.description}
						</label>
						<textarea
							id="project-desc"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder={t.createProject.descriptionPlaceholder}
							maxLength={500}
							rows={3}
							className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
						/>
					</div>

					{/* Color */}
					<div>
						<span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							{t.createProject.color}
						</span>
						<div className="flex flex-wrap gap-2">
							{PRESET_COLORS.map((c) => (
								<button
									key={c}
									type="button"
									title={c}
									onClick={() => setColor(c)}
									className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
										color === c
											? "scale-110 ring-2 ring-brand-500 ring-offset-2"
											: ""
									}`}
									style={{ backgroundColor: c }}
								/>
							))}
						</div>
					</div>

					{error && <p className="text-sm text-error-500">{error}</p>}

					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onClose}
							disabled={create.isPending}
						>
							{t.common.cancel}
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={create.isPending || !name.trim()}
						>
							{create.isPending
								? t.createProject.submitting
								: t.createProject.submit}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
