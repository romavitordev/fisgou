# Fisgou — TODO & Roadmap

Atualização: 18/07/2026. Marcação: ✅ feito · 🟡 parcial · ⬜ pendente.

---

## Status geral

- ✅ Rodada 1 do produto: entregue
- ✅ Moderação: estruturada e funcional
- 🟡 Rodada 2: correções de UX, social e composer ainda pendem

## Análise completa do código atual

### 1) Domínio do produto
O Fisgou é uma rede social de pescadores com três eixos principais:
- social: feed, perfil, seguidores, comentários, curtidas e notificações;
- pesca: coleção de espécies, verificação de capturas e pesqueiros com check-in;
- operação: chat, painel do vendedor e painel de moderação.

O modelo de dados já cobre publicação, interação social, coleção, pesqueiros, verificação, chat e notificações.

### 2) Perfis de usuário implementados

#### Pescador
- cadastra-se com papel `pescador`;
- cria posts, curte, comenta, segue pessoas e acompanha o feed;
- participa da coleção “Fisgados” e pode marcar espécies em publicações;
- pode fazer check-in em pesqueiros;
- pode trocar mensagens com outros usuários e com pesqueiros.

#### Vendedor
- cadastra-se com papel `vendedor`;
- pode administrar pesqueiros próprios via painel (`/painel`);
- cadastra/edita pesqueiros com descrição, cidade, endereço, coordenadas e capa;
- acompanha check-ins, visitantes e publicações do pesqueiro;
- pode ter o papel destacado no perfil e no menu de navegação.

#### Moderador
- papel reservado à equipe Fisgou, não disponível no cadastro;
- acessa `/moderacao`;
- verifica capturas em análise;
- remove publicações mal-intencionadas;
- vê fila de verificações pendentes nas notificações.
- Cadastra novos peixes disponiveis no catalogo (terá um banco de dados só com os peixes brasileiros futuramente)

### 3) Funcionalidades já implementadas

#### Social
- cadastro e login com sessão autenticada;
- feed com posts, curtidas, comentários e respostas em 1 nível;
- perfil editável com foto, banner, bio, cidade, cor de destaque e opção de virar criador;
- seguir/deixar de seguir;
- notificações por ação (curtir, comentar, seguir, marcar, verificação);
- busca com foco em pescadores, espécies e pesqueiros.

#### Conteúdo e publicação
- criação de post com legenda, imagem opcional, espécie, pesqueiro e amigos marcados;
- posts podem ser do tipo foto ou enquete;
- enquete com 2–4 opções, voto único por usuário e atualização otimista;
- status de captura (`nao_verificado`, `em_analise`, `verificado`).

#### Coleção e pesca
- coleção “Fisgados” com espécies capturadas e bloqueadas;
- status de verificação da captura;
- check-in real em pesqueiros;
- pesqueiros com lista, filtro por cidade e geolocalização/raio.

#### Chat e mensagens
- conversas DM, grupo e pesqueiro;
- mensagens com polling incremental;
- leitura de mensagens e badge de não lidas;
- “Combinar Pescaria” com evento e card no topo da conversa;
- dock flutuante de conversas no desktop.
- line break nas mensagens, mensagens longas estão se extendendo horizontalmente para fora do chat.

#### Administração
- painel de vendedor;
- painel de moderação;
- fila de verificações pendentes;
- remoção de posts por moderador.

### 4) Regras de negócio observadas no código
- usuários comuns usam o modelo de “amigos” (mútuo), enquanto criadores usam “seguidores/seguindo”;
- a verificação de captura é tratada como fluxo de moderação e não mais como atributo do vendedor;
- posts com espécie marcada podem entrar em `em_analise`;
- comentários raiz podem ter respostas, mas a estrutura é de 1 nível;
- votos de enquete são únicos por usuário por poll;
- mensagens e notificações usam polling simples, não WebSocket;
- uploads são tratados localmente para o ambiente atual.

### 5) Pontos de arquitetura e evolução
- o backend está concentrado em rotas do próprio Next.js, com Prisma e SQLite em dev;
- há uma separação clara entre DTOs compartilhados e schema do banco;
- o produto já está preparado para evoluir para Postgres, storage externo e tempo real;
- a camada de tipos compartilhados em [packages/shared](packages/shared) é um bom alicerce para futura API separada.

### 6) Lacunas ainda não documentadas
- o app ainda não implementa totalmente privacidade de mensagens por perfil;
- a experiência de compartilhamento entre chats e fora do app ainda não está completa;
- a criação de conteúdo ainda não suporta mídia múltipla, vídeo ou câmera em tempo real;
- o modelo de moderação avançada ainda está limitado a verificação e remoção básica.

