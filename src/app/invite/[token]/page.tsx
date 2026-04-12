"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

export default function InvitePage() {
	const { token } = useParams<{ token: string }>();
	const router = useRouter();
	const { status } = useSession();
	const t = useTranslation();

	const accept = trpc.member.acceptInvite.useMutation({
		onSuccess: ({ projectId }) => {
			router.replace(`/dashboard/projects/${projectId}`);
		},
	});

	// Auto-accept once the session is authenticated
	useEffect(() => {
		if (status === "authenticated" && !accept.isPending && !accept.isSuccess) {
			accept.mutate({ token });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	if (status === "loading" || accept.isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-sm text-gray-500">{t.invite.accepting}</p>
			</div>
		);
	}

	if (status === "unauthenticated") {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<p className="text-base text-gray-700 dark:text-gray-300">
					{t.invite.signInPrompt}
				</p>
				<Button
					onClick={() =>
						router.push(
							`/signin?callbackUrl=${encodeURIComponent(`/invite/${token}`)}`,
						)
					}
				>
					{t.invite.signIn}
				</Button>
			</div>
		);
	}

	if (accept.isError) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<p className="text-sm text-error-500">{accept.error.message}</p>
				<Button variant="outline" onClick={() => router.push("/dashboard")}>
					{t.invite.goToDashboard}
				</Button>
			</div>
		);
	}

	return null;
}
