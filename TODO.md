# Fisgou — TODO & Roadmap

Análise de requisitos e backlog de features. Marcação: ✅ feito · 🟡 parcial · ⬜ pendente.

---

## ✅ Já entregue

**Front + base**
- Monorepo pnpm (Next 14 + Tailwind + tipos em `@fisgou/shared`).
- Telas: Feed, Criar, Pesqueiros (lista + detalhe), Fisgados, Perfil, Perfil público (`/u/[handle]`), Post + comentários, Notificações, Busca, Mensagens (stub), Landing, Login, Cadastro.
- Layout responsivo (Sidebar desktop / BottomNav mobile / RightRail xl), tema claro/escuro com transição, microinterações.

**Backend (FASE 2 — funcional)**
- Prisma + SQLite (dev). Auth e-mail+senha (bcrypt + cookie JWT).
- Persistência real: posts, curtidas, comentários, follow, upload de imagem, foto de perfil.
- Notificações geradas por ação (curtir/comentar/seguir) + polling (toast + badge), feed com "Nova publicação".

---

## Requisitos Funcionais

### Feitos ✅
- RF: cadastro/login/logout; sessão.
- RF: criar publicação (foto, legenda, privacidade da localização).
- RF: curtir, comentar, seguir/deixar de seguir.
- RF: coleção "Fisgados" com raridade e status de verificação.
- RF: feed com atualização (pílula "Nova publicação"), perfil com tabs e "Seguidores" p/ criador.
- RF: notificações + badge que zera ao visualizar.
- RF: busca por pescadores/espécies/pesqueiros com filtro por tipo.

### Feitos ✅ (rodada seguinte)
- **Edição de perfil**: nome, bio, cidade, foto de usuário, **foto de banner**, **virar criador**, **cor de destaque personalizável** (`/perfil/editar`).
- **Check-in funcional** no pesqueiro: registra presença real (model `CheckIn`), conta visitas, "Quem pescou aqui" usa dados reais.
- **Cadastro com papéis**: passo inicial **"Sou Pescador" / "Sou Vendedor"** + campo "nome do negócio" para vendedor.
- **Marcar espécie na criação**: seletor (`SpeciesPicker`) grava `speciesId`, post entra em análise.

### Feitos ✅ (rodada favicon + pesqueiro + amigos)
- **Favicon do site** — `app/icon.svg` (peixe teal green, claro/escuro) + `app/apple-icon.png`.
- **Marcar pesqueiro na criação** — `Post.pesqueiroId` + relação; `GET /api/pesqueiros` alimenta o `PesqueiroPicker` (mesmo padrão do `SpeciesPicker`); a chip "Marcar pesqueiro" no `/criar` agora funciona; o `PostCard` mostra a localização (estilo Instagram) linkando pro `/pesqueiros/[id]`.
- **Marcar amigos numa publicação** — model `PostTag` (postId+userId); `GET /api/users/following` alimenta o `FriendsPicker` (multi-select de quem você segue); `POST /api/posts` aceita `amigosIds[]`, cria as marcações e **notifica** cada marcado (tipo novo `marcacao`); `PostCard` mostra "com Fulano, Ciclano" linkando pros perfis.

### Feito ✅ (enquetes)
- **Enquete no post** — models `Poll`/`PollOption`/`PollVote` (1 voto por usuário, trocar de opção = upsert); no `/criar`, alternador **Foto | Enquete** (2–4 opções, legenda vira a pergunta); `PostCard` renderiza `PollView` com barras de %, voto otimista e contagem total; post-enquete sem foto dispensa o bloco de cor.

### Feito ✅ (cidade + raio)
- **Filtro de cidade + pesqueiros próximos** — `Pesqueiro.cidade` (schema/mock/seed); na tela de pesqueiros, chips de cidade (derivadas dos dados) + chip **"Perto de mim"**: geolocalização do navegador → **Haversine** com `lat/lng` recalcula a distância real, ordena do mais perto pro mais longe e filtra por **raio** (10/25/50/100 km); estados de carregando/erro de permissão.

