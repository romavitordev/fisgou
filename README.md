# Fisgou

Fisgou é uma aplicação web de comunidade para pescadores, pensada como uma rede social focada em experiências de pesca, descoberta de pesqueiros, coleção de espécies e interação entre pescadores, vendedores e equipe de moderação.

## Visão geral do projeto

O produto já reúne:
- feed social com publicação, interação e notificações;
- coleção gamificada de espécies (“Fisgados”);
- pesqueiros com check-in e geolocalização;
- chat com conversas privadas, grupos e conversas com pesqueiros;
- painéis de gestão para vendedores e moderadores.

A implementação atual está em um monorepo pnpm com uma aplicação principal em [apps/web](apps/web) e tipos compartilhados em [packages/shared](packages/shared).

## Por que este projeto existe

Fisgou nasceu para unir três mundos que normalmente estão separados: a experiência prática da pesca, a descoberta de locais e a comunidade social em torno dela. O objetivo é transformar o hábito de pescar em uma experiência mais compartilhada, registrável e relevante para quem gosta de explorar, aprender e se conectar.

## Proposta de valor

- Para pescadores: registrar experiências, compartilhar capturas, descobrir novos pesqueiros e construir uma identidade dentro da comunidade.
- Para criadores de conteúdo: transformar audiência em comunidade, monetizar presença e criar conteúdo exclusivo para fãs e assinantes.
- Para vendedores e lojas: dar visibilidade aos pesqueiros e negócios, ampliar o alcance e vender produtos e insumos diretamente dentro do ecossistema.
- Para a operação do produto: organizar a comunidade, reduzir ruído e permitir uma moderação mais clara e eficiente.

## Valor para cada público

- Pescador: mais descoberta, mais interação e mais sentido para cada saída de pesca.
- Criador de conteúdo: mais alcance, engajamento, receita e conexão com uma audiência apaixonada por pesca.
- Vendedor: mais presença digital, mais tráfego qualificado e melhor relacionamento com a comunidade.
- Moderador: mais controle sobre conteúdo, mais organização e mais confiança no ecossistema.

## Status atual (2026-07-18)

O projeto está em uma fase funcional de produto, com o núcleo do app já operando e com uma camada de moderação estruturada.

### O que já pode fazer hoje

- cadastrar e entrar na plataforma;
- criar publicações com foto ou enquete;
- curtir, comentar, responder comentários e seguir usuários;
- editar perfil com foto, capa, bio, cidade, cor de destaque e virar criador;
- navegar pelo feed e visualizar publicações de outros usuários;
- registrar espécies na coleção “Fisgados”;
- visualizar pesqueiros, filtrar por cidade e localizar pesqueiros próximos;
- fazer check-in em pesqueiros;
- trocar mensagens em DM, grupos e conversas com pesqueiros;
- usar painéis específicos para vendedor e moderador.

### O que ainda será entregue posteriormente

- mídia múltipla no post (imagem + vídeo + carrossel);
- menções por `@` na legenda;
- compartilhamento para chats internos e para fora do app;
- reels curtos;
- marketplace de lojas parceiras;
- área de membros do criador;
- evolução para armazenamento externo, Postgres e tempo real.

## Perfis de usuário

### 1) Pescador
O pescador é o usuário principal da comunidade.

O que ele pode fazer hoje:
- criar conta e fazer login;
- publicar conteúdo com legenda e opcionalmente espécie, pesqueiro e amigos marcados;
- curtir e comentar em posts;
- seguir e deixar de seguir outros pescadores;
- receber notificações por ações relevantes;
- explorar o feed e descobrir conteúdo novo;
- participar da coleção “Fisgados”;
- fazer check-in em pesqueiros;
- conversar com outros usuários ou com pesqueiros.

O que será importante para ele no futuro:
- publicar vídeos curtos e múltiplas mídias;
- usar menções automáticas por `@`;
- compartilhar conteúdos com mais facilidade;
- ter mais relevância em recomendações e descoberta.

### 2) Criador de conteúdo
O criador de conteúdo é um perfil voltado para quem produz conteúdo relevante sobre pesca, técnicas, jornadas, reviews e bastidores do universo da pesca.

O que ele poderá fazer no futuro:
- publicar conteúdos de pesqueiros, lojas, produtos e experiências;
- criar vídeos curtos e lives com interação direta;
- receber doações e engajamento de seguidores;
- produzir conteúdo exclusivo para assinantes em uma área de membros;
- fortalecer sua presença dentro do ecossistema da pesca.

