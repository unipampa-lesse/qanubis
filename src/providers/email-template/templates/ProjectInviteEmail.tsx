import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";

const BRAND = "#6366f1";

interface ProjectInviteEmailProps {
	inviterName: string;
	projectName: string;
	role: string;
	acceptUrl: string;
}

const ROLE_LABEL: Record<string, string> = {
	OWNER: "Owner",
	COLLABORATOR: "Collaborator",
	VIEWER: "Viewer",
};

export function ProjectInviteEmail({
	inviterName,
	projectName,
	role,
	acceptUrl,
}: ProjectInviteEmailProps) {
	const roleLabel = ROLE_LABEL[role] ?? role;

	return (
		<Html lang="en">
			<Head />
			<Preview>
				{inviterName} invited you to &quot;{projectName}&quot; on QAnubis
			</Preview>
			<Body style={styles.body}>
				<Container style={styles.container}>
					{/* Header */}
					<Section style={styles.header}>
						<Heading style={styles.logo}>QAnubis</Heading>
					</Section>

					{/* Content */}
					<Section style={styles.content}>
						<Heading as="h2" style={styles.title}>
							You&apos;ve been invited to a project
						</Heading>

						<Text style={styles.text}>
							<strong>{inviterName}</strong> has invited you to join{" "}
							<strong>&quot;{projectName}&quot;</strong> as a{" "}
							<strong>{roleLabel}</strong>.
						</Text>

						<Section style={styles.buttonContainer}>
							<Button href={acceptUrl} style={styles.button}>
								Accept invitation
							</Button>
						</Section>

						<Hr style={styles.divider} />

						<Text style={styles.footer}>
							This invitation link expires in 48 hours. If you didn&apos;t
							expect this email, you can safely ignore it.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

/** Plain-text fallback — generated separately, not from the React tree. */
export function projectInviteText({
	inviterName,
	projectName,
	role,
	acceptUrl,
}: ProjectInviteEmailProps): string {
	const roleLabel = ROLE_LABEL[role] ?? role;
	return [
		`${inviterName} invited you to join "${projectName}" on QAnubis as ${roleLabel}.`,
		"",
		`Accept the invitation: ${acceptUrl}`,
		"",
		"This link expires in 48 hours.",
	].join("\n");
}

/** Subject line — kept here so template + subject live together. */
export function projectInviteSubject(inviterName: string, projectName: string) {
	return `${inviterName} invited you to "${projectName}" on QAnubis`;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
	body: {
		backgroundColor: "#f4f4f5",
		fontFamily:
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
		margin: 0,
		padding: "40px 0",
	},
	container: {
		backgroundColor: "#ffffff",
		borderRadius: "8px",
		margin: "0 auto",
		maxWidth: "560px",
		overflow: "hidden" as const,
	},
	header: {
		backgroundColor: BRAND,
		padding: "24px 32px",
	},
	logo: {
		color: "#ffffff",
		fontSize: "22px",
		fontWeight: "700",
		letterSpacing: "-0.5px",
		margin: 0,
	},
	content: {
		padding: "32px",
	},
	title: {
		color: "#111827",
		fontSize: "18px",
		fontWeight: "600",
		margin: "0 0 16px",
	},
	text: {
		color: "#6b7280",
		fontSize: "14px",
		lineHeight: "1.6",
		margin: "0 0 24px",
	},
	buttonContainer: {
		margin: "0 0 24px",
	},
	button: {
		backgroundColor: BRAND,
		borderRadius: "6px",
		color: "#ffffff",
		display: "inline-block",
		fontSize: "14px",
		fontWeight: "600",
		padding: "12px 24px",
		textDecoration: "none",
	},
	divider: {
		borderColor: "#e5e7eb",
		margin: "0 0 16px",
	},
	footer: {
		color: "#9ca3af",
		fontSize: "12px",
		margin: 0,
	},
} as const;
