"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

interface MermaidDiagramProps {
	chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { theme } = useTheme();

	useEffect(() => {
		if (!ref.current) return;

		let cancelled = false;
		const el = ref.current;

		el.removeAttribute("data-processed");
		el.textContent = chart;

		import("mermaid").then(({ default: mermaid }) => {
			if (cancelled) return;

			mermaid.initialize({
				startOnLoad: false,
				theme: theme === "dark" ? "dark" : "neutral",
				fontFamily: "inherit",
			});

			mermaid.run({ nodes: [el] }).catch((err) => {
				if (cancelled) return;
				el.textContent = "";
				el.innerHTML = `<pre class="text-red-500 text-xs p-2">${err.message}</pre>`;
			});
		});

		return () => {
			cancelled = true;
		};
	}, [chart, theme]);

	return (
		<div
			ref={ref}
			className="mermaid my-6 flex justify-center overflow-x-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50"
		/>
	);
}