### Feito ✅ (painel de vendedor)
- **Painel de vendedor** (`/painel`) — pesqueiro ganha `dono` (relação com o User) e `descricao`; página guardada por `role="vendedor"` (pescador é redirecionado). O vendedor **cadastra e edita** seus pesqueiros (nome, tipo, cidade, endereço, descrição, cor da capa, lat/lng com "usar minha localização") via `PesqueiroForm`; dashboard mostra **check-ins, visitantes únicos e publicações** por pesqueiro + atividade recente (quem pescou / posts que marcam o local). APIs `POST /api/pesqueiros` e `PATCH /api/pesqueiros/[id]` (validação em `lib/pesqueiro-input.ts`, só o dono edita). Entrada "Painel" na Sidebar/BottomNav só para vendedor; a página pública do pesqueiro passa a exibir a descrição e omite "0 avaliações/0 km" em locais novos.

### Feito ✅ (sistema de mensagens)
- **Chat completo** — models `Conversation` (dm|grupo|pesqueiro) / `ConversationMember` (`lastReadAt`) / `Message`; tipos shared (`ConversationSummary`/`Detail`, `Message`, `CombinarEvento`). Camada `lib/chat.ts` (getConversations, getUnreadTotal, getConversationDetail, findOrCreateDM, findOrCreatePesqueiroConversation) e APIs `/api/conversations` (listar/criar DM/pesqueiro/grupo), `/[id]` (detalhe), `/[id]/messages` (polling `?after` + enviar), `/[id]/read`, `/unread`. Só membros leem/escrevem; polling 5s na thread + 8s no badge.
- **Página `/mensagens` real** — `MensagensView` (lista + thread, 2 colunas no desktop, troca no mobile), `ChatThread` (carga + polling incremental + envio + auto-scroll + marca lida), `ConversationList`, `NewChatButton` (DM com quem você segue). Deep-link `?c=<id>`. Item "Mensagens" na Sidebar + ícone no feed mobile, ambos com badge (`ChatProvider`/`ChatNavBadge`).
- **ChatDock flutuante** (desktop, estilo Instagram) — botão no canto → painel de conversas → até 3 janelas flutuantes lado a lado; escondido no mobile e em `/mensagens`.
- **"Falar com Pesqueiro"** — botão da página do pesqueiro cria/abre a conversa `tipo="pesqueiro"` (dock no desktop, `/mensagens?c=` no mobile).
- **"Combinar Pescaria"** — botão abre modal (nome, data/hora, amigos multi-select), cria grupo com `eventoData`/`eventoPesqueiroId` + mensagem inicial; `ChatThread` mostra card "Pescaria combinada" (data + pesqueiro) no topo.

### Feito ✅ (verificação de captura)
- **Verificação de captura** — o **vendedor verifica as capturas que marcaram o pesqueiro dele**. Ao publicar com espécie, a captura entra na coleção Fisgados como "em análise". `getCapturasPendentes` alimenta a seção **"Capturas para verificar"** no `/painel` (aprovar/recusar). `POST /api/posts/[id]/verificar` (só o dono do pesqueiro): **aprovar** → post + coleção "verificado" (+`especies`) e notifica; **recusar** → "nao_verificado" e notifica (novo tipo `verificacao_recusada`). Capturas sem pesqueiro (ou em pesqueiro sem dono) seguem em análise (futuro: moderação/comunidade).

> **Todos os pedidos originais do TODO foram entregues.** A rodada 2 (abaixo) veio do review do usuário em 18/jul/2026, testando em LAN com o sócio.

---

## Rodada 2 — Pedidos (18/jul/2026) · ⬜ pendente / 🟡 parcial / ✅ feito

### A. Correções imediatas (bugs/UX)

