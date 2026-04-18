"use client";

import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { QuoteReference } from "@/lib/tiptap/quote-reference";
import QuotePicker from "./QuotePicker";

interface MemoEditorProps {
	content: Record<string, unknown>;
	editable: boolean;
	placeholder: string;
	onChange: (content: Record<string, unknown>) => void;
	projectId?: string;
}

export default function MemoEditor({
	content,
	editable,
	placeholder,
	onChange,
	projectId,
}: MemoEditorProps) {
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;
	const [showPicker, setShowPicker] = useState(false);

	const handleUpdate = useCallback(({ editor }: { editor: Editor }) => {
		onChangeRef.current(editor.getJSON() as Record<string, unknown>);
	}, []);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [StarterKit, QuoteReference],
		content: Object.keys(content).length > 0 ? content : undefined,
		editable,
		onUpdate: handleUpdate,
		editorProps: {
			attributes: {
				class: "focus:outline-none memo-editor p-4",
			},
		},
	});

	// Sync content from outside only when the memo changes identity (not on every keystroke)
	useEffect(() => {
		if (!editor) return;
		const incoming = Object.keys(content).length > 0 ? content : null;
		const current = editor.getJSON();
		if (JSON.stringify(incoming) !== JSON.stringify(current)) {
			editor.commands.setContent(incoming ?? "");
		}
	}, [editor, content]);

	// Sync editable flag
	useEffect(() => {
		if (!editor) return;
		editor.setEditable(editable);
	}, [editor, editable]);

	if (!editor) return null;

	return (
		<>
			<div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
				{editable && (
					<div className="flex flex-wrap gap-0.5 border-b border-gray-200 p-2 dark:border-gray-800">
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleBold().run()}
							active={editor.isActive("bold")}
							title="Bold"
						>
							<strong>B</strong>
						</ToolbarButton>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleItalic().run()}
							active={editor.isActive("italic")}
							title="Italic"
						>
							<em>I</em>
						</ToolbarButton>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleStrike().run()}
							active={editor.isActive("strike")}
							title="Strikethrough"
						>
							<s>S</s>
						</ToolbarButton>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleCode().run()}
							active={editor.isActive("code")}
							title="Inline code"
						>
							{"</>"}
						</ToolbarButton>
						<div className="mx-1 w-px self-stretch bg-gray-200 dark:bg-gray-700" />
						<ToolbarButton
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 2 }).run()
							}
							active={editor.isActive("heading", { level: 2 })}
							title="Heading 2"
						>
							H2
						</ToolbarButton>
						<ToolbarButton
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 3 }).run()
							}
							active={editor.isActive("heading", { level: 3 })}
							title="Heading 3"
						>
							H3
						</ToolbarButton>
						<div className="mx-1 w-px self-stretch bg-gray-200 dark:bg-gray-700" />
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							active={editor.isActive("bulletList")}
							title="Bullet list"
						>
							•—
						</ToolbarButton>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							active={editor.isActive("orderedList")}
							title="Numbered list"
						>
							1.
						</ToolbarButton>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleBlockquote().run()}
							active={editor.isActive("blockquote")}
							title="Blockquote"
						>
							❝
						</ToolbarButton>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleCodeBlock().run()}
							active={editor.isActive("codeBlock")}
							title="Code block"
						>
							{"{ }"}
						</ToolbarButton>
						<div className="mx-1 w-px self-stretch bg-gray-200 dark:bg-gray-700" />
						<ToolbarButton
							onClick={() => editor.chain().focus().undo().run()}
							disabled={!editor.can().undo()}
							title="Undo"
						>
							↩
						</ToolbarButton>
						<ToolbarButton
							onClick={() => editor.chain().focus().redo().run()}
							disabled={!editor.can().redo()}
							title="Redo"
						>
							↪
						</ToolbarButton>
						{projectId && (
							<>
								<div className="mx-1 w-px self-stretch bg-gray-200 dark:bg-gray-700" />
								<ToolbarButton
									onClick={() => setShowPicker(true)}
									title="Insert quote reference"
								>
									<HiOutlineChatBubbleLeftRight className="h-3.5 w-3.5" />
								</ToolbarButton>
							</>
						)}
					</div>
				)}
				{/* Placeholder when empty and editable */}
				<div className="relative">
					{editable && editor.isEmpty && (
						<p className="pointer-events-none absolute left-4 top-4 text-sm text-gray-400">
							{placeholder}
						</p>
					)}
					<EditorContent editor={editor} />
				</div>
			</div>

			{showPicker && projectId && (
				<QuotePicker
					projectId={projectId}
					onClose={() => setShowPicker(false)}
					onSelect={(qt) => {
						editor
							.chain()
							.focus()
							.insertQuoteReference({
								quoteId: qt.id,
								quoteText: qt.text,
								documentId: qt.document.id,
								documentName: qt.document.name,
								projectId,
								page: qt.page,
							})
							.run();
					}}
				/>
			)}
		</>
	);
}

function ToolbarButton({
	onClick,
	active = false,
	disabled = false,
	title,
	children,
}: {
	onClick: () => void;
	active?: boolean;
	disabled?: boolean;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			title={title}
			className={`rounded px-2 py-1 text-xs font-medium transition-colors disabled:opacity-30 ${
				active
					? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
					: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
			}`}
		>
			{children}
		</button>
	);
}
