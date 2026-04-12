"use client";
import Link from "next/link";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useTranslation } from "@/context/LanguageContext";
import useGoBack from "@/hooks/useGoBack";

export default function ResetPasswordForm() {
	const t = useTranslation();
	const goBack = useGoBack();
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		// Password reset email delivery will be wired in a future phase.
		// For now we simulate a successful request so the UI is functional.
		await new Promise((r) => setTimeout(r, 800));
		setSent(true);
		setIsLoading(false);
	}

	return (
		<div className="flex flex-col flex-1 lg:w-1/2 w-full">
			<div className="w-full max-w-md pt-10 mx-auto">
				<button
					type="button"
					onClick={goBack}
					className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<FaChevronLeft />
					{t.auth.back}
				</button>
			</div>
			<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
				<div className="mb-5 sm:mb-8">
					<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
						{t.auth.resetPassword}
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{t.auth.resetPasswordSubtitle}
					</p>
				</div>
				<div>
					{sent ? (
						<p className="text-sm text-success-500">{t.auth.resetLinkSent}</p>
					) : (
						<form onSubmit={handleSubmit}>
							<div className="space-y-5">
								<div>
									<Label>
										{t.auth.email}
										<span className="text-error-500">*</span>
									</Label>
									<Input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder={t.auth.emailPlaceholder}
										disabled={isLoading}
										required
									/>
								</div>
								<div>
									<Button
										type="submit"
										className="w-full"
										size="sm"
										disabled={isLoading}
									>
										{isLoading ? t.auth.sendingResetLink : t.auth.sendResetLink}
									</Button>
								</div>
							</div>
						</form>
					)}
					<div className="mt-5">
						<p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
							{t.auth.rememberPassword}{" "}
							<Link
								href="/signin"
								className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
							>
								{t.auth.clickHere}
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
