import type { Metadata } from "next";
import ConfirmResetForm from "@/components/auth/ConfirmResetForm";

export const metadata: Metadata = {
	title: "Set New Password",
	description: "Choose a new password for your QAnubis account.",
};

export default function ConfirmResetPage() {
	return <ConfirmResetForm />;
}
