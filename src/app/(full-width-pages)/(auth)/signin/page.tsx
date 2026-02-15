import type { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
	title: "Sign In | QAnubis",
	description: "This is Sign In page for QAnubis",
};

export default function SignIn() {
	return <SignInForm />;
}
