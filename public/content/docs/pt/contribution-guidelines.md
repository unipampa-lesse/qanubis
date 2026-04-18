# Guia de Contribuição

Obrigado por considerar contribuir com o QAnubis! Para garantir uma colaboração fluida e eficiente, siga estas diretrizes ao enviar contribuições.

## Como Contribuir

1. **Clone o Repositório**: Clone o repositório do QAnubis na sua máquina local.
    ```bash
    git clone https://github.com/unipampa-lesse/qanubis.git
    ```
2. **Crie uma Branch**: Crie uma nova branch para sua contribuição.
    ```bash
    git checkout -b feat/{numero-da-issue}
    ```
3. **Implemente as Alterações**: Faça suas mudanças, sejam correções de bugs, novas funcionalidades ou melhorias na documentação.
4. **Faça o Commit**: Commit suas alterações com uma mensagem clara e descritiva. O uso de conventional commits é encorajado.
    ```bash
    git commit -m "feat: Descrição da funcionalidade"
    ```
5. **Envie para o Repositório**: Envie suas alterações para o repositório forkado.
    ```bash
    git push origin feat/{numero-da-issue}
    ```
6. **Abra um Pull Request**: Abra um pull request contra a branch `main` do repositório QAnubis. Inclua uma descrição detalhada das suas mudanças e referencie as issues relacionadas.

## Branches

- Use branches de funcionalidade com o nome `feat/{numero-da-issue}` para novas features.
- Use branches de correção com o nome `fix/{numero-da-issue}` para correções de bugs.

## Mensagens de Commit

- Use mensagens de commit claras e concisas.
- Siga o formato conventional commits: `tipo: descrição` (ex: `feat: Adicionar login de usuário`).
- Os tipos convencionais incluem `feat`, `fix`, `docs`, `style`, `refactor`, `test` e `chore`.

## Processo de Revisão

Todas as contribuições serão revisadas pelos mantenedores. Você pode ser solicitado a fazer alterações ou fornecer informações adicionais. Tenha paciência e seja responsivo durante esse processo.

## Licença

Ao contribuir com o QAnubis, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT License).

Obrigado por ajudar a melhorar o QAnubis!

## Executar Localmente

Para rodar o QAnubis localmente para desenvolvimento ou testes, siga os passos abaixo.

### Pré-requisitos

- **Node.js ≥ 24** — [nodejs.org](https://nodejs.org/)
- **pnpm** — `npm install -g pnpm`
- **Docker** com o plugin Compose — [docker.com/get-started](https://www.docker.com/get-started)

### Passos

1. **Clone o repositório**
    ```bash
    git clone https://github.com/unipampa-lesse/qanubis.git
    cd qanubis
    ```

2. **Copie o arquivo de variáveis de ambiente**
    ```bash
    cp .env.example .env
    ```
    Todos os valores padrão no `.env.example` funcionam com o Docker Compose — nenhuma alteração é necessária para desenvolvimento local.

3. **Inicie os serviços locais** (PostgreSQL, MinIO, MailHog)
    ```bash
    docker compose up -d
    ```
    | Serviço | URL |
    |---------|-----|
    | App (após o passo 6) | http://localhost:3000 |
    | Console MinIO (armazenamento) | http://localhost:9001 |
    | MailHog (captura de e-mails) | http://localhost:8025 |

    > **E-mails locais:** todos os e-mails (verificação, redefinição de senha, convites) são interceptados pelo MailHog e nunca chegam em um inbox real. Acesse **http://localhost:8025** para lê-los. É assim que você obtém o link de verificação após criar uma conta localmente.

4. **Instale as dependências**
    ```bash
    pnpm install
    ```

5. **Configure o banco de dados**

    Gere o cliente Prisma, aplique as migrations e popule os dados em um único passo:
    ```bash
    pnpm prisma:generate
    pnpm setup
    ```
    > Na primeira execução das migrations você será perguntado pelo nome — digite `initial` e pressione Enter.

    O seed cria as seguintes contas:

    | E-mail | Senha | Função | Observações |
    |--------|-------|--------|-------------|
    | admin@qanubis.local | admin123 | Admin | Acesso total ao painel admin |
    | owner@qanubis.local | user123 | User | Proprietário de *Remote Work Study* |
    | collaborator@qanubis.local | user123 | User | Colaborador em *Remote Work Study*, Proprietário de *Interview Archive* |
    | viewer@qanubis.local | user123 | User | Visualizador em *Remote Work Study* |
    | researcher@qanubis.local | user123 | User | Conta de compatibilidade |

    O seed também cria dois projetos de exemplo, códigos com hierarquia, memorandos e chamados de suporte para você explorar todas as funcionalidades imediatamente.

6. **Inicie o servidor de desenvolvimento**
    ```bash
    pnpm dev
    ```

7. Abra **http://localhost:3000** e entre com uma das contas acima.
