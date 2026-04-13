"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

export default function ConfirmResetForm() {
	const { token } = useParams<{ token: string }>();
	const router = useRouter();
	const t = useTranslation();

	const [newPassword, setNewPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [matchError, setMatchError] = useState(false);
	const [done, setDone] = useState(false);

	const confirm_ = trpc.user.confirmPasswordReset.useMutation({
		onSuccess: () => setDone(true),
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setMatchError(false);
		if (newPassword !== confirm) {
			setMatchError(true);
			return;
		}
		confirm_.mutate({ token, newPassword });
	}

	return (
		<div className="flex flex-col flex-1 lg:w-1/2 w-full">
			<div className="w-full max-w-md pt-10 mx-auto">
				<Link
					href="/auth/reset-password"
					className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<FaChevronLeft />
					{t.auth.back}
				</Link>
			</div>

			<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
				<div className="mb-5 sm:mb-8">
					<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
						{t.auth.resetPassword}
					</h1>
				</div>

				<div>
					{done ? (
						<div className="space-y-4">
							<p className="text-sm text-success-500">
								{t.auth.passwordResetSuccess}
							</p>
							<Button
								size="sm"
								className="w-full"
								onClick={() => router.push("/signin")}
							>
								{t.auth.signIn}
							</Button>
						</div>
					) : confirm_.error?.message === "invalid_or_expired" ? (
						<div className="space-y-4">
							<p className="text-sm text-error-500">
								{t.auth.resetTokenInvalid}
							</p>
							<Link
								href="/auth/reset-password"
								className="block text-center text-sm text-brand-500 hover:text-brand-600"
							>
								{t.auth.sendResetLink}
							</Link>
						</div>
					) : (
						<form onSubmit={handleSubmit}>
							<div className="space-y-5">
								<div>
									<Label>
										{t.auth.newPasswordLabel}
										<span className="text-error-500">*</span>
									</Label>
									<Input
										type="password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										placeholder={t.auth.newPasswordLabel}
										minLength={8}
										required
										disabled={confirm_.isPending}
									/>
								</div>
								<div>
									<Label>
										{t.auth.confirmNewPassword}
										<span className="text-error-500">*</span>
									</Label>
									<Input
										type="password"
										value={confirm}
										onChange={(e) => setConfirm(e.target.value)}
										placeholder={t.auth.confirmNewPassword}
										minLength={8}
										required
										disabled={confirm_.isPending}
									/>
								</div>
								{matchError && (
									<p className="text-sm text-error-500">
										{t.auth.passwordsDoNotMatch}
									</p>
								)}
								{confirm_.isError &&
									confirm_.error.message !== "invalid_or_expired" && (
										<p className="text-sm text-error-500">
											{t.auth.resetRequestError}
										</p>
									)}
								<Button
									type="submit"
									className="w-full"
									size="sm"
									disabled={confirm_.isPending}
								>
									{confirm_.isPending
										? t.auth.settingPassword
										: t.auth.setNewPassword}
								</Button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
