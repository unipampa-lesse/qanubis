import { redirect } from "next/navigation";
import { getAuthSession } from "@/server/get-server-session";

export default async function Home() {
	const session = await getAuthSession();
	if (session) {
		redirect("/dashboard");
	}
	redirect("/signin");
}
