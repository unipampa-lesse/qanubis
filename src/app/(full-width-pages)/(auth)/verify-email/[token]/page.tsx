import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

export const metadata: Metadata = {
	title: "Verify Email",
	description: "Verify your email address to activate your QAnubis account.",
};

export default function VerifyEmailPage() {
	return (
		<Suspense>
			<VerifyEmailForm />
		</Suspense>
	);
}
