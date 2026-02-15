import type { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
	title: "Sign Up | QAnubis",
	description: "This is Sign Up page for QAnubis",
};

export default function SignUp() {
	return <SignUpForm />;
}
