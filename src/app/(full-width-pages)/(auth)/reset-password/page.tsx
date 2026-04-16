import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
	title: "Reset Password",
	description: "Reset your QAnubis account password.",
};

export default function ResetPasswordPage() {
	return <ResetPasswordForm />;
}
