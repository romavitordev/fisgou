# Fisgou

Aplicação web de comunidade para pescadores, com feed, posts, curtidas, comentários, perfil, coleção de espécies, pesqueiros e notificações.

## Status atual

O projeto está rodando como um monorepo pnpm com:

- Frontend em Next.js 14 + React + TypeScript
- Estilização com Tailwind CSS
- Banco local SQLite via Prisma para desenvolvimento
- API integrada no próprio app web por rotas de Next.js, em vez de um backend separado
- Pacote compartilhado em packages/shared para tipos e contratos

## Estrutura do repositório

- apps/web: aplicação principal em Next.js
- apps/api: pasta reservada para uma futura API separada; no momento ainda não é o backend ativo
- packages/shared: tipos e contratos compartilhados

## Funcionalidades atuais

- Autenticação e cadastro
- Feed de posts
- Criação de posts com legenda, imagem e espécies
- Curtidas, comentários e marcações
- Enquetes em posts
- Catálogo de espécies e coleção “Fisgados”
- Perfil, seguidores e notificações
- Tela de pesqueiros com placeholder e integração futura para mapas

## Requisitos

- Node.js 18+
- pnpm

## Como rodar localmente

Na raiz do projeto:

```powershell
cd e:\fisgou-main
pnpm install
copy apps\web\.env.example apps\web\.env
```

### Inicialização padrão

```powershell
pnpm --filter @fisgou/web db:reset
pnpm dev
```

### Inicialização com scripts personalizados

```powershell
pnpm run up         # inicia o app sem posts de exemplo
pnpm run up:empty   # inicia o app sem posts de exemplo
pnpm run up:demo    # inicia o app com posts de exemplo
```

No modo `empty`, é criado um login rápido:

- Email: `admin@gmail.com`
- Senha: `admin123`

Depois, abra:

- http://localhost:3001

## Variáveis de ambiente

O app web usa o arquivo [apps/web/.env.example](apps/web/.env.example) como base. Os principais valores são:

- DATABASE_URL: para o SQLite local, o padrão é `file:./dev.db`
- AUTH_SECRET: segredo para assinar sessões JWT
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: opcional para futuras integrações de mapa

## Banco de dados

Para popular/resetar o banco local:

```powershell
pnpm --filter @fisgou/web db:reset
```

Para abrir o Prisma Studio:

```powershell
pnpm --filter @fisgou/web exec prisma studio
```

## Fluxo de posts

A criação e leitura de posts já funciona pelo app web, com backend em rotas Next.js em [apps/web/app/api/posts/route.ts](apps/web/app/api/posts/route.ts) e modelo Prisma em [apps/web/prisma/schema.prisma](apps/web/prisma/schema.prisma).

## Observação

A pasta [apps/api](apps/api) ainda não representa um backend separado ativo. O sistema atual já está operacional via Next.js e Prisma no app web.
