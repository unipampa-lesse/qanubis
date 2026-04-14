# Arquitetura

Este documento descreve a arquitetura técnica do QAnubis: como as camadas estão organizadas, como os serviços externos são abstraídos e como a aplicação é implantada.

---

## Padrão de Providers

O QAnubis utiliza um **padrão Provider/Adapter** para todos os serviços externos. O código da aplicação nunca importa um SDK diretamente — ele depende apenas de uma interface TypeScript. Trocar de provider (ex: substituir MinIO por S3) requer apenas:

1. Implementar a interface para o novo provider
2. Alterar uma variável de ambiente

Nenhuma alteração em routers, componentes ou lógica de negócio.

### Providers e suas implementações

| Provider | Interface | Implementações | Selecionado via |
|----------|-----------|----------------|-----------------|
| Armazenamento | `IStorageProvider` | `S3Storage` | env `STORAGE_PROVIDER` |
| E-mail | `IEmailProvider` | `NodemailerEmail` | env `EMAIL_PROVIDER` (extensível) |
| Template de e-mail | `IEmailTemplateProvider` | `ReactEmailTemplate` | interno — não configurável |

### Provider de armazenamento

```ts
// src/providers/storage/interface.ts
interface IStorageProvider {
  upload(key: string, buffer: Buffer, contentType: string): Promise<void>
  getPresignedUrl(key: string, expiresInSeconds?: number): Promise<string>
  delete(key: string): Promise<void>
  exists(key: string): Promise<boolean>
}
```

**Implementação:**

| Classe | Valor de `STORAGE_PROVIDER` | Caso de uso |
|--------|------------------------------|-------------|
| `S3Storage` | `s3` (padrão) | AWS S3, Cloudflare R2 ou MinIO (todos usam a mesma API compatível com S3) |

Existe uma única implementação `S3Storage` que funciona para todos os serviços compatíveis com S3. Para desenvolvimento local, o MinIO é configurado com `STORAGE_PROVIDER=s3` e `STORAGE_ENDPOINT` apontando para o container MinIO local. Nenhuma classe `MinioStorage` separada é necessária.

**Factory:**
```ts
// src/providers/storage/index.ts
export function getStorageProvider(): IStorageProvider {
  // only "s3" supported — covers AWS S3, Cloudflare R2, and MinIO
  return new S3Storage()
}
```

### Provider de e-mail

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

**Implementações:**

| Classe | Valor de `EMAIL_PROVIDER` | Caso de uso |
|--------|---------------------------|-------------|
| `NodemailerEmail` | `nodemailer` (padrão) | Qualquer SMTP — MailHog (dev), Brevo, Gmail, auto-hospedado |

Adicionar um novo provider (ex: Resend) significa criar `src/providers/email/resend.ts` implementando `IEmailProvider` e adicionar um caso na factory. Nada mais muda.

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

### Estrutura de arquivos

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
        └── index.ts          ← implementação com React Email
```

---

## Camadas da aplicação

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
  ├── /api/trpc/[trpc]   ← handler tRPC HTTP
  └── /api/auth/[...]    ← handler NextAuth

tRPC Routers (src/server/routers/)
  │
  ├── Usa Prisma client   → PostgreSQL
  └── Usa providers/      → Armazenamento, E-mail
```

Toda a lógica de negócio vive nos procedimentos tRPC. Os routers são o único lugar que chama `getStorageProvider()` ou `getEmailProvider()`.

---

## Ambientes de implantação

### Produção — VPS com Docker

A implantação em produção recomendada. Controle total, sem restrições de fornecedor, sem timeouts de serverless.

```
VPS
├── Container Docker: app qanubis (Next.js standalone)
├── Container Docker: PostgreSQL
├── Container Docker: MinIO  ← ou troque para Cloudflare R2 via STORAGE_PROVIDER=s3
└── (opcional) Container Docker: Nginx reverse proxy
```

A aplicação é construída com `output: 'standalone'` no `next.config.ts`, gerando um servidor Node.js autocontido.

O pipeline de release publica uma imagem Docker no **GitHub Container Registry (GHCR)** — gratuito para repositórios públicos. Auto-hospedadores puxam a imagem diretamente:

```bash
docker pull ghcr.io/unipampa-lesse/qanubis:latest
```
### Produção — Vercel + serviços gerenciados

Opção serverless usando serviços gerenciados gratuitos — ideal para validação e MVPs sem infraestrutura para gerenciar.

```
Vercel (Next.js)
  ├── Neon.tech         ← PostgreSQL (gerenciado, free tier)
  ├── Cloudflare R2     ← Armazenamento de objetos (10 GB grátis)
  └── Resend            ← E-mail (3.000 e-mails/mês grátis)
```

O pipeline de release (`release.yml`) executa `prisma migrate deploy` no Neon e realiza o deploy na Vercel automaticamente a cada novo release.

**Secrets necessários no GitHub Actions:**

| Secret | Como obter |
|--------|------------|
| `DATABASE_URL` | Console do Neon → Connection string |
| `VERCEL_TOKEN` | vercel.com → Settings → Tokens |
| `VERCEL_ORG_ID` | Execute `vercel link` localmente → `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Mesmo arquivo acima |

**Variáveis de ambiente a configurar na Vercel** (Settings → Environment Variables do projeto):

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | String de conexão do Neon |
| `NEXTAUTH_SECRET` | Secret aleatório (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL do seu deploy na Vercel |
| `STORAGE_PROVIDER` | `s3` |
| `STORAGE_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com` |
| `STORAGE_REGION` | `auto` |
| `STORAGE_ACCESS_KEY` | Access Key ID do Cloudflare R2 |
| `STORAGE_SECRET_KEY` | Secret Access Key do Cloudflare R2 |
| `STORAGE_BUCKET` | Nome do seu bucket R2 |
| `EMAIL_PROVIDER` | `nodemailer` |
| `SMTP_HOST` | `smtp.resend.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `resend` |
| `SMTP_PASS` | API key do Resend |
| `SMTP_FROM` | `QAnubis <noreply@seudominio.com>` |
### Desenvolvimento local

`docker compose up -d` inicia todos os serviços necessários:

| Serviço | Porta | Finalidade |
|---------|-------|-----------|
| PostgreSQL | 5432 | Banco de dados |
| MinIO | 9000 / 9001 | Armazenamento de objetos + UI admin |
| MailHog | 1025 / 8025 | Captura SMTP + UI de e-mails |

Nenhuma conta externa necessária. Todos os serviços são locais.

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | ✅ | String de conexão PostgreSQL |
| `NEXTAUTH_SECRET` | ✅ | Segredo de assinatura do NextAuth |
| `NEXTAUTH_URL` | ✅ | URL pública base da aplicação |
| `GOOGLE_CLIENT_ID` | OAuth | OAuth Google — omitir para desabilitar login com Google |
| `GOOGLE_CLIENT_SECRET` | OAuth | OAuth Google |
| `GITHUB_CLIENT_ID` | OAuth | OAuth GitHub — omitir para desabilitar login com GitHub |
| `GITHUB_CLIENT_SECRET` | OAuth | OAuth GitHub |
| `STORAGE_PROVIDER` | ✅ | `s3` (padrão) — cobre AWS S3, Cloudflare R2 e MinIO |
| `STORAGE_ENDPOINT` | ✅ | URL do endpoint S3/R2/MinIO |
| `STORAGE_REGION` | | Região AWS (padrão: `us-east-1`; ignorado pelo MinIO/R2) |
| `STORAGE_ACCESS_KEY` | ✅ | Chave de acesso do armazenamento |
| `STORAGE_SECRET_KEY` | ✅ | Chave secreta do armazenamento |
| `STORAGE_BUCKET` | ✅ | Nome do bucket |
| `EMAIL_PROVIDER` | ✅ | `nodemailer` (padrão) |
| `SMTP_HOST` | E-mail | Host do servidor SMTP |
| `SMTP_PORT` | E-mail | Porta do servidor SMTP (padrão: `1025` para MailHog) |
| `SMTP_USER` | E-mail | Usuário SMTP (opcional para MailHog) |
| `SMTP_PASS` | E-mail | Senha SMTP (opcional para MailHog) |
| `SMTP_FROM` | E-mail | Endereço de envio (padrão: `QAnubis <noreply@qanubis.app>`) |
