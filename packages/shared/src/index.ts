/**
 * @fisgou/shared — tipos de domínio do Fisgou.
 *
 * TS puro, sem build: o pacote é consumido direto pela web via
 * `transpilePackages` e poderá ser reaproveitado pela futura API
 * (Express + Prisma + PostgreSQL) sem duplicar contratos.
 */

// ── Enums de domínio ────────────────────────────────────────────────
export type Rarity = "comum" | "incomum" | "raro" | "lendario";

export type CatchStatus = "nao_verificado" | "em_analise" | "verificado";

export type LocationPrivacy = "exato" | "aproximado" | "oculto";

export type WaterType = "doce" | "salgada";

export type PesqueiroTipo =
  | "pesque-pague"
  | "represa"
  | "rio"
  | "lago"
  | "praia";

export type BadgeTier = "normal" | "lendario";

/** Papel escolhido no cadastro — define o fluxo/campos extras. */
export type UserRole = "pescador" | "vendedor";

// ── Entidades ───────────────────────────────────────────────────────

/**
 * Estatísticas resumidas exibidas no perfil.
 * Usuários comuns usam o modelo de "amigos" (mútuo). Criadores usam o
 * modelo de "seguidores"/"seguindo" (unidirecional, como IG/Twitter).
 */
export interface UserStats {
  peixes: number;
  especies: number;
  /** Modelo mútuo — usuários comuns. */
  amigos?: number;
  /** Modelo de criador — seguidores/seguindo. */
  seguidores?: number;
  seguindo?: number;
}

export interface User {
  id: string;
  nome: string;
  handle: string;
  cidade?: string;
  /** Bio curta exibida no perfil. */
  bio?: string;
  /** Foto de perfil enviada pelo usuário. */
  imagemUrl?: string;
  /** Foto de capa do perfil. */
  bannerUrl?: string;
  /** Cor de destaque escolhida (chave de paleta — ver lib/accent). */
  accent?: string;
  /** Cor do avatar placeholder (até existir upload de foto). */
  cor: string;
  iniciais: string;
  /** Selo "Criador" (âmbar). */
  criador?: boolean;
  /** Papel escolhido no cadastro. */
  role?: UserRole;
  /** Nome do negócio (só p/ role "vendedor"). */
  nomeNegocio?: string;
  stats: UserStats;
}

export interface Species {
  id: string;
  nome: string;
  nomeCientifico: string;
  raridade: Rarity;
  agua: WaterType;
  /** Cor do bloco placeholder do peixe. */
  cor: string;
}

/** Uma entrada da coleção "Fisgados" do usuário. */
export interface CollectionEntry {
  species: Species;
  status: CatchStatus;
  /** ISO date — quando foi capturado/registrado. */
  capturadoEm?: string;
}

/** Opção de enquete com contagem de votos. */
export interface PollOption {
  id: string;
  texto: string;
  votos: number;
}

/** Enquete anexada a um post (2–4 opções, 1 voto por usuário). */
export interface Poll {
  id: string;
  pergunta: string;
  options: PollOption[];
  totalVotos: number;
  /** Opção votada pelo usuário logado (preenchido nas queries). */
  votedOptionId?: string;
}

export interface Post {
  id: string;
  autor: User;
  /** ISO date. */
  criadoEm: string;
  /** Cor do bloco da imagem (placeholder quando não há foto). */
  imagemCor: string;
  /** Foto real enviada (quando existe, substitui o bloco de cor). */
  imagemUrl?: string;
  legenda: string;
  especie?: Species;
  /** Pesqueiro marcado na publicação (opcional). */
  pesqueiro?: Pesqueiro;
  /** Amigos marcados na publicação. */
  marcados?: User[];
  /** Enquete anexada (posts do tipo enquete). */
  poll?: Poll;
  status?: CatchStatus;
  curtidas: number;
  comentarios: number;
  /** Se o usuário logado já curtiu (preenchido nas queries). */
  liked?: boolean;
  localPrivacidade?: LocationPrivacy;
}

export interface Comment {
  id: string;
  postId: string;
  autor: User;
  texto: string;
  /** ISO date. */
  criadoEm: string;
  curtidas: number;
  /** Se o usuário logado já curtiu (preenchido nas queries). */
  liked?: boolean;
  /** Presente quando é resposta a outro comentário (só 1 nível). */
  parentId?: string;
}

export type NotificationType =
  | "curtida"
  | "comentario"
  | "seguidor"
  | "verificacao"
  | "verificacao_recusada"
  | "marcacao";

export interface Notification {
  id: string;
  tipo: NotificationType;
  /** Quem gerou a notificação (no caso de "verificacao", é o sistema). */
  ator?: User;
  /** Contexto opcional. */
  postId?: string;
  especie?: Species;
  /** ISO date. */
  criadoEm: string;
  lida: boolean;
}

export interface Badge {
  id: string;
  nome: string;
  /** Nome do ícone lucide-react. */
  icon: string;
  tier: BadgeTier;
}

export interface Pesqueiro {
  id: string;
  nome: string;
  tipo: PesqueiroTipo;
  /** Nota do Google (0–5). */
  nota: number;
  avaliacoes: number;
  distanciaKm: number;
  /** Cidade (para o filtro de cidade na busca). */
  cidade?: string;
  endereco?: string;
  /** Apresentação escrita pelo dono (vendedor). */
  descricao?: string;
  /** Cor do thumb/capa placeholder. */
  cor: string;
  /** Coordenadas (para o mapa real do Google). */
  lat?: number;
  lng?: number;
  /** Id do vendedor que administra o pesqueiro (se houver). */
  donoId?: string;
}

// ── Mensagens / conversas ───────────────────────────────────────────
export type ConversationTipo = "dm" | "grupo" | "pesqueiro";

export interface Message {
  id: string;
  autor: User;
  texto: string;
  criadoEm: string;
  /** true se a mensagem é do próprio viewer. */
  mine?: boolean;
}

/** Evento "Combinar Pescaria" anexado a uma conversa de grupo. */
export interface CombinarEvento {
  data: string;
  pesqueiroId?: string;
  pesqueiroNome?: string;
}

/** Resumo de uma conversa (lista de mensagens / dock). */
export interface ConversationSummary {
  id: string;
  tipo: ConversationTipo;
  /** DM: nome do outro; grupo: título; pesqueiro: nome do pesqueiro. */
  titulo: string;
  /** Avatar: cor + iniciais (ou foto). */
  cor: string;
  iniciais: string;
  imagemUrl?: string;
  /** DM: handle do outro (link do perfil). */
  outroHandle?: string;
  /** Conversa com estabelecimento. */
  pesqueiroId?: string;
  ultimaMensagem?: string;
  ultimaEm?: string;
  naoLidas: number;
  membros?: number;
  evento?: CombinarEvento;
}

/** Conversa aberta: resumo + participantes + mensagens. */
export interface ConversationDetail extends ConversationSummary {
  participantes: User[];
  mensagens: Message[];
}
