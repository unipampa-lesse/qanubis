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

interface VerifyEmailEmailProps {
	verifyUrl: string;
}

export function VerifyEmailEmail({ verifyUrl }: VerifyEmailEmailProps) {
	return (
		<Html lang="en">
			<Head />
			<Preview>Verify your QAnubis email address</Preview>
			<Body style={styles.body}>
				<Container style={styles.container}>
					<Section style={styles.header}>
						<Heading style={styles.logo}>QAnubis</Heading>
					</Section>

					<Section style={styles.content}>
						<Heading as="h2" style={styles.title}>
							Verify your email address
						</Heading>

						<Text style={styles.text}>
							Thanks for signing up for QAnubis! Please confirm your email
							address by clicking the button below.
						</Text>

						<Section style={styles.buttonContainer}>
							<Button href={verifyUrl} style={styles.button}>
								Verify email
							</Button>
						</Section>

						<Hr style={styles.divider} />

						<Text style={styles.footer}>
							This link expires in 24 hours. If you didn&apos;t create a
							QAnubis account, you can safely ignore this email.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

export function verifyEmailText({
	verifyUrl,
}: VerifyEmailEmailProps): string {
	return [
		"Thanks for signing up for QAnubis!",
		"",
		`Verify your email address: ${verifyUrl}`,
		"",
		"This link expires in 24 hours.",
		"If you didn't create a QAnubis account, you can safely ignore this email.",
	].join("\n");
}

export function verifyEmailSubject(): string {
	return "Verify your QAnubis email address";
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