- ⬜ **A1. Chat: cabeçalho e teclado fixos** — na página `/mensagens`, o cabeçalho do contato (topo) e o campo de digitação (rodapé) estão **rolando junto com as mensagens**. Devem ficar fixos na tela; só a lista de mensagens rola. Causa provável: o root da `MensagensView` usa `h-full` mas a cadeia de altura não está travada dentro do `<main>` scroller do AppShell — a coluna cresce além da viewport. Fix: ancorar a view em `absolute inset-0` (o `<main>` já é `relative`) ou travar `max-h` na cadeia.
- ⬜ **A2. Chat: coluna de contatos com altura total** — a lista lateral de conversas deve **sempre preencher a tela inteira** (borda direita descendo até o fim), e não crescer conforme chegam mensagens. Mesmo root cause do A1.
- ⬜ **A3. Enquete: pergunta ACIMA das opções** — hoje a pergunta (legenda) não aparece claramente antes das barras. Renderizar a pergunta no topo do bloco da enquete, opções abaixo.
- ⬜ **A4. Composer do feed: chips redundantes** — "Foto / Espécie / Local" levam os três para a MESMA página `/criar`. Não faz sentido. Simplificar (um atalho só, ou chips que abrem `/criar` já com o respectivo picker aberto).

### B. Moderação da plataforma (muda o modelo de verificação)

- ⬜ **B1. Verificação é dos MODERADORES da Fisgou, não dos pesqueiros** — reverter a decisão da rodada 1: quem aprova/recusa capturas é a equipe de moderação da plataforma. Adicionar `role="moderador"` (User.role vira "pescador" | "vendedor" | "moderador"). A seção "Capturas para verificar" SAI do painel do vendedor.
- ⬜ **B2. Painel do moderador** (`/moderacao`, guardado por role) — **moderação total**:
  - **Verificação de capturas**: fila com TODAS as capturas em análise (não só as com pesqueiro marcado). Critérios que o moderador avalia: a foto é real? o peixe é mesmo daquela espécie? essa espécie **existe naquela região/pesqueiro**? Aprovar/recusar com o fluxo já existente (`/api/posts/[id]/verificar` passa a exigir moderador).
  - **Posts mal-intencionados**: listar publicações recentes com ação de **remover** (e futuramente denúncias dos usuários alimentando essa fila).
  - (futuro) suspender usuário, remover comentário, log de ações.
- ⬜ **B3. Verificações pendentes na área de notificações** — para o moderador, o acesso à fila também aparece na área de **Notificações** (ex.: aba/bloco "Verificações pendentes" no topo de `/notificacoes`), não escondido num painel.

### C. Social / notificações / perfil

- ⬜ **C1. Curtida em comentário notifica** — curtir um comentário gera notificação para o **dono do comentário**; se for curtida numa **resposta**, notifica apenas o **dono da resposta** (não o dono do comentário-raiz). Novo tipo `curtida_comentario`.
- ⬜ **C2. Pescadores recomendados relevantes** — o card "Pescadores para seguir" (RightRail) deve sugerir os **mais famosos** (mais seguidores) ou os **mais próximos** (mesma cidade do viewer), não uma lista arbitrária. Hoje ordena por `seguidores desc` mas sem considerar cidade e sem excluir quem já sigo.
- ⬜ **C3. Botão "Mensagem" no perfil público funcional** — no perfil de outro usuário, o botão de mensagem abre/cria a DM (dock no desktop, `/mensagens?c=` no mobile). Junto: **privacidade** — nova opção no perfil "Quem pode me enviar mensagens: **Todos / Apenas amigos**" (`User.dmPrivacy`; "amigos" = seguimento mútuo). A API de criar DM respeita a preferência do destinatário.
- ⬜ **C4. Compartilhar funcional** — o botão de compartilhar do post deve (a) **enviar para um chat da Fisgou** (picker de conversas → manda o link/preview) e (b) **compartilhar fora** (Web Share API `navigator.share` no mobile; copiar link no desktop).

### D. Criação de conteúdo (composer novo)

- ⬜ **D1. Multi-mídia no post** — publicar **várias imagens**, **vídeo**, ou **imagens + vídeo juntos** (carrossel). Combinações com enquete: **Imagem + Enquete abaixo** e **Vídeo + Enquete abaixo** (hoje enquete exclui foto). Modelo: `PostMedia` (postId, tipo imagem|video, url, ordem) substituindo o `imagemUrl` único.
- ⬜ **D2. Marcar amigos via "@" na legenda** — **remover o botão "Marcar amigos"**; a marcação passa a ser por **menção `@handle` digitada na legenda** (autocomplete de quem você segue enquanto digita). A menção vira link no post e notifica o marcado (mantém `PostTag`/notificação `marcacao` por trás).
- ⬜ **D3. Abrir câmera na publicação** — opção de **tirar a foto na hora** (além de escolher da galeria) tanto no post normal quanto no vídeo curto. Mobile: `<input capture="environment">`; desktop: `getUserMedia` com preview e captura em canvas.

