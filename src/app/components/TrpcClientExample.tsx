"use client";

import { trpc } from "@/server/client";

export default function TrpcClientExample() {
	const helloQuery = trpc.hello.useQuery({ text: "from client" });
	const timeQuery = trpc.serverTime.useQuery();

	if (helloQuery.isLoading || timeQuery.isLoading) {
		return <p>Loading tRPC client data...</p>;
	}

	if (helloQuery.error || timeQuery.error) {
		return <p>Failed to load tRPC client data.</p>;
	}

	return (
		<section>
			<h2>{helloQuery.data?.greeting}</h2>
			<p>Client time: {timeQuery.data?.now.toLocaleString()}</p>
		</section>
	);
}
