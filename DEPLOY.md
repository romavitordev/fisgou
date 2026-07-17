# Fisgou — Deploy seguro (checklist)

Passo a passo para colocar o app em produção sem abrir brechas. Itens na
ordem em que devem ser feitos.

## 1. Segredos (obrigatório antes de qualquer deploy)

- [ ] **`AUTH_SECRET` forte** — o `.env.example` tem um placeholder. Se ele
  vazar ou ficar fraco, qualquer um forja sessão de qualquer usuário. Gere:

  ```bash
  # openssl
  openssl rand -base64 48
  # ou node
  node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
  ```

  Cadastre como variável de ambiente na plataforma (Vercel → Settings →
  Environment Variables). **Nunca commitar.**

- [ ] **`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`** — restrinja a chave por domínio
  (HTTP referrer) no Google Cloud Console; chave `NEXT_PUBLIC_*` é visível
  no cliente por definição.

## 2. Banco e dados

- [ ] **SQLite → Postgres**: `dev.db` é só para desenvolvimento. Em produção,
  trocar `provider` no `schema.prisma` + `DATABASE_URL` (Neon/Supabase/RDS)
  e rodar as migrations.
- [ ] **Não rodar o seed em produção** — todos os usuários do seed usam a
  senha `fisgou123`. Se precisar de dados de demonstração, crie contas
  reais com senhas fortes.

## 3. Uploads

- [ ] `POST /api/upload` grava em `public/uploads` (disco local). Em
  serverless isso **não persiste** — trocar por storage externo
  (S3/R2/Supabase Storage) antes do go-live.

## 4. O que JÁ está pronto no código

- Senhas com **bcrypt** (hash + salt); nunca armazenadas em claro.
- Sessão em **cookie JWT httpOnly** (jose) — inacessível a JS no cliente.
- **Rate limit** no login e no cadastro: 5 tentativas por IP / 15 min
  (`lib/ratelimit.ts`); em escala horizontal, trocar por Redis.
- **CSP + security headers** em todas as rotas (`next.config.js`):
  Content-Security-Policy, X-Frame-Options, nosniff, Referrer-Policy,
  Permissions-Policy, HSTS.
- **DTOs** (`lib/dto.ts`): nenhuma rota devolve `passwordHash`/e-mail de
  terceiros.
- Autorização nas mutações: apagar post/comentário só pelo autor (403),
  rotas autenticadas retornam 401 sem sessão.

## 5. Pós-deploy (verificação)

- [ ] `curl -sI https://SEU-DOMINIO | grep -iE "content-security|strict-trans|x-frame"`
  → os 3 headers devem aparecer.
- [ ] Testar login errado 6× → a 6ª deve responder **429**.
- [ ] Abrir o console do navegador nas telas principais → **zero** violações
  de CSP (o mapa dos pesqueiros é o mais sensível; ver notas no
  `next.config.js` se algo for bloqueado).
