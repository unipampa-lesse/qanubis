import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import QuoteReferenceView from "./QuoteReferenceView";

export interface QuoteReferenceAttrs {
	quoteId: string | null;
	quoteText: string;
	documentId: string | null;
	documentName: string;
	projectId: string | null;
	page: number;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		quoteReference: {
			insertQuoteReference: (attrs: QuoteReferenceAttrs) => ReturnType;
		};
	}
}

export const QuoteReference = Node.create<object>({
	name: "quoteReference",
	group: "block",
	atom: true,
	draggable: true,

	addAttributes() {
		return {
			quoteId: { default: null },
			quoteText: { default: "" },
			documentId: { default: null },
			documentName: { default: "" },
			projectId: { default: null },
			page: { default: 1 },
		};
	},

	parseHTML() {
		return [{ tag: 'div[data-type="quote-reference"]' }];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, { "data-type": "quote-reference" }),
		];
	},

	addNodeView() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return ReactNodeViewRenderer(QuoteReferenceView as any);
	},

	addCommands() {
		return {
			insertQuoteReference: (attrs) => ({ commands }) => {
				return commands.insertContent({ type: "quoteReference", attrs });
			},
		};
	},
});
