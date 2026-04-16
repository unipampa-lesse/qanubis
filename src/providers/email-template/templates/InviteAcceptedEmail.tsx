import {
	Body,
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

interface InviteAcceptedEmailProps {
	memberName: string;
	projectName: string;
	role: string;
}

const ROLE_LABEL: Record<string, string> = {
	OWNER: "Owner",
	COLLABORATOR: "Collaborator",
	VIEWER: "Viewer",
};

export function InviteAcceptedEmail({
	memberName,
	projectName,
	role,
}: InviteAcceptedEmailProps) {
	const roleLabel = ROLE_LABEL[role] ?? role;

	return (
		<Html lang="en">
			<Head />
			<Preview>
				{memberName} joined &quot;{projectName}&quot; on QAnubis
			</Preview>
			<Body style={styles.body}>
				<Container style={styles.container}>
					<Section style={styles.header}>
						<Heading style={styles.logo}>QAnubis</Heading>
					</Section>

					<Section style={styles.content}>
						<Heading as="h2" style={styles.title}>
							New member joined your project
						</Heading>

						<Text style={styles.text}>
							<strong>{memberName}</strong> has accepted your invitation and
							joined <strong>&quot;{projectName}&quot;</strong> as a{" "}
							<strong>{roleLabel}</strong>.
						</Text>

						<Hr style={styles.divider} />

						<Text style={styles.footer}>
							You received this email because you are the owner of &quot;
							{projectName}&quot; on QAnubis.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

export function inviteAcceptedText({
	memberName,
	projectName,
	role,
}: InviteAcceptedEmailProps): string {
	const roleLabel = ROLE_LABEL[role] ?? role;
	return [
		`${memberName} has accepted your invitation and joined "${projectName}" as ${roleLabel}.`,
		"",
		`You received this email because you are the owner of "${projectName}" on QAnubis.`,
	].join("\n");
}

export function inviteAcceptedSubject(
	memberName: string,
	projectName: string,
): string {
	return `${memberName} joined "${projectName}" on QAnubis`;
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
