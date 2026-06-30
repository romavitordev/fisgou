# @fisgou/api (futuro)

Back-end do Fisgou — **ainda não implementado**. Esta pasta reserva o
terreno para a API que substituirá o mock data do front.

## Stack planejada

- **Express** (ou Fastify) + TypeScript
- **Prisma** ORM sobre **PostgreSQL**
- Reaproveita os tipos de domínio de **`@fisgou/shared`** (sem duplicar
  contratos entre front e back)
- Auth (provável JWT + OAuth Google), upload de imagens (S3/compatível)
- **Google Places API** para os pesqueiros (a tela já tem o placeholder
  de mapa e a atribuição "Locais via Google Maps")

## Como vai se encaixar

1. `apps/web` troca os imports de `data/mock.ts` por fetchs para
   `process.env.NEXT_PUBLIC_API_URL` (ver `apps/web/.env.example`).
2. O schema do Prisma espelha as interfaces de `packages/shared/src`
   (`User`, `Species`, `CollectionEntry`, `Post`, `Pesqueiro`, `Badge`).
3. Os enums (`Rarity`, `CatchStatus`, `LocationPrivacy`, `WaterType`,
   `PesqueiroTipo`) viram enums do Postgres/Prisma.

## Endpoints iniciais (rascunho)

| Método | Rota                  | Descrição                          |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/posts`              | Feed                               |
| POST   | `/posts`              | Criar publicação                   |
| GET    | `/species`            | Catálogo de espécies               |
| GET    | `/me/collection`      | Coleção "Fisgados" do usuário      |
| GET    | `/pesqueiros`         | Lista (proxy Google Places)        |
| GET    | `/pesqueiros/:id`     | Detalhe                            |
| GET    | `/me`                 | Perfil + stats + insígnias         |
