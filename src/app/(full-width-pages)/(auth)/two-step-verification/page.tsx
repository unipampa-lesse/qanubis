import type { Metadata } from "next";
import OtpForm from "@/components/auth/OtpForm";

export const metadata: Metadata = {
	title: "Two Step Verification | QAnubis",
	description: "This is Two Step Verification page for QAnubis",
};

export default function OtpVerification() {
	return <OtpForm />;
}
