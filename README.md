# Fisgou

Aplicação web de comunidade para pescadores: feed social, coleção gamificada de espécies ("Fisgados"), pesqueiros com mapa e check-in, chat e painel para donos de pesqueiro.

## Status atual

Monorepo pnpm, full-stack em um único app Next.js:

- Frontend: Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- Backend: Route Handlers do próprio Next + Prisma
- Banco: SQLite local em dev (migração p/ Postgres planejada)
- Tipos compartilhados em `packages/shared`
- Auth real: e-mail+senha (bcrypt) com sessão JWT em cookie httpOnly

## Estrutura do repositório

- `apps/web` — aplicação principal (front + API)
- `apps/api` — reservado para um futuro backend separado (não ativo)
- `packages/shared` — tipos e contratos compartilhados

## Funcionalidades atuais

**Social**
- Cadastro com papéis (Pescador / Vendedor), login, sessão
- Feed com posts (foto real ou cor, espécie, pesqueiro, amigos marcados, enquetes com voto)
- Curtidas, comentários com respostas (1 nível) e curtidas em comentários
- Perfil editável (avatar, banner, bio, cor de destaque, virar criador) + perfil público
- Seguir/deixar de seguir; notificações por ação (toast + badge, polling)
- Busca com filtros (pescadores / espécies / pesqueiros)

**Pesca**
- Coleção "Fisgados" com raridade e selo de verificação
- Pesqueiros: lista com filtro de cidade e **"perto de mim"** (geolocalização + raio em km), página com mapa (Google Maps opcional), check-in real
- **Verificação de captura**: captura com espécie entra "em análise" e é aprovada/recusada (hoje pelo dono do pesqueiro; vai migrar para **moderadores da plataforma** — ver TODO rodada 2)

**Chat**
- Mensagens completas: DM, grupos e conversa com pesqueiro
- Página `/mensagens` (lista + thread) e **ChatDock flutuante** no desktop (estilo Instagram)
- "Falar com Pesqueiro" e "Combinar Pescaria" (grupo com evento: data + local)

**Painéis**
- Painel do vendedor (`/painel`): cadastrar/editar pesqueiros, estatísticas (check-ins, visitantes, publicações) e atividade recente

## Requisitos

- Node.js 18+
- pnpm

## Como rodar localmente

```powershell
cd e:\fisgou-main
pnpm install
copy apps\web\.env.example apps\web\.env
```

### Inicialização com scripts personalizados

```powershell
pnpm run up         # app com banco limpo (login rápido)
pnpm run up:empty   # idem
pnpm run up:demo    # app com conteúdo de exemplo
```

Logins:

- Modo `empty`: `admin@gmail.com` / `admin123`
- Modo `demo`: `marina.pesca@fisgou.app` / `fisgou123` (todos os usuários do demo usam `fisgou123`)

Depois, abra http://localhost:3000 (ou a porta que o Next indicar).

### Teste em LAN (com o sócio)

O servidor dev do Next expõe a URL "Network". Libere a porta no firewall do Windows e acesse pelo IP da máquina (ou Radmin VPN) — ex.: `http://SEU_IP:3000`.

## Variáveis de ambiente

Base em [apps/web/.env.example](apps/web/.env.example):

- `DATABASE_URL` — SQLite local: `file:./dev.db`
- `AUTH_SECRET` — segredo da sessão JWT
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — opcional (mapa real dos pesqueiros)

## Banco de dados

```powershell
pnpm --filter @fisgou/web db:reset          # reset + seed demo
pnpm --filter @fisgou/web exec prisma studio # inspecionar o banco
```

## Roadmap (rodada 2 — em andamento)

Detalhado no [TODO.md](TODO.md). Resumo:

1. **Correções**: layout do chat (cabeçalho/teclado fixos, lista com altura total), pergunta da enquete acima das opções, chips redundantes do composer.
2. **Moderação**: papel `moderador` + painel de moderação total (verificação de capturas pela equipe Fisgou, remoção de posts mal-intencionados) e fila de verificações na área de notificações.
3. **Social**: notificação de curtida em comentário, recomendados por fama/proximidade, botão de mensagem no perfil + privacidade de DM, compartilhar (chat interno + externo).
4. **Novas áreas (mock)**: **Reels** (vídeos curtos), **Marketplace de lojas parceiras**, **Área de membros do criador** (assinaturas estilo YouTube).
5. **Composer novo**: multi-mídia (imagens+vídeo+enquete), menções por `@` na legenda, abrir câmera na hora.

Não-funcionais planejados: Postgres, storage externo p/ uploads, tempo real (WebSocket), paginação, testes/CI, PWA.
