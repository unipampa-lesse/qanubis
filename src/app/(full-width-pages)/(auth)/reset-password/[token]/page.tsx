import type { Metadata } from "next";
import ConfirmResetForm from "@/components/auth/ConfirmResetForm";

export const metadata: Metadata = {
	title: "Set New Password | QAnubis",
};

export default function ConfirmResetPage() {
	return <ConfirmResetForm />;
}
