# Contribution Guidelines
Thank you for considering contributing to QAnubis! To ensure a smooth and efficient collaboration, please follow these guidelines when submitting contributions.

## How to Contribute
1. **Clone the Repository**: Start by cloning the QAnubis repository to your local machine.
    ```bash
    git clone https://github.com/unipampa-lesse/qanubis.git
    ```
2. **Create a Branch**: Create a new branch for your contribution.
    ```bash
    git checkout -b feat/{issue-number}
    ```
3. **Make Changes**: Implement your changes, whether they are bug fixes, new features, or documentation improvements.
4. **Commit Changes**: Commit your changes with a clear and descriptive message. Using conventional commit messages is encouraged.
    ```bash
    git commit -m "feat: Add feature description"
    ```
5. **Push Changes**: Push your changes to your forked repository.
    ```bash
    git push origin feat/{issue-number}
    ``` 
6. **Create a Pull Request**: Open a pull request against the `main` branch of the QAnubis repository. Provide a detailed description of your changes and reference any related issues.

## Branches 
- Use feature branches named `feat/{issue-number}` for new features.
- Use bugfix branches named `fix/{issue-number}` for bug fixes.

## Commit Messages
- Use clear and concise commit messages.
- Follow the conventional commit format: `type: description` (e.g., `feat: Add user login feature`).
- Conventional types include `feat`, `fix`, `docs`, `style`, `refactor`, `test`, and `chore`.

## Review Process
All contributions will be reviewed by the maintainers. You may be asked to make changes or provide additional information. Please be patient and responsive during this process.

## License
By contributing to QAnubis, you agree that your contributions will be licensed under the same license as the project (MIT License).
Thank you for helping to improve QAnubis!

## Run Locally

To run QAnubis locally for development or testing purposes, follow these steps.

### Prerequisites

- **Node.js ≥ 24** — [nodejs.org](https://nodejs.org/)
- **pnpm** — `npm install -g pnpm`
- **Docker** with Compose plugin — [docker.com/get-started](https://www.docker.com/get-started)

### Steps

1. **Clone the repository**
    ```bash
    git clone https://github.com/unipampa-lesse/qanubis.git
    cd qanubis
    ```

2. **Copy the environment file**
    ```bash
    cp .env.example .env
    ```
    All defaults in `.env.example` work out of the box with Docker Compose — no changes needed for local development.

3. **Start local services** (PostgreSQL, MinIO, MailHog)
    ```bash
    docker compose up -d
    ```
    | Service | URL |
    |---------|-----|
    | App (after step 6) | http://localhost:3000 |
    | MinIO console (object storage) | http://localhost:9001 |
    | MailHog (email catcher) | http://localhost:8025 |

    > **Local email:** All emails (verification, password reset, invites) are intercepted by MailHog and never reach a real inbox. Open **http://localhost:8025** to read them. This is how you get the verification link after signing up locally.

    > **MinIO console:** Open **http://localhost:9001** and sign in with `minioadmin` / `minioadmin`. From here you can browse uploaded files, inspect bucket contents, and delete objects directly — useful when testing document upload/delete flows.

4. **Install dependencies**
    ```bash
    pnpm install
    ```

5. **Set up the database**
    Generate the Prisma client, apply migrations, and seed dev data in one step:
    ```bash
    pnpm prisma:generate
    pnpm setup
    ```
    > On the very first migration run you'll be prompted for a name — type `initial` and press Enter.

    This creates the following seed accounts:

    | Email | Password | Role | Notes |
    |-------|----------|------|-------|
    | admin@qanubis.local | admin123 | Admin | Full admin panel access |
    | owner@qanubis.local | user123 | User | Owner of *Remote Work Study* |
    | collaborator@qanubis.local | user123 | User | Collaborator on *Remote Work Study*, Owner of *Interview Archive* |
    | viewer@qanubis.local | user123 | User | Viewer on *Remote Work Study* |
    | researcher@qanubis.local | user123 | User | Legacy compatibility account |

    The seed also creates two sample projects, codes with a two-level hierarchy, memos, and support tickets so you can explore every feature immediately after setup.

    > **Prisma Studio:** Run `pnpm prisma:studio` at any time to open a visual database browser at **http://localhost:5555**. Useful for inspecting records, editing data manually, and verifying that operations are persisting correctly.

6. **Start the development server**
    ```bash
    pnpm dev
    ```

7. Open **http://localhost:3000** and sign in with one of the seed accounts above.
