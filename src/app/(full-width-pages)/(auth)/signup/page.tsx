import type { Metadata } from "next";
import { Suspense } from "react";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
	title: "Sign Up",
	description:
		"Create a free QAnubis account to start analyzing qualitative research data with your team.",
};

export default function SignUp() {
	return (
		<Suspense>
			<SignUpForm />
		</Suspense>
	);
}
