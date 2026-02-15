import { trpc } from "@/server/server";

export default async function Home() {
	const greeting = await trpc.hello({ text: "from tRPC" });
	const serverTime = await trpc.serverTime();
	return (
		<div>
			<h1>{greeting.greeting}</h1>
			<p>Server time: {serverTime.now.toISOString()}</p>
		</div>
	);
}
