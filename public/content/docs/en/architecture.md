# Architecture

This document describes the technical architecture of QAnubis: how the layers are organized, how external services are abstracted, and how the application is deployed.

---

## Provider Pattern

QAnubis uses a **Provider/Adapter pattern** for all external services. Application code never imports an SDK directly — it depends only on a TypeScript interface. Swapping providers (e.g. replacing MinIO with S3) requires only:

1. Implementing the interface for the new provider
2. Changing an environment variable

No changes to routers, components, or business logic.

### Providers and their implementations

| Provider | Interface | Implementations | Selected via |
|----------|-----------|-----------------|-------------|
| Storage | `IStorageProvider` | `S3Storage` | `STORAGE_PROVIDER` env |
| Email | `IEmailProvider` | `NodemailerEmail` | `EMAIL_PROVIDER` env (extensible) |
| Email template | `IEmailTemplateProvider` | `ReactEmailTemplate` | internal — not configurable |

### Storage provider

```ts
// src/providers/storage/interface.ts
interface IStorageProvider {
  upload(key: string, buffer: Buffer, contentType: string): Promise<void>
  getPresignedUrl(key: string, expiresInSeconds?: number): Promise<string>
  delete(key: string): Promise<void>
  exists(key: string): Promise<boolean>
}
```

**Implementation:**

| Class | `STORAGE_PROVIDER` value | Use case |
|-------|--------------------------|----------|
| `S3Storage` | `s3` (default) | AWS S3, Cloudflare R2, or MinIO (all use the same S3-compatible API) |

There is a single `S3Storage` implementation that works for all S3-compatible services. For local development, MinIO is configured with `STORAGE_PROVIDER=s3` and `STORAGE_ENDPOINT` pointing to the local MinIO container. No separate `MinioStorage` class is needed.

**Factory:**
```ts
// src/providers/storage/index.ts
export function getStorageProvider(): IStorageProvider {
  // only "s3" supported — covers AWS S3, Cloudflare R2, and MinIO
  return new S3Storage()
}
```

### Email provider

```ts
// src/providers/email/interface.ts
interface IEmailProvider {
  send(options: {
    to: string | string[]
    subject: string
    html: string
    text?: string
  }): Promise<void>
}
```

**Implementations:**

| Class | `EMAIL_PROVIDER` value | Use case |
|-------|------------------------|----------|
| `NodemailerEmail` | `nodemailer` (default) | Any SMTP — MailHog (dev), Brevo, Gmail, self-hosted |

Adding a new provider (e.g. Resend) means creating `src/providers/email/resend.ts` implementing `IEmailProvider` and adding a case in the factory. Nothing else changes.

**Factory:**
```ts
// src/providers/email/index.ts
export function getEmailProvider(): IEmailProvider {
  switch (process.env.EMAIL_PROVIDER) {
    case 'nodemailer': return new NodemailerEmail()
    default:           return new NodemailerEmail()
  }
}
```

### File structure

```
src/
└── providers/
    ├── storage/
    │   ├── interface.ts      ← IStorageProvider
    │   ├── s3.ts             ← S3Storage (AWS S3, Cloudflare R2, MinIO)
    │   └── index.ts          ← factory
    ├── email/
    │   ├── interface.ts      ← IEmailProvider
    │   ├── nodemailer.ts     ← NodemailerEmail
    │   └── index.ts          ← factory
    └── email-template/
        ├── interface.ts      ← IEmailTemplateProvider
        └── index.ts          ← React Email implementation
```

---

## Application layers

```
Browser
  │
  ├── React components (Client Components)
  │     └── tRPC client (src/server/client.tsx)
  │
  └── React Server Components
        └── tRPC server caller (src/server/server.tsx)

Next.js App Router (src/app/)
  │
  ├── /api/trpc/[trpc]   ← tRPC HTTP handler
  └── /api/auth/[...]    ← NextAuth handler

tRPC Routers (src/server/routers/)
  │
  ├── Uses Prisma client   → PostgreSQL
  └── Uses providers/      → Storage, Email
```

All business logic lives in tRPC procedures. Routers are the only place that call `getStorageProvider()` or `getEmailProvider()`.

---

## Deployment targets

### Production — VPS with Docker

The recommended production deployment. Full control, no vendor constraints, no serverless timeouts.

```
VPS
├── Docker container: qanubis app (Next.js standalone)
├── Docker container: PostgreSQL
├── Docker container: MinIO  ← or swap to Cloudflare R2 via STORAGE_PROVIDER=s3
└── (optional) Docker container: Nginx reverse proxy
```

The app is built with `output: 'standalone'` in `next.config.ts`, producing a self-contained Node.js server.

The release pipeline publishes a Docker image to **GitHub Container Registry (GHCR)** — free for public repositories. Self-hosters pull the image directly:

```bash
docker pull ghcr.io/unipampa-lesse/qanubis:latest
```

### Local development

`docker compose up -d` starts all required services:

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Database |
| MinIO | 9000 / 9001 | Object storage + admin UI |
| MailHog | 1025 / 8025 | SMTP catcher + email UI |

No external accounts needed. All services are local.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | NextAuth signing secret |
| `NEXTAUTH_URL` | ✅ | Public base URL of the app |
| `GOOGLE_CLIENT_ID` | OAuth | Google OAuth — omit to disable Google login |
| `GOOGLE_CLIENT_SECRET` | OAuth | Google OAuth |
| `GITHUB_CLIENT_ID` | OAuth | GitHub OAuth — omit to disable GitHub login |
| `GITHUB_CLIENT_SECRET` | OAuth | GitHub OAuth |
| `STORAGE_PROVIDER` | ✅ | `s3` (default) — covers AWS S3, Cloudflare R2, and MinIO |
| `STORAGE_ENDPOINT` | ✅ | S3/R2/MinIO endpoint URL |
| `STORAGE_REGION` | | AWS region (default: `us-east-1`; ignored by MinIO/R2) |
| `STORAGE_ACCESS_KEY` | ✅ | Storage access key |
| `STORAGE_SECRET_KEY` | ✅ | Storage secret key |
| `STORAGE_BUCKET` | ✅ | Bucket name |
| `EMAIL_PROVIDER` | ✅ | `nodemailer` (default) |
| `SMTP_HOST` | Email | SMTP server host |
| `SMTP_PORT` | Email | SMTP server port (default: `1025` for MailHog) |
| `SMTP_USER` | Email | SMTP username (optional for MailHog) |
| `SMTP_PASS` | Email | SMTP password (optional for MailHog) |
| `SMTP_FROM` | Email | Sender address (default: `QAnubis <noreply@qanubis.app>`) |