### 3) Vendedor
O vendedor representa um dono de pesqueiro ou negócio associado ao ecossistema.

O que ele pode fazer hoje:
- se cadastrar com papel de vendedor;
- administrar um ou mais pesqueiros no painel;
- editar dados do pesqueiro, como descrição, cidade, endereço, coordenadas e capa;
- acompanhar check-ins, visitantes e publicações relacionadas ao pesqueiro;
- visualizar atividade recente do local.

O que será importante para ele no futuro:
- publicar conteúdos próprios de pesqueiro e loja;
- vender produtos, iscas, equipamentos e outros itens por meio de marketplace;
- aproveitar vídeos curtos, lives e conteúdo exclusivo para atrair mais audiência;
- ter mais ferramentas de gestão e divulgação;
- integrar lojas parceiras e catálogo de produtos;
- ampliar o relacionamento com a comunidade por meio de chat e conteúdo.

### 4) Moderador
O moderador é um papel da equipe Fisgou, não disponível no cadastro comum.

O que ele pode fazer hoje:
- acessar o painel de moderação;
- revisar capturas em análise;
- aprovar ou recusar verificações de espécies;
- remover publicações mal-intencionadas;
- visualizar a fila de verificações pendentes nas notificações.

O que será importante para ele no futuro:
- buscar posts por palavras-chave;
- filtrar e triagem mais avançada;
- remover comentários, suspender usuários e acompanhar logs de ação.

## Funcionalidades principais do produto

### Social
- feed com timeline de publicações;
- curtidas e comentários;
- respostas em comentários;
- seguidores e relações sociais;
- notificações por polling;
- busca por pescadores, espécies e pesqueiros.

### Conteúdo
- publicação com foto ou enquete;
- marcação de espécie;
- marcação de pesqueiro;
- marcação de amigos;
- status de captura para verificação;
- futuro suporte a vídeos curtos, lives, conteúdo exclusivo e publicação de lojas e pesqueiros.

### Coleção e pesca
- coleção de espécies capturadas e ainda não capturadas;
- raridade e status de verificação;
- pesqueiros com check-in e presença real.

### Chat e comunicação
- DM entre usuários;
- grupos de conversa;
- conversas com pesqueiros;
- “Combinar Pescaria” com evento e local;
- dock flutuante de conversas no desktop.

### Administração
- painel do vendedor;
- painel de moderação;
- fila de verificações pendentes;
- futuro marketplace para lojas parceiras, doações em lives e área de membros com conteúdo exclusivo.

## Arquitetura e stack

- frontend: Next.js 14, React, TypeScript e Tailwind;
- backend: rotas de API do próprio Next.js com Prisma;
- banco: SQLite em desenvolvimento;
- autenticação: e-mail/senha com sessão e cookies httpOnly;
- tipos compartilhados: [packages/shared](packages/shared).

## Requisitos

- Node.js 18+
- pnpm

## Como rodar localmente

```powershell
cd e:\fisgou-main
pnpm install
copy apps\web\.env.example apps\web\.env
```

### Scripts úteis

```powershell
pnpm run up         # inicia com banco limpo e login rápido
pnpm run up:empty   # mesmo fluxo do modo empty
pnpm run up:demo    # inicia com conteúdo de exemplo
```

### Credenciais de exemplo

- Modo `empty`: `admin@gmail.com` / `admin123`
- Modo `demo`: `marina.pesca@fisgou.app` / `fisgou123`

Depois, abra http://localhost:3000.

## Variáveis de ambiente

A base está em [apps/web/.env.example](apps/web/.env.example):

- `DATABASE_URL` — SQLite local em dev
- `AUTH_SECRET` — segredo da sessão JWT
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — opcional

## Banco de dados

```powershell
pnpm --filter @fisgou/web db:reset
pnpm --filter @fisgou/web exec prisma studio
```

## Roadmap e próximos passos

A lista detalhada está em [TODO.md](TODO.md). As prioridades mais imediatas são:

1. correções de chat e UX no composer;
2. melhorias de moderação e triagem;
3. notificações sociais e compartilhamento;
4. reels, marketplace e área de membros (mock);
5. composer com mídia múltipla e menções por `@`.

## Observação

Esta cópia do projeto não está vinculada a um repositório Git no momento; isso pode precisar ser ajustado antes de automatizar commits ou deploys.
