"use client";

import { Component, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	message: string;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, message: "" };
	}

	static getDerivedStateFromError(error: unknown): State {
		const message =
			error instanceof Error ? error.message : "An unexpected error occurred";
		return { hasError: true, message };
	}

	override render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950">
						<p className="text-sm font-medium text-red-700 dark:text-red-400">
							Something went wrong
						</p>
						<p className="text-xs text-red-500 dark:text-red-500">
							{this.state.message}
						</p>
						<button
							type="button"
							onClick={() => this.setState({ hasError: false, message: "" })}
							className="mt-2 rounded-md px-3 py-1 text-xs font-medium text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
						>
							Try again
						</button>
					</div>
				)
			);
		}
		return this.props.children;
	}
}
