# Funcionalidades

Este documento define o conjunto completo de funcionalidades do QAnubis. Ele separa o que será construído na **v1** (o primeiro lançamento completo) do que está planejado para **versões futuras**.

Funcionalidades marcadas com ⚠️ têm implicações arquiteturais que devem ser consideradas desde o início, mesmo que não totalmente implementadas na v1.

---

## Princípios de UI/UX

Uma UI/UX de qualidade é um requisito de primeira classe no QAnubis, não uma reflexão posterior. Os pesquisadores devem *gostar* de usar a ferramenta. Estes princípios se aplicam a todas as telas:

- **Sem recarregamentos de página para fluxos principais** — criar uma citação, atribuir um código, salvar um memorando deve parecer instantâneo. Use atualizações otimistas quando aplicável.
- **Feedback visual sempre** — toda ação assíncrona tem um estado de carregamento. Erros são exibidos inline, não apenas no console.
- **Linguagem de cores consistente** — as cores dos códigos definidas pelo pesquisador se propagam pelo visualizador de PDF, gráficos e tabelas. O sistema visual é coerente.
- **Layout responsivo** — funciona bem em desktop e tablet (os principais ambientes de pesquisa). Não otimizado para mobile na v1.
- **Modo escuro** — suportado desde o início via `ThemeContext` existente.
- **Fluxos principais acessíveis por teclado** — navegar entre citações, abrir o seletor de código, salvar formulários deve ser utilizável sem mouse.
- **Densidade adequada para pesquisa** — a UI deve acomodar listas de 50+ códigos, 200+ citações e 10+ documentos sem parecer sobrecarregada.

---

## v1 — Primeiro Lançamento

### Autenticação e Contas

| Funcionalidade | Notas |
|----------------|-------|
| Cadastro com e-mail e senha | ✅ Implementado — um e-mail de verificação é enviado após o cadastro; o link deve ser clicado antes do primeiro login |
| Login com e-mail e senha | ✅ Implementado |
| Login com Google OAuth | ✅ Implementado — opcional, habilitado via env `GOOGLE_CLIENT_ID` |
| Login com GitHub OAuth | ✅ Implementado — opcional, habilitado via env `GITHUB_CLIENT_ID` |
| Lembrar-me (sessão de 30 dias) | ✅ Implementado — sessão padrão é 24 h; marcar "Manter sessão" estende para 30 dias |
| Redefinição de senha por e-mail | ✅ Implementado — envia um link de redefinição para o endereço informado |
| Perfil de usuário (nome + troca de senha) | ✅ Implementado — avatar é v2 |

---

### Projetos ⚠️

Projetos são o container principal de todo o material de pesquisa. **Colaboração é um requisito da v1** e deve estar refletida no modelo de dados desde a Fase 1 — um projeto tem membros, não apenas um proprietário.

| Funcionalidade | Notas |
|----------------|-------|
| Criar projeto (nome, descrição, cor) | |
| Editar metadados do projeto | |
| Excluir projeto (cascata em todos os dados) | Confirmação necessária |
| Dashboard do projeto com contadores | Documentos, códigos, citações, memorandos |
| **Convidar colaboradores por e-mail** | Funcionalidade central de colaboração |
| **Funções de membro: Proprietário, Colaborador, Visualizador** | Ver definições abaixo |
| **Sair de um projeto** | Para não-proprietários |
| **Remover um membro** | Somente proprietário |
| Listar todos os projetos do usuário | Próprios + compartilhados |
| **Busca e filtro de projetos** | Busca por nome ou descrição; filtra por papel (Proprietário/Colaborador/Visualizador); ordena por mais recente |

**Definição de funções:**

| Função | Pode editar conteúdo | Pode gerenciar membros | Pode excluir projeto |
|--------|---------------------|----------------------|---------------------|
| Proprietário | ✅ | ✅ | ✅ |
| Colaborador | ✅ | ❌ | ❌ |
| Visualizador | ❌ | ❌ | ❌ |

---

### Documentos

| Funcionalidade | Notas |
|----------------|-------|
| Fazer upload de PDF para um projeto | Máximo de **50 MB** por arquivo |
| Listar documentos de um projeto | Com nome, data de upload, número de páginas, contagem de citações |
| Excluir documento | Remove o arquivo do armazenamento e todas as citações associadas |
| Baixar PDF original | ✅ Implementado |

> **Formato de arquivo:** Somente PDF na v1. Outros formatos (DOCX, imagens) são v2.

---

### Visualizador de PDF e Extração de Citações

Este é o fluxo central de análise do QAnubis. Deve ser fluido e confiável.

