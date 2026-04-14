# Manual do Usuário

Este manual cobre todas as funcionalidades disponíveis no QAnubis v1. Use o índice abaixo para navegar entre as seções.

---

## Índice

1. [Primeiros passos](#primeiros-passos)
2. [Sua conta](#sua-conta)
3. [Projetos](#projetos)
4. [Documentos](#documentos)
5. [Visualizador de PDF e extração de citações](#visualizador-de-pdf-e-extração-de-citações)
6. [Esquema de códigos](#esquema-de-códigos)
7. [Memorandos](#memorandos)
8. [Relatórios](#relatórios)
9. [Suporte](#suporte)
10. [Painel administrativo](#painel-administrativo) *(somente admin)*

---

## Primeiros passos

### Criar conta

Acesse `/auth/signup` e preencha seu primeiro nome, sobrenome, e-mail e uma senha de pelo menos 8 caracteres. Sua conta fica ativa imediatamente — sem necessidade de verificação de e-mail.

### Entrar

Acesse `/auth/signin` e informe seu e-mail e senha, ou use **Entrar com Google / GitHub** se sua instância tiver OAuth configurado.

Ative **Manter conectado** para estender sua sessão para 30 dias (o padrão é 24 horas).

### Redefinir senha

Clique em **Esqueceu a senha?** na página de login e informe seu e-mail. Um link de redefinição será enviado se o endereço existir no sistema.

---

## Sua conta

Clique no seu nome no cabeçalho superior direito para abrir o menu do usuário.

### Perfil

Acesse **Perfil** para atualizar seu nome de exibição. As alterações têm efeito imediato em toda a aplicação.

### Alterar senha

Na página de **Perfil**, role até **Alterar senha**. É necessário informar a senha atual antes de definir uma nova. Esta seção fica oculta para contas criadas com Google ou GitHub (contas OAuth não possuem senha local).

---

## Projetos

Projetos são o contêiner principal de todo o seu material de pesquisa. Cada projeto possui seus próprios documentos, códigos, memorandos e relatórios.

### Criar um projeto

No painel, clique em **Novo projeto**. Preencha:
- **Nome** (obrigatório, máx. 100 caracteres)
- **Descrição** (opcional)
- **Cor** — escolha uma cor da paleta para identificar visualmente o projeto na lista

### Editar um projeto

Abra o projeto e clique em **Editar projeto** (ícone de lápis, canto superior direito, somente proprietário). Você pode atualizar o nome, descrição e cor.

### Excluir um projeto

Clique em **Excluir projeto** (canto superior direito, somente proprietário) e confirme o diálogo. Isso remove permanentemente todos os documentos, citações, códigos e memorandos dentro do projeto.

### Colaboração

#### Convidar um colaborador

Abra a aba **Membros** e informe o e-mail da pessoa que deseja convidar. Ela receberá um link de convite. Se ainda não tiver uma conta, pode criar uma e depois acessar o link.

#### Funções

| Função | Pode editar conteúdo | Pode gerenciar membros | Pode excluir o projeto |
|--------|---------------------|----------------------|----------------------|
| Proprietário | ✅ | ✅ | ✅ |
| Colaborador | ✅ | ❌ | ❌ |
| Visualizador | ❌ | ❌ | ❌ |

#### Sair de um projeto

Membros que não são proprietários podem sair do projeto na aba **Membros** usando o botão **Sair** ao lado do próprio nome.

#### Transferir propriedade

Proprietários podem promover outro membro a Proprietário na aba **Membros**. O proprietário original passa a ser Colaborador.

---

## Documentos

### Enviar um PDF

Abra a aba **Documentos** de um projeto e clique em **Enviar PDF**. Selecione um arquivo PDF (máx. 50 MB). O sistema extrai automaticamente o número de páginas e o título incorporado nos metadados.

### Abrir um documento

Clique no nome do documento para abri-lo no visualizador de PDF.

### Baixar um documento

Clique no ícone de download (↓) na linha do documento para baixar o arquivo PDF original.

### Excluir um documento

Clique no ícone de lixeira na linha do documento (Colaborador/Proprietário apenas). Isso remove o arquivo do armazenamento e exclui todas as citações associadas.

---

## Visualizador de PDF e extração de citações

### Navegar pelo documento

Use os botões **← →** para navegar entre as páginas.

### Selecionar texto e criar uma citação

1. Clique e arraste sobre o texto no PDF para selecioná-lo.
2. Um botão **Citar** aparece próximo à sua seleção — clique nele para criar a citação.
3. A nova citação é adicionada na barra lateral à direita.

> **Documentos digitalizados:** Se o PDF foi criado escaneando um documento físico sem OCR, um banner de aviso aparecerá no topo do visualizador. A seleção de texto não está disponível para PDFs digitalizados.

### Barra lateral de citações

Todas as citações ficam listadas à direita, agrupadas por página. Cada card de citação exibe:
- O texto selecionado
- Badges de código atribuídos
- A cor do destaque
- Um botão de contagem de comentários

#### Atribuir um código

Clique em **Atribuir código** dentro do card de citação e selecione um código no seletor. Você pode atribuir múltiplos códigos à mesma citação.

#### Remover um código

Clique no **×** ao lado do badge de código no card da citação.

#### Alterar a cor do destaque

Clique no círculo colorido no card da citação para abrir um seletor de cores.

#### Adicionar um comentário

Clique no botão de contagem de comentários para expandir o thread. Digite no campo e pressione **Enter** ou clique em **Enviar**.

#### Excluir uma citação

Clique no ícone de lixeira no card da citação (Colaborador/Proprietário apenas) e confirme o diálogo. Isso remove todas as atribuições de código e comentários também.

### Destaques no visualizador

As citações existentes são sobrepostas ao PDF como destaques coloridos. Clique em qualquer destaque para rolar a barra lateral até aquela citação.

---

## Esquema de códigos

Códigos (também chamados de categorias ou tags) são os rótulos que você aplica às citações para organizar sua análise.

### Criar um código

Abra a aba **Códigos** e clique em **Novo código** ou **+ Adicionar subcódigo** em um código existente. Preencha:
- **Nome** (obrigatório)
- **Cor de fundo** — escolha na paleta de cores
- **Cor do texto** — calculada automaticamente para contraste, mas ajustável
- **Descrição** (opcional)

### Hierarquia

Os códigos suportam aninhamento pai-filho ilimitado. Códigos filhos aparecem indentados abaixo do pai na árvore. Excluir um pai torna seus filhos códigos raiz — eles **não** são excluídos.

### Editar um código

Clique no ícone de lápis em qualquer linha de código.

### Excluir um código

Clique no ícone de lixeira. Um painel de confirmação mostra quantas citações usam este código e quantos subcódigos ele possui. Excluir um código remove todas as suas associações com citações.

---

## Memorandos

Memorandos são notas de pesquisa compartilhadas visíveis a todos os membros do projeto.

### Criar um memorando

Abra a aba **Memorandos** e clique em **Novo memorando**. O memorando abre imediatamente no editor.

### Editar um memorando

- **Título**: Clique no título do memorando para editá-lo inline. Pressione **Enter** ou clique fora para salvar.
- **Conteúdo**: O editor de rich text salva automaticamente 800 ms após você parar de digitar. Um indicador "Salvando…" / "Salvo" aparece ao lado do título.

O editor suporta: negrito, itálico, tachado, código inline, títulos (H2, H3), listas com marcadores, listas numeradas, citações em bloco, blocos de código e desfazer/refazer.

### Excluir um memorando

Clique no ícone de lixeira no cabeçalho do memorando (Colaborador/Proprietário apenas) e confirme o diálogo.

---

## Relatórios

Abra a aba **Relatórios** para acessar as ferramentas de análise e exportação. Os relatórios são construídos a partir de todas as citações do projeto em todos os documentos.

### Explorador

Filtre citações por:
- **Documento** — exibir apenas citações de um documento
- **Código** — exibir apenas citações marcadas com um código específico
- **Busca** — pesquisa de texto livre no conteúdo das citações

### Gráficos

Dois mapas de calor construídos com Observable Plot:
- **Citações × Códigos** — quais códigos aparecem em quais documentos (a cor da célula = quantidade de citações)
- **Co-ocorrência de Códigos** — quais códigos aparecem juntos nas citações

Os gráficos requerem pelo menos uma citação com um código atribuído para serem renderizados.

### Resumo

Duas tabelas com estatísticas agregadas:
- **Tabela de Documentos** — quantidade de citações e número de códigos distintos usados por documento
- **Tabela de Códigos** — quantidade de citações e número de documentos distintos por código, ordenados pelo mais citado

### Exportar

Baixe seus dados como texto simples ou CSV:
- **Por código** — citações agrupadas sob cada título de código
- **Por documento** — citações agrupadas sob cada título de documento

Clique em **Baixar CSV** ou **Baixar TXT** para qualquer agrupamento.

---

## Suporte

Abra um chamado de suporte para contatar os administradores da plataforma.

### Abrir um chamado

Acesse **Suporte** na barra lateral (ou pelo menu do usuário) e clique em **Novo chamado**. Informe um assunto e uma descrição do seu problema.

### Ver seus chamados

A página de Suporte lista todos os seus chamados abertos e anteriores com seus status:
- **Aberto** — aguardando resposta do admin
- **Em andamento** — admin está trabalhando nisso
- **Resolvido** — admin forneceu uma resolução
- **Encerrado** — chamado encerrado, sem mais respostas possíveis

### Responder a um chamado

Abra um chamado e digite sua resposta na caixa de texto no final. Clique em **Enviar**. Se o chamado estava marcado como Resolvido, sua resposta o reabrirá automaticamente.

---

## Painel administrativo

O painel administrativo está disponível em `/dashboard/admin` para usuários com a função **Admin**. Um link **Administração** aparece na barra lateral para contas admin.

### Painel de estatísticas

Exibe totais da plataforma: usuários registrados, projetos, documentos, citações e chamados abertos.

### Usuários

Lista todos os usuários cadastrados com sua contagem de projetos, citações, função e status. Ações disponíveis por usuário:
- **Suspender / Reativar** — usuários suspensos não conseguem entrar
- **Tornar admin / Tornar usuário** — alterna a função de Admin

### Projetos

Lista todos os projetos com contagens de membros, documentos, códigos, memorandos e citações.

### Chamados de suporte

Lista todos os chamados abertos por qualquer usuário. Clique em um chamado para visualizar o thread de mensagens, responder em nome do suporte e alterar o status do chamado.
