import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
	title: "Reset Password | QAnubis",
	description: "This is Password Reset page for QAnubis",
};

export default function ResetPasswordPage() {
	return <ResetPasswordForm />;
}