| Funcionalidade | Notas |
|----------------|-------|
| Renderização de PDF no navegador | Via PDF.js |
| Navegação por páginas e zoom | |
| Busca de texto no documento | |
| Selecionar texto para criar citação | |
| Atribuir um ou mais códigos a uma citação | Seletor múltiplo |
| Adicionar comentário/anotação a uma citação | |
| Destaque visual sobre citações codificadas | Cor corresponde ao(s) código(s) atribuído(s) |
| Clicar em um destaque para ver/editar citação | |
| Editar texto, códigos e comentários da citação | |
| Excluir citação | |
| Exibir de qual página cada citação vem | |
| **Aviso de PDF digitalizado** | ✅ Implementado — detecta ausência de camada de texto na página 1 e exibe banner de aviso. Suporte a OCR é v2. |

---

### Esquema de Códigos

| Funcionalidade | Notas |
|----------------|-------|
| Criar código (nome, cor, descrição) | |
| Estrutura hierárquica (pai-filho) | Profundidade ilimitada |
| Editar nome, cor e descrição do código | |
| Excluir código | Cascata nas citações que usam apenas esse código |
| Ver contagem de citações por código | |
| Visualização em árvore de códigos | Client-side, recolhível |

---

### Memorandos

Memorandos são **compartilhados por todos os membros do projeto** — qualquer pessoa com acesso ao projeto pode ver, criar e editar qualquer memorando. Não há visibilidade por usuário. Isso corresponde ao modelo de pesquisa colaborativa onde as notas são artefatos da equipe.

| Funcionalidade | Notas |
|----------------|-------|
| Criar memorando (nome + conteúdo em rich text) | Visível a todos os membros do projeto |
| Editar memorando | Qualquer PROPRIETÁRIO ou COLABORADOR pode editar |
| Excluir memorando | Qualquer PROPRIETÁRIO ou COLABORADOR pode excluir |
| Listar memorandos por projeto | |

---

### Relatórios e Visualizações

Todos os gráficos são filtráveis por documento e/ou código.

| Funcionalidade | Biblioteca | Notas |
|----------------|-----------|-------|
| Heatmap Citações × Códigos | Observable Plot | Quais códigos aparecem em quais documentos |
| Heatmap de co-ocorrência de códigos | Observable Plot | Quais códigos aparecem juntos em citações |
| Treemap de códigos | d3-hierarchy | Visão hierárquica com contagens de citações |
| Tabela resumo de documentos | React | Nome do documento, contagem de citações, códigos usados |
| Tabela resumo de códigos | React | Nome do código, contagem de citações, documentos |
| Explorador de citações | React | Navegar/editar citações filtradas por código + documento |

---

### Exportação

| Funcionalidade | Formato | Notas |
|----------------|---------|-------|
| Citações agrupadas por código | Texto simples | |
| Citações agrupadas por documento | Texto simples | |
| Citações agrupadas por código | CSV | |
| Citações agrupadas por documento | CSV | |

---

### Painel de Administração

Acessível apenas para usuários com `role = ADMIN`. Área separada da aplicação em `/admin`.

**Gerenciamento de usuários**

| Funcionalidade | Notas |
|----------------|-------|
| Listar todos os usuários com estatísticas | Contagem de projetos, citações, última atividade |
| Promover usuário a admin / revogar admin | |
| Suspender / reativar conta | Usuários suspensos não conseguem fazer login |

**Visão geral de projetos**

| Funcionalidade | Notas |
|----------------|-------|
| Listar todos os projetos com estatísticas | Contagem de membros, documentos, citações |
| Ver membros de qualquer projeto | Somente leitura |

**Métricas de uso**

| Funcionalidade | Notas |
|----------------|-------|
| Total de usuários cadastrados | |
| Usuários ativos (últimos 30 dias) | |
| Projetos, documentos, citações e memorandos criados ao longo do tempo | Exibido como gráfico |

**Suporte**

| Funcionalidade | Notas |
|----------------|-------|
| Usuários abrem ticket de suporte (assunto + descrição) | De dentro da aplicação |
| Admin visualiza todos os tickets, filtra por status | |
| Thread de mensagens por ticket | Admin e usuário podem trocar mensagens |
| Admin altera status do ticket | OPEN → IN_PROGRESS → RESOLVED → CLOSED |

---

## v2 — Versões Futuras

Estas funcionalidades são desejáveis, mas não bloquearão o primeiro lançamento. São listadas aqui para que as decisões arquiteturais da v1 não as dificultem inadvertidamente.

| Funcionalidade | Por que adiada |
|----------------|---------------|
| **Nuvem de palavras das citações** | Alto custo de implementação (d3-cloud), baixo valor analítico em comparação com heatmaps |
| **Nuvem de palavras dos códigos** | Mesmo motivo acima |
| **Confiabilidade entre avaliadores** | Requer fluxo de segunda codificação; UX complexa |
| **Visão de rede/grafo de códigos** | Códigos como nós, co-ocorrência como arestas; novo tipo de visualização |
| **Busca de texto completo nas citações** | Requer índice de busca (full-text do PostgreSQL ou externo) |
| **Exportação de codebook** (PDF/DOCX formatado) | Necessita de biblioteca de geração de documentos |
