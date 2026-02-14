import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from '../api/auth/[...nextauth]/authOptions';

export default async function LoginPage() {
	const session = await getServerSession(authOptions);
	if (session) redirect("/");
	return (
		<div>
			<h1>Login</h1>
			<a href="/api/auth/signin">Entrar com Google</a>
		</div>
	);
}
