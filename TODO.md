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

### Pendentes ⬜ (pedidos)
1. **Marcar pesqueiro** na criação (igual à espécie, falta o seletor + campo `pesqueiroId` no Post).
2. **Marcar amigos** numa publicação.
3. **Enquete no post** (pergunta + opções + votos).
4. **Chat** (DM 1‑a‑1 e **grupo**) — flutuante no feed (abre/fecha estilo Instagram).
5. **"Combinar Pescaria"** como função do chat (criar evento/grupo com amigos, data, pesqueiro).
6. **"Falar com Pesqueiro"** — abrir conversa de verdade com o estabelecimento (botão já existe, sem chat por trás ainda).
7. **Filtro de cidade** na busca de pesqueiros + **pesqueiros próximos** (raio em km via geolocalização).
8. **Mensagens** real (a tela é stub).
9. **Verificação de captura** — fluxo real de aprovação (hoje status é manual no seed).
10. **Painel de vendedor** (usar o `role="vendedor"` já salvo para liberar telas/recursos).
11. **Favicon do site** — usar o **mesmo ícone de peixe** já usado no site (o do `FishLoader`/marca), só que na **cor teal green da marca** (`#14916B` claro / `#2DB98B` escuro — ver `lib/accent.ts`, paleta `teal`). Gerar `favicon.ico` + `icon.svg`/PNGs (via `app/icon.svg` do App Router) e apple-touch-icon.

---

## Requisitos Não-Funcionais

- ✅ Responsivo (mobile-first + desktop), acessibilidade básica (foco, aria), `prefers-reduced-motion`.
- ✅ Tema claro/escuro; tokens via CSS vars.
- 🟡 Performance: feed limitado a 50; faltam **paginação/scroll infinito**, otimização de imagens (hoje `<img>` local).
- 🟡 Segurança: sessão httpOnly, validações nas rotas; faltam **rate limiting**, **CSRF** em mutações, sanitização de upload mais forte, e **storage externo** (uploads locais não servem em produção serverless).
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
