
# QAnubis

QAnubis is a CAQDAS (Computer Assisted Qualitative Data Analysis Software) designed to facilitate qualitative data analysis through a user-friendly web interface. It allows researchers to code, categorize, and analyze qualitative data efficiently.

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/unipampa-lesse/qanubis/LICENSE)

## Documentation

[Documentation](https://github.com/unipampa-lesse/qanubis/blob/main/public/content/docs/en/home.md)

## Run Locally

**Prerequisites:** Node.js ≥ 24, pnpm, Docker with Compose plugin.

```bash
# 1. Clone and enter the project
git clone https://github.com/unipampa-lesse/qanubis.git
cd qanubis

# 2. Copy environment variables (defaults work for local dev)
cp .env.example .env

# 3. Start local services (PostgreSQL, MinIO, MailHog)
docker compose up -d

# 4. Install dependencies
pnpm install

# 5. Prisma generates the client based on the schema
pnpm prisma:generate

# 5. Run database migrations and seed sample data
pnpm setup

# 6. Start the dev server
pnpm dev
```

Open **http://localhost:3000** and sign in with `researcher@qanubis.local` / `user123`.

For the full setup guide including service URLs and seed accounts, see [Contribution Guidelines](https://github.com/unipampa-lesse/qanubis/wiki/Contribution_Guidelines#run-locally).

## Authors

- [@guilhermebolfe11](https://www.github.com/guilhermebolfe11)
