"use client";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TRPCProvider } from "@/server/client";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<TRPCProvider>
			<ThemeProvider>
				<SidebarProvider>
					<SessionProvider>{children}</SessionProvider>
				</SidebarProvider>
			</ThemeProvider>
		</TRPCProvider>
	);
}
