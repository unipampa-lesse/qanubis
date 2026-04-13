import type { Metadata } from "next";
import InviteForm from "@/components/auth/InviteForm";

export const metadata: Metadata = {
	title: "Accept Invitation | QAnubis",
};

export default function InvitePage() {
	return <InviteForm />;
}
