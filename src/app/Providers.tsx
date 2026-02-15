"use client";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TRPCProvider } from "@/server/client";
import { LanguageProvider } from '@/context/LanguageContext';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<TRPCProvider>
            <LanguageProvider>
                <ThemeProvider>
                    <SidebarProvider>
                        <SessionProvider>{children}</SessionProvider>
                    </SidebarProvider>
                </ThemeProvider>
            </LanguageProvider>
		</TRPCProvider>
	);
}
