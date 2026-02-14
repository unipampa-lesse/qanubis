import { redirect } from "next/navigation";

export default function LogoutPage() {
	redirect("/api/auth/signout");
	return null;
}
