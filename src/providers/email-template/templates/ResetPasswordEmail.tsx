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

interface ResetPasswordEmailProps {
	resetUrl: string;
}

export function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
	return (
		<Html lang="en">
			<Head />
			<Preview>Reset your QAnubis password</Preview>
			<Body style={styles.body}>
				<Container style={styles.container}>
					<Section style={styles.header}>
						<Heading style={styles.logo}>QAnubis</Heading>
					</Section>

					<Section style={styles.content}>
						<Heading as="h2" style={styles.title}>
							Reset your password
						</Heading>

						<Text style={styles.text}>
							We received a request to reset the password for your QAnubis
							account. Click the button below to choose a new password.
						</Text>

						<Section style={styles.buttonContainer}>
							<Button href={resetUrl} style={styles.button}>
								Reset password
							</Button>
						</Section>

						<Hr style={styles.divider} />

						<Text style={styles.footer}>
							This link expires in 1 hour. If you did not request a password
							reset, you can safely ignore this email — your password will not
							change.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

export function resetPasswordText({ resetUrl }: ResetPasswordEmailProps): string {
	return [
		"We received a request to reset the password for your QAnubis account.",
		"",
		`Reset your password: ${resetUrl}`,
		"",
		"This link expires in 1 hour.",
		"If you did not request a password reset, you can safely ignore this email.",
	].join("\n");
}

export function resetPasswordSubject(): string {
	return "Reset your QAnubis password";
}

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
