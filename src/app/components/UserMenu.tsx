"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function UserMenu() {
	const { data: session, status } = useSession();

	if (status === "loading") return <span>Carregando...</span>;

	if (!session) {
		return <button onClick={() => signIn()}>Entrar</button>;
	}

	return (
		<div>
			<span>{session.user?.name || session.user?.email}</span>
			<button onClick={() => signOut()}>Sair</button>
		</div>
	);
}