### E. Novas áreas (mock primeiro, estruturar só o necessário)

- ⬜ **E1. Vídeos curtos (Reels)** — área estilo TikTok/Reels onde ficam os vídeos curtos publicados pelos usuários: rota `/reels`, player vertical em tela cheia, navegação por scroll/swipe (um vídeo por vez), ações de curtir/comentar/compartilhar na lateral, avatar + @handle + legenda sobrepostos. Entrada na navegação. Publicação de vídeo curto no fluxo de criação. Mock: vídeos de exemplo locais/placeholder.
- ⬜ **E2. Marketplace de lojas parceiras (mock)** — rota `/lojas`: vitrine de lojas parceiras (logo, nome, categoria — iscas, varas, equipamentos…) e produtos em destaque com preço; página da loja com catálogo simples. Sem checkout — botão "Falar com a loja" cai no chat (conversa tipo pesqueiro/loja) ou link externo. Dados mock em `data/`.
- ⬜ **E3. Área de membros do criador (mock, estilo YouTube)** — criadores de conteúdo podem ter **assinaturas pagas**. No perfil do criador, botão "Seja membro" abre um **popup/modal em frente ao site** com: **vídeo de apresentação + precificação + os diferentes níveis de assinatura criados pelo criador** (nome, preço/mês, benefícios, selos de fidelidade). Gerenciamento: o criador cria/edita seus planos (página/aba "Membros" — mock, sem pagamento real). Referência visual: modal de membership do YouTube.

### Ordem sugerida da rodada 2
1. **A1–A4** (bugs rápidos, alto incômodo).
2. **B1–B3** (moderação — muda modelo de verificação; pré-requisito pro resto fazer sentido).
3. **C1–C4** (social: notificação de curtida em comentário, recomendados, DM do perfil + privacidade, compartilhar).
4. **E1** Reels (área nova de maior impacto) → **E2** Marketplace → **E3** Membros.
5. **D1–D3** (composer multi-mídia + @menções + câmera — maior esforço de UI).

### Feito ✅ (favicon)
- **Favicon do site** — `app/icon.svg`: peixe (o mesmo `Fish` do lucide/marca) preenchido em **teal green**, `#14916B` claro / `#2DB98B` escuro via `prefers-color-scheme`, com olho branco. `app/apple-icon.png` (180×180): tile da marca (quadrado teal + peixe branco). O Next injeta os `<link>` sozinho. (`.ico` legado dispensado — SVG cobre browsers modernos.)

---

## Requisitos Não-Funcionais

- ✅ Responsivo (mobile-first + desktop), acessibilidade básica (foco, aria), `prefers-reduced-motion`.
- ✅ Tema claro/escuro; tokens via CSS vars.
- 🟡 Performance: feed limitado a 50; faltam **paginação/scroll infinito**, otimização de imagens (hoje `<img>` local).
- 🟡 Segurança: sessão httpOnly (SameSite=Lax), validações nas rotas, **rate limiting no login/cadastro** (5/IP/15min, `lib/ratelimit.ts`), **CSP + security headers** em todas as rotas (`next.config.js`), **anti-CSRF nas mutações** (checagem de Origin no `middleware.ts`), **upload validado por magic bytes** (JPG/PNG/GIF/WebP; extensão pelo tipo detectado; SVG rejeitado) e **guia de deploy seguro** (`DEPLOY.md`); falta **storage externo** (uploads locais não servem em produção serverless).
- ⬜ **Banco de produção**: migrar SQLite → Postgres (Docker / Neon) — trocar `provider` + `DATABASE_URL` + migrations.
- ⬜ **Tempo real de verdade** (WebSocket/SSE) — hoje é polling 8–10s (ótimo p/ LAN, mas não sub-segundo).
- ⬜ Testes (unit/e2e), CI, observabilidade (logs/erros).
- ⬜ SEO/OG da landing; PWA (instalável/offline) faria sentido pro uso em campo.

