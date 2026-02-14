
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import Button from "@/components/ui/button/Button";

export default async function LoginPage() {
	const session = await getServerSession(authOptions);
	if (session) redirect("/");
	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-6">
			<h1 className="text-2xl font-bold">Login</h1>
			<form action="/api/auth/signin" method="get">
				<Button type="submit" variant="primary">
					Entrar com Google
				</Button>
			</form>
		</div>
	);
}
