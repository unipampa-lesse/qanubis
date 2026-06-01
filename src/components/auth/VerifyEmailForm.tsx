"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

export default function VerifyEmailForm() {
	const { token } = useParams<{ token: string }>();
	const router = useRouter();
	const t = useTranslation();

	const verify = trpc.user.verifyEmail.useMutation();

	// Automatically verify on mount.
	useEffect(() => {
		if (token) {
			verify.mutate({ token });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	return (
		<div className="flex flex-col flex-1 lg:w-1/2 w-full">
			<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
				<div className="mb-5 sm:mb-8">
					<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
						{t.auth.verifyEmailTitle}
					</h1>
				</div>

				<div>
					{verify.isPending && (
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{t.auth.verifyingEmail}
						</p>
					)}

					{verify.isSuccess && (
						<div className="space-y-4">
							<p className="text-sm text-success-500">{t.auth.emailVerified}</p>
							<Button
								size="sm"
								className="w-full"
								onClick={() => router.push("/signin")}
							>
								{t.auth.signIn}
							</Button>
						</div>
					)}

					{verify.isError && (
						<div className="space-y-4">
							<p className="text-sm text-error-500">
								{verify.error.message === "invalid_or_expired"
									? t.auth.verifyTokenInvalid
									: t.auth.verifyEmailError}
							</p>
							<Link
								href="/signin"
								className="block text-center text-sm text-brand-500 hover:text-brand-600"
							>
								{t.auth.signIn}
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