---

## Backlog detalhado (com ideias de implementação)

### A. Chat flutuante (feed) + grupos + "Combinar Pescaria"
- **Modelos**: `Conversation` (tipo: dm | grupo | pesqueiro), `ConversationMember`, `Message`. "Combinar Pescaria" = uma `Conversation` de grupo com metadados (`evento`: data, pesqueiroId).
- **UI**: dock flutuante no canto inferior direito (lista de conversas → abre janelas), como Instagram/Messenger. Componente client `ChatDock` montado no `(app)/layout`.
- **Tempo real**: começar com polling (5–8s) por conversa aberta; depois WebSocket.
- **"Combinar Pescaria"**: botão dentro do chat de grupo → cria evento (data + pesqueiro), mostra card do evento no topo da conversa.

### B. Enquete no post
- **Modelo**: `Poll` (postId, pergunta), `PollOption` (texto, votos), `PollVote` (userId, optionId, único por enquete).
- **Criação**: no `/criar`, alternar "foto" vs "enquete" (2–4 opções).
- **Feed**: render com barras de % e voto otimista (1 voto por usuário).

### C. Criação de publicação melhorada
- **Marcar espécie**: seletor (busca no catálogo) → grava `speciesId` (já suportado no backend) e entra em verificação.
- **Marcar pesqueiro**: seletor de pesqueiro → `pesqueiroId` no post (novo campo).
- **Marcar amigos**: multi-select de quem você segue → `PostTag`/`mentions`; notifica os marcados.

### D. Check-in nos pesqueiros
- **Modelo**: `CheckIn` (userId, pesqueiroId, criadoEm). Botão "Check-in" grava; "amigos que pescaram aqui" passa a ler check-ins reais; contador de visitas.

### E. Filtro de cidade + raio (pesqueiros)
- **Cidade**: adicionar `cidade` ao `Pesqueiro`; chip/seletor de cidade na busca.
- **Raio (km)**: pedir geolocalização do navegador; calcular distância (Haversine) com `lat/lng` já existentes; ordenar/filtrar por raio. Atualizar `distanciaKm` para ser relativo ao usuário.

### F. Edição de perfil + virar criador
- **Página `/perfil/editar`**: nome, bio, foto (já há `/api/users/avatar`), **banner** (`bannerUrl` novo + upload), cidade.
- **Virar criador**: toggle que seta `criador=true` (muda "Amigos"→"Seguidores", libera selo e, no futuro, recursos pro/loja).

### G. Personalização da cor de destaque
- Guardar `accent` no usuário (hex ou paleta pré-definida). Aplicar sobrescrevendo `--brand`/`--brand-soft`/`--brand-fg` via style no `<html>`/provider de tema. Oferecer ~6 paletas + custom. Manter contraste (gerar `brand-fg` claro/escuro).
- Cuidado com a **regra do âmbar** (âmbar continua reservado a lendário/Criador/Recordista).

### H. Cadastro com papéis ("Sou Pescador"/"Sou Vendedor")
- 1º passo do cadastro: escolher papel. **Pescador** → fluxo atual. **Vendedor** → campos extras (nome do negócio/pesqueiro, cidade) e, depois, painel de vendedor.
- Modelo: `role` no User (`pescador` | `vendedor` | …) + `criador` como flag separada.

---

## Sugestão de ordem
1. Edição de perfil + virar criador + cor de destaque (alto impacto, isolado).
2. Cadastro com papéis (Pescador/Vendedor).
3. Criação melhorada (marcar espécie/pesqueiro/amigos) + check-in.
4. Filtro de cidade + raio.
5. Enquetes.
6. Chat flutuante + grupos + "Combinar Pescaria".
7. Não-funcionais: Postgres (Docker), storage externo, paginação, testes.

> Nota de ambiente: o projeto vive em `E:\fisgou-main` (sem `.git` nesta cópia). Definir como versionar (re-clonar com git, ou re-init + remote) antes de automatizar commits.