---

## Prioridades da rodada 2

### A. Correções imediatas
- ✅ A1. Chat: cabeçalho e teclado fixos
- ✅ A2. Lista de conversas com altura total
- ✅ A3. Enquete: pergunta acima das opções
- ✅ A4. Composer: atalhos abrem a criação no contexto certo
- ✅ A5. Contador de comentários após exclusão
- ⬜ A6. [class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-fg"] ainda tem essa logo em um dos tamanhos de tela. Deve ser substituida pela logo simplificada da fisgou original que é apenas um anzol. Pegar no site deles.

### B. Moderação e triagem
- ✅ B1. Verificação feita por moderadores
- ✅ B2. Painel de moderação com fila de verificações e remoção de posts
- ✅ B3. Bloco de verificações pendentes nas notificações
- ⬜ B4. Interface de moderação avançada com busca, filtros e logs

### C. Social e notificações
- ✅ C1. Curtida em comentário gera notificação — tipo `curtida_comentario`; notifica o dono do comentário curtido (numa resposta, o dono da resposta — nunca o dono do raiz); não notifica a si mesmo; descurtir remove a notificação. Toast + página de notificações renderizam ("X curtiu seu comentário.").
- ✅ C2. Recomendação de pescadores por relevância — "Pescadores para seguir" agora exclui quem o viewer já segue, ordena por fama (seguidores/amigos, nulls por último) e sobe quem é da MESMA CIDADE do viewer pro topo. Verificado: seguir alguém remove da lista; usuário da mesma cidade passa na frente dos famosos.
- ✅ C3. Mensagem no perfil público + privacidade de DM — botão "Mensagem" no perfil de outro usuário abre/cria a DM (dock no desktop, `/mensagens?c=` no mobile). `User.dmPrivacy` ("todos" | "amigos") com seletor "Quem pode me enviar mensagens" no editar perfil; "amigos" = seguimento mútuo, validado no `POST /api/conversations` (403 com mensagem amigável; conversa já existente continua abrindo). Verificado: bloqueio sem mútuo → erro no perfil; com mútuo → DM abre no dock.
- ⬜ C4. Compartilhar para chat interno e para fora
- 🟡 C5. Convite de "Combinar Pescaria" para o grupo de amigos — a base já existe (modal seleciona amigos + data/hora + pesqueiro → cria grupo com card do evento; ex.: 5 amigos, sábado 15:00, Pesqueiro do Zé). Falta: os convidados serem **notificados** do convite (hoje o grupo só aparece na lista de mensagens, sem aviso) e **RSVP** no card do evento (Vou / Não vou, com contagem de confirmados).

### D. Composer e criação de conteúdo
- ⬜ D1. Mídia múltipla (imagens/vídeo/carrossel)
- ⬜ D2. Menções por `@` na legenda
- ⬜ D3. Captura de foto/vídeo na hora

### E. Novas áreas (mock inicial)
- ✅ E1. Reels (mock visual) — rota `/reels` estilo TikTok: player vertical em tela cheia com scroll-snap (um vídeo por vez), tap para play/pause, barra de progresso animada, ações laterais (curtir otimista, comentários, compartilhar, contadores compactos "12,4 mil"), overlay com autor + Seguir + legenda + som (disco girando), dica "Arraste pra cima", volume mudo/ativo. Dados em `data/reels-mock.ts` (6 reels com gradiente + cena — o "vídeo" é placeholder até existir upload real). Nav: item "Reels" na Sidebar + ícone no feed mobile. Falta (funcional, próxima fase): upload/streaming de vídeo real, curtida/comentário persistidos, publicação de reel no fluxo de criação.
- ⬜ E2. Marketplace de lojas parceiras
- ⬜ E3. Área de membros do criador

### F. Pesqueiros e vendedor
- ⬜ F1. Espécies do pesqueiro no cadastro — o vendedor seleciona, ao cadastrar/editar o pesqueiro, quais **espécies podem ser encontradas** nele (multi-select do catálogo). A página pública do pesqueiro passa a mostrar as espécies reais em "Espécies comuns aqui" (hoje é uma amostra qualquer do banco) e a verificação de captura ganha contexto (a espécie declarada existe naquele pesqueiro?). Modelo: relação N:N `PesqueiroSpecies`.

---

## Ordem sugerida

1. A1–A5
2. B1–B4
3. C1–C5
4. F1
5. E1–E3
6. D1–D3

## Não-funcionais planejados

- ⬜ Migração de SQLite para Postgres
- ⬜ Storage externo para uploads
- ⬜ Tempo real verdadeiro (WebSocket/SSE)
- ⬜ Testes, CI e observabilidade
- ⬜ PWA/SEO da landing

