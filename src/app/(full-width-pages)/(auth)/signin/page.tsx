import type { Metadata } from "next";
import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
	title: "Sign In",
	description:
		"Sign in to QAnubis to manage your qualitative research projects and collaborate with your team.",
};

export default function SignIn() {
	return (
		<Suspense>
			<SignInForm />
		</Suspense>
	);
}
