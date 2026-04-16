import type React from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import { MermaidDiagram } from "./MermaidDiagram";

const components: Components = {
	h1: ({ children, ...props }) => (
		<h1
			{...props}
			className="mt-8 mb-4 text-3xl font-bold text-gray-900 dark:text-gray-50"
		>
			{children}
		</h1>
	),
	h2: ({ children, ...props }) => (
		<h2
			{...props}
			className="mt-8 mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-700 pb-2"
		>
			{children}
		</h2>
	),
	h3: ({ children, ...props }) => (
		<h3
			{...props}
			className="mt-6 mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100"
		>
			{children}
		</h3>
	),
	h4: ({ children, ...props }) => (
		<h4
			{...props}
			className="mt-4 mb-2 text-lg font-medium text-gray-800 dark:text-gray-100"
		>
			{children}
		</h4>
	),
	p: ({ children }) => (
		<p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">
			{children}
		</p>
	),
	ul: ({ children }) => (
		<ul className="mb-4 ml-6 list-disc space-y-1 text-gray-700 dark:text-gray-300">
			{children}
		</ul>
	),
	ol: ({ children }) => (
		<ol className="mb-4 ml-6 list-decimal space-y-1 text-gray-700 dark:text-gray-300">
			{children}
		</ol>
	),
	li: ({ children }) => <li className="leading-7">{children}</li>,
	a: ({ href, children }) => (
		<a
			href={href}
			target={href?.startsWith("http") ? "_blank" : undefined}
			rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
			className="text-blue-600 hover:underline dark:text-blue-400"
		>
			{children}
		</a>
	),
	blockquote: ({ children }) => (
		<blockquote className="my-4 border-l-4 border-blue-400 pl-4 italic text-gray-600 dark:text-gray-400">
			{children}
		</blockquote>
	),
	code: ({ className, children, ...props }) => {
		const isBlock = className?.startsWith("language-");
		if (isBlock) {
			return (
				<code className={className} {...props}>
					{children}
				</code>
			);
		}
		return (
			<code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-200">
				{children}
			</code>
		);
	},
	pre: ({ children }) => {
		const child = Array.isArray(children) ? children[0] : children;
		const el = child as React.ReactElement<{
			className?: string;
			children?: React.ReactNode;
		}>;
		if (el?.props?.className?.includes("language-mermaid")) {
			// extract raw text recursively in case rehype wrapped content in spans
			const extractText = (node: React.ReactNode): string => {
				if (typeof node === "string") return node;
				if (Array.isArray(node)) return node.map(extractText).join("");
				const n = node as React.ReactElement<{ children?: React.ReactNode }>;
				if (n?.props?.children) return extractText(n.props.children);
				return "";
			};
			return <MermaidDiagram chart={extractText(el.props.children).trim()} />;
		}
		return (
			<pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm">
				{children}
			</pre>
		);
	},
	table: ({ children }) => (
		<div className="my-4 overflow-x-auto">
			<table className="w-full border-collapse text-sm">{children}</table>
		</div>
	),
	thead: ({ children }) => (
		<thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
	),
	th: ({ children }) => (
		<th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
			{children}
		</th>
	),
	td: ({ children }) => (
		<td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
			{children}
		</td>
	),
	hr: () => <hr className="my-6 border-gray-200 dark:border-gray-700" />,
};

interface MarkdownContentProps {
	content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeSlug, [rehypeHighlight, { ignoreMissing: true }]]}
			components={components}
		>
			{content}
		</ReactMarkdown>
	);
}
