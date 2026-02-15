import Link from "next/link";
import type React from "react";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import LanguageSelect from '@/components/common/LanguageSelect';
import { LanguageProvider } from '@/context/LanguageContext';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
			<ThemeProvider>
                <LanguageProvider>
                    <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
                        {children}
                        <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
                            <div className="relative items-center justify-center  flex z-1">
                                <div className="flex flex-col items-center max-w-xs">
                                    <Link href="/" className="block mb-4"></Link>
                                    <p className="text-center text-gray-400 dark:text-white/60">
                                        Free and Open-Source QAnubis
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                            <ThemeTogglerTwo />
                            <LanguageSelect/>
                        </div>
                    </div>
                </LanguageProvider>
			</ThemeProvider>
		</div>
	);
}
