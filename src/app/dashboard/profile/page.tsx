"use client";

import { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

export default function ProfilePage() {
	const t = useTranslation();
	const utils = trpc.useUtils();

	const { data: user, isLoading } = trpc.user.me.useQuery();

	// --- Profile name form ---
	const [name, setName] = useState("");
	const [profileMsg, setProfileMsg] = useState<{
		text: string;
		error: boolean;
	} | null>(null);

	// Sync initial name once loaded
	if (user && name === "" && user.name) {
		setName(user.name);
	}

	const updateProfile = trpc.user.updateProfile.useMutation({
		onSuccess: () => {
			utils.user.me.invalidate();
			setProfileMsg({ text: t.profile.profileSaved, error: false });
		},
		onError: (err) => setProfileMsg({ text: err.message, error: true }),
	});

	// --- Password form ---
	const [currentPw, setCurrentPw] = useState("");
	const [newPw, setNewPw] = useState("");
	const [pwMsg, setPwMsg] = useState<{ text: string; error: boolean } | null>(
		null,
	);

	const changePassword = trpc.user.changePassword.useMutation({
		onSuccess: () => {
			setCurrentPw("");
			setNewPw("");
			setPwMsg({ text: t.profile.passwordSaved, error: false });
		},
		onError: (err) => {
			const text =
				err.message === "wrong_password" ? t.profile.wrongPassword : err.message;
			setPwMsg({ text, error: true });
		},
	});

	const hasPassword = user && user.email; // OAuth-only accounts have no password row

	if (isLoading) {
		return (
			<div className="space-y-4 max-w-lg">
				<div className="h-8 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
				<div className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
			</div>
		);
	}

	return (
		<div className="max-w-lg space-y-8">
			<h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
				{t.profile.title}
			</h1>

			{/* Identity info */}
			<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-transparent">
				<p className="text-sm text-gray-500 dark:text-gray-400">
					{user?.email}
				</p>
			</div>

			{/* Display name */}
			<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-transparent">
				<h2 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
					{t.profile.displayName}
				</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						setProfileMsg(null);
						updateProfile.mutate({ name: name.trim() });
					}}
					className="space-y-4"
				>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder={t.profile.namePlaceholder}
						maxLength={100}
						required
						className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
					/>
					{profileMsg && (
						<p
							className={`text-sm ${profileMsg.error ? "text-error-500" : "text-success-600 dark:text-success-400"}`}
						>
							{profileMsg.text}
						</p>
					)}
					<button
						type="submit"
						disabled={updateProfile.isPending || !name.trim()}
						className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
					>
						{updateProfile.isPending
							? t.profile.savingProfile
							: t.profile.saveProfile}
					</button>
				</form>
			</div>

			{/* Password change */}
			<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-transparent">
				<h2 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
					{t.profile.changePassword}
				</h2>
				{!hasPassword ? (
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{t.profile.oauthAccount}
					</p>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							setPwMsg(null);
							changePassword.mutate({
								currentPassword: currentPw,
								newPassword: newPw,
							});
						}}
						className="space-y-4"
					>
						<input
							type="password"
							value={currentPw}
							onChange={(e) => setCurrentPw(e.target.value)}
							placeholder={t.profile.currentPassword}
							required
							className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
						/>
						<input
							type="password"
							value={newPw}
							onChange={(e) => setNewPw(e.target.value)}
							placeholder={t.profile.newPassword}
							minLength={8}
							required
							className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
						/>
						{pwMsg && (
							<p
								className={`text-sm ${pwMsg.error ? "text-error-500" : "text-success-600 dark:text-success-400"}`}
							>
								{pwMsg.text}
							</p>
						)}
						<button
							type="submit"
							disabled={
								changePassword.isPending || !currentPw || newPw.length < 8
							}
							className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
						>
							{changePassword.isPending
								? t.profile.savingPassword
								: t.profile.savePassword}
						</button>
					</form>
				)}
			</div>
		</div>
	);
}
