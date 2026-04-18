# Perguntas Frequentes

## Geral

**O que é o QAnubis?**
O QAnubis é uma plataforma CAQDAS (Análise Qualitativa de Dados Assistida por Computador). Ele permite que pesquisadores façam upload de documentos PDF, selecionem trechos de texto para criar citações, organizem-nas com um esquema hierárquico de códigos, escrevam memorandos colaborativos e gerem relatórios visuais — tudo dentro de um espaço de projeto compartilhado.

**Quais formatos de arquivo são suportados?**
Somente PDF. Outros formatos (DOCX, imagens) estão planejados para versões futuras. Se o documento for um PDF digitalizado sem camada de texto, o visualizador exibirá um aviso e a seleção de texto não estará disponível.

**O QAnubis é gratuito?**
Sim. O QAnubis é open-source (licença MIT). Você pode usar a instância hospedada ou fazer o deploy da sua própria — veja [Arquitetura](/docs/architecture) para as opções de implantação.

---

## Conta

**Como faço para verificar meu e-mail após o cadastro?**
Após criar sua conta, um e-mail de verificação é enviado para o endereço informado. Clique no link desse e-mail para ativar a conta. Se não encontrar, verifique a pasta de spam. Você pode solicitar um novo link pela página de login.

**Esqueci minha senha. O que faço?**
Clique em **Esqueceu a senha?** na página de login e informe seu e-mail. Um link de redefinição será enviado se houver uma conta com esse endereço.

**Posso entrar com Google ou GitHub em vez de e-mail?**
Sim, se a instância que você está usando tiver OAuth configurado. Procure os botões **Entrar com Google** ou **Entrar com GitHub** na página de login. Contas OAuth não possuem senha local.

**Como faço para excluir minha conta?**
Acesse **Perfil** e role até a seção **Excluir conta**. A exclusão é permanente e remove seus dados pessoais, mas não exclui os projetos dos quais você faz parte — você será removido como membro.

---

## Projetos e Colaboração

**Como funcionam os convites?**
Proprietários de projetos podem convidar qualquer pessoa por e-mail pela aba **Membros**. O convidado recebe um link válido por 48 horas. Se não tiver conta, pode criar uma e depois visitar o link do convite para entrar. Após 48 horas o link expira, mas o proprietário pode enviar um novo.

**Como altero o papel de um membro?**
Abra a aba **Membros** (somente proprietário), clique no badge de papel ao lado do nome do membro e selecione o novo papel. Os papéis são: Proprietário, Colaborador e Visualizador.

**Qual a diferença entre os papéis?**

| Ação | Proprietário | Colaborador | Visualizador |
|------|-------------|-------------|--------------|
| Visualizar todo o conteúdo | ✅ | ✅ | ✅ |
| Criar/editar/excluir citações, códigos, memorandos | ✅ | ✅ | ❌ |
| Convidar/remover membros | ✅ | ❌ | ❌ |
| Editar configurações do projeto | ✅ | ❌ | ❌ |
| Excluir projeto | ✅ | ❌ | ❌ |

**Várias pessoas podem trabalhar no mesmo projeto ao mesmo tempo?**
Sim. Todos os membros compartilham os mesmos documentos, códigos, citações e memorandos em tempo real (as alterações aparecem após recarregar a página ou navegar).

---

## Documentos e Citações

**O que acontece com as citações se eu excluir um documento?**
Todas as citações associadas a esse documento são excluídas permanentemente, incluindo suas associações de código e comentários.

**O que acontece se eu excluir um código que possui citações?**
O código é removido de todas as citações às quais estava atribuído. As citações em si não são excluídas. Se quiser reatribuí-las, faça isso antes de excluir o código.

**Posso alterar a cor de destaque de uma citação?**
Sim. Clique no círculo colorido no cartão da citação na barra lateral do visualizador de PDF para abrir um seletor de cores.

---

## Relatórios e Exportação

**Posso exportar meus dados?**
Sim. A aba **Relatórios** oferece downloads em texto simples e CSV, agrupados por código ou por documento.

**Quais gráficos estão disponíveis em Relatórios?**
- **Heatmap Citações × Códigos** — mostra quais códigos aparecem em quais documentos
- **Heatmap de co-ocorrência de códigos** — mostra quais códigos aparecem juntos nas mesmas citações
- Os gráficos exigem pelo menos uma citação com um código atribuído para serem renderizados.

---

## Auto-hospedagem

**Como executar o QAnubis localmente?**
Veja o [Guia de Contribuição](/docs/contribution-guidelines) para um passo a passo de configuração local.

**Qual infraestrutura o QAnubis precisa?**
Um banco de dados PostgreSQL, um armazenamento de objetos compatível com S3 (AWS S3, Cloudflare R2 ou MinIO) e um servidor SMTP para e-mail. Tudo pode rodar localmente via Docker Compose para desenvolvimento.
