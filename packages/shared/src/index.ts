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
  /** Cor do avatar placeholder (até existir upload de foto). */
  cor: string;
  iniciais: string;
  /** Selo "Criador" (âmbar). */
  criador?: boolean;
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
}

export type NotificationType =
  | "curtida"
  | "comentario"
  | "seguidor"
  | "verificacao";

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
  endereco?: string;
  /** Cor do thumb/capa placeholder. */
  cor: string;
  /** Coordenadas (para o mapa real do Google). */
  lat?: number;
  lng?: number;
}
