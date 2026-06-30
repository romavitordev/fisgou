import type {
  User,
  Species,
  CollectionEntry,
  Post,
  Badge,
  Pesqueiro,
  Comment,
  Notification,
} from "@fisgou/shared";

/**
 * Mock data do Fisgou.
 *
 * Tudo aqui é estático e roda no front. Quando a API existir
 * (apps/api), estas funções viram fetchs para NEXT_PUBLIC_API_URL,
 * mantendo os mesmos tipos de @fisgou/shared.
 */

// ── Usuário atual (criador) ─────────────────────────────────────────
export const currentUser: User = {
  id: "u1",
  nome: "Marina Tavares",
  handle: "marina.pesca",
  cidade: "São Carlos, SP",
  bio: "Bióloga e pescadora esportiva. Pesca com soltura sempre. 🎣 Caçando o dourado dos sonhos.",
  cor: "#14916B",
  iniciais: "MT",
  criador: true,
  // Criador usa seguidores/seguindo.
  stats: { peixes: 142, especies: 37, seguidores: 1240, seguindo: 86 },
};

const rafael: User = {
  id: "u2",
  nome: "Rafael Lima",
  handle: "rafa.fisgou",
  cidade: "Ribeirão Preto, SP",
  bio: "Represa é meu segundo endereço. Fim de semana é dia de linha na água.",
  cor: "#2D7DD2",
  iniciais: "RL",
  criador: true,
  stats: { peixes: 98, especies: 24, seguidores: 320, seguindo: 140 },
};

const bia: User = {
  id: "u3",
  nome: "Bia Nogueira",
  handle: "bia.iscaviva",
  cidade: "Ubatuba, SP",
  bio: "Pesca de praia e costão. Apaixonada por água salgada.",
  cor: "#7C5CD6",
  iniciais: "BN",
  // Usuária comum: modelo de amigos.
  stats: { peixes: 211, especies: 44, amigos: 130 },
};

const caio: User = {
  id: "u4",
  nome: "Caio Mendes",
  handle: "caio.varadura",
  cidade: "Avaré, SP",
  bio: "Iniciante animado. Toda fisgada é uma vitória.",
  cor: "#E0A11A",
  iniciais: "CM",
  stats: { peixes: 63, especies: 19, amigos: 38 },
};

export const friends: User[] = [rafael, bia, caio];

/** Todos os usuários conhecidos (para resolver perfis por handle). */
export const users: User[] = [currentUser, rafael, bia, caio];

export const userByHandle = (handle: string) =>
  users.find((u) => u.handle === handle);

/** Handles que o usuário atual já segue (estado inicial de follow). */
export const followingHandles = new Set<string>(["rafa.fisgou", "bia.iscaviva"]);

// ── Espécies (12, cobrindo 4 raridades e água doce/salgada) ─────────
export const species: Species[] = [
  {
    id: "s1",
    nome: "Tilápia",
    nomeCientifico: "Oreochromis niloticus",
    raridade: "comum",
    agua: "doce",
    cor: "#BFD8C6",
  },
  {
    id: "s2",
    nome: "Lambari",
    nomeCientifico: "Astyanax lacustris",
    raridade: "comum",
    agua: "doce",
    cor: "#CFE0D2",
  },
  {
    id: "s3",
    nome: "Tucunaré-açu",
    nomeCientifico: "Cichla temensis",
    raridade: "raro",
    agua: "doce",
    cor: "#A9C7D6",
  },
  {
    id: "s4",
    nome: "Pacu",
    nomeCientifico: "Piaractus mesopotamicus",
    raridade: "incomum",
    agua: "doce",
    cor: "#C3CFB6",
  },
  {
    id: "s5",
    nome: "Traíra",
    nomeCientifico: "Hoplias malabaricus",
    raridade: "incomum",
    agua: "doce",
    cor: "#B7C4D2",
  },
  {
    id: "s6",
    nome: "Dourado",
    nomeCientifico: "Salminus brasiliensis",
    raridade: "lendario",
    agua: "doce",
    cor: "#E7D2A0",
  },
  {
    id: "s7",
    nome: "Tambaqui",
    nomeCientifico: "Colossoma macropomum",
    raridade: "incomum",
    agua: "doce",
    cor: "#BDD3C7",
  },
  {
    id: "s8",
    nome: "Pintado",
    nomeCientifico: "Pseudoplatystoma corruscans",
    raridade: "raro",
    agua: "doce",
    cor: "#C9C3E0",
  },
  {
    id: "s9",
    nome: "Robalo",
    nomeCientifico: "Centropomus undecimalis",
    raridade: "incomum",
    agua: "salgada",
    cor: "#AFC8D6",
  },
  {
    id: "s10",
    nome: "Garoupa",
    nomeCientifico: "Epinephelus marginatus",
    raridade: "raro",
    agua: "salgada",
    cor: "#D6C7A6",
  },
  {
    id: "s11",
    nome: "Sardinha",
    nomeCientifico: "Sardinella brasiliensis",
    raridade: "comum",
    agua: "salgada",
    cor: "#C2D4CC",
  },
  {
    id: "s12",
    nome: "Marlim-azul",
    nomeCientifico: "Makaira nigricans",
    raridade: "lendario",
    agua: "salgada",
    cor: "#A7BBD0",
  },
];

const byId = (id: string) => species.find((s) => s.id === id)!;

// ── Coleção "Fisgados" do usuário (estados mistos) ──────────────────
export const collection: CollectionEntry[] = [
  { species: byId("s1"), status: "verificado", capturadoEm: "2026-05-02" },
  { species: byId("s3"), status: "verificado", capturadoEm: "2026-05-21" },
  { species: byId("s2"), status: "nao_verificado", capturadoEm: "2026-04-18" },
  { species: byId("s5"), status: "verificado", capturadoEm: "2026-03-30" },
  { species: byId("s4"), status: "nao_verificado", capturadoEm: "2026-06-01" },
  { species: byId("s6"), status: "em_analise", capturadoEm: "2026-06-20" },
  { species: byId("s7"), status: "verificado", capturadoEm: "2026-02-11" },
  { species: byId("s8"), status: "verificado", capturadoEm: "2026-01-09" },
  { species: byId("s9"), status: "nao_verificado", capturadoEm: "2026-05-15" },
  // s10, s11, s12 ainda bloqueadas (não capturadas) — viram LockedSpeciesCard.
];

/** Espécies ainda não capturadas (cards bloqueados na grade). */
export const lockedSpeciesIds = ["s10", "s11", "s12"];

/** Progresso da coleção. */
export const collectionProgress = {
  total: 100,
  capturadas: currentUser.stats.especies, // 37
};

// ── Posts (feed) ────────────────────────────────────────────────────
export const posts: Post[] = [
  {
    id: "p0",
    autor: currentUser,
    criadoEm: "2026-06-28T18:20:00-03:00",
    imagemCor: "#BDD3C7",
    legenda:
      "Tambaqui marcado e devolvido. Pesca com soltura é o que mantém o rio vivo. 🌿",
    especie: byId("s7"),
    status: "verificado",
    curtidas: 203,
    comentarios: 18,
    localPrivacidade: "aproximado",
  },
  {
    id: "p1",
    autor: rafael,
    criadoEm: "2026-06-28T07:10:00-03:00",
    imagemCor: "#9DBFAE",
    legenda:
      "Acordei 5h e valeu cada minuto. Represa espelhada, sem vento, só o barulho da linha.",
    especie: byId("s3"),
    status: "verificado",
    curtidas: 128,
    comentarios: 14,
    localPrivacidade: "aproximado",
  },
  {
    id: "p2",
    autor: bia,
    criadoEm: "2026-06-27T19:40:00-03:00",
    imagemCor: "#D8C7A0",
    // Receita: post SEM espécie marcada.
    legenda:
      "Robalo na crosta de ervas com limão-siciliano. Receita da vó, atualizada. Fica pra próxima fisgada 🐟🍋",
    curtidas: 64,
    comentarios: 9,
  },
  {
    id: "p3",
    autor: caio,
    criadoEm: "2026-06-27T06:05:00-03:00",
    imagemCor: "#C9C3E0",
    legenda:
      "Acho que finalmente fisguei um pintado de verdade. Mandei pra verificação, cruzem os dedos!",
    especie: byId("s8"),
    status: "em_analise",
    curtidas: 47,
    comentarios: 22,
    localPrivacidade: "oculto",
  },
  {
    id: "p4",
    autor: currentUser,
    criadoEm: "2026-06-22T09:30:00-03:00",
    imagemCor: "#A9C7D6",
    legenda:
      "Manhã de tucunaré no reservatório. Esse bateu na isca de superfície que foi um espetáculo.",
    especie: byId("s3"),
    status: "verificado",
    curtidas: 312,
    comentarios: 27,
    localPrivacidade: "aproximado",
  },
];

export const postById = (id: string) => posts.find((p) => p.id === id);

/** Publicações de um usuário (aba "Publicações" do perfil). */
export const postsByUser = (userId: string) =>
  posts.filter((p) => p.autor.id === userId);

// ── Comentários (página de post) ────────────────────────────────────
export const comments: Comment[] = [
  {
    id: "c1",
    postId: "p1",
    autor: bia,
    texto: "Que espelho de água! Inveja boa. 😍",
    criadoEm: "2026-06-28T07:40:00-03:00",
    curtidas: 6,
  },
  {
    id: "c2",
    postId: "p1",
    autor: caio,
    texto: "Qual isca tava usando?",
    criadoEm: "2026-06-28T08:05:00-03:00",
    curtidas: 1,
  },
  {
    id: "c3",
    postId: "p1",
    autor: currentUser,
    texto: "Top demais, Rafa! Bora marcar uma lá.",
    criadoEm: "2026-06-28T09:12:00-03:00",
    curtidas: 3,
  },
  {
    id: "c4",
    postId: "p0",
    autor: rafael,
    texto: "Isso! Soltura sempre. 👏",
    criadoEm: "2026-06-28T18:45:00-03:00",
    curtidas: 9,
  },
];

export const commentsByPost = (postId: string) =>
  comments.filter((c) => c.postId === postId);

// ── Notificações ────────────────────────────────────────────────────
export const notifications: Notification[] = [
  {
    id: "n1",
    tipo: "verificacao",
    especie: byId("s7"),
    postId: "p0",
    criadoEm: "2026-06-28T19:00:00-03:00",
    lida: false,
  },
  {
    id: "n2",
    tipo: "curtida",
    ator: bia,
    postId: "p0",
    criadoEm: "2026-06-28T18:50:00-03:00",
    lida: false,
  },
  {
    id: "n3",
    tipo: "seguidor",
    ator: caio,
    criadoEm: "2026-06-28T14:10:00-03:00",
    lida: false,
  },
  {
    id: "n4",
    tipo: "comentario",
    ator: rafael,
    postId: "p0",
    criadoEm: "2026-06-28T18:46:00-03:00",
    lida: true,
  },
  {
    id: "n5",
    tipo: "curtida",
    ator: rafael,
    postId: "p4",
    criadoEm: "2026-06-22T10:00:00-03:00",
    lida: true,
  },
];

export const unreadNotifications = () =>
  notifications.filter((n) => !n.lida).length;

// ── Insígnias ───────────────────────────────────────────────────────
export const badges: Badge[] = [
  { id: "b1", nome: "Primeira fisgada", icon: "Fish", tier: "normal" },
  { id: "b2", nome: "Recordista", icon: "Award", tier: "lendario" },
  { id: "b3", nome: "50 espécies", icon: "Star", tier: "normal" },
  { id: "b4", nome: "10 pesqueiros", icon: "MapPin", tier: "normal" },
  { id: "b5", nome: "Água salgada", icon: "Waves", tier: "normal" },
];

// ── Pesqueiros ──────────────────────────────────────────────────────
export const pesqueiros: Pesqueiro[] = [
  {
    id: "pq1",
    nome: "Represa do Jacaré",
    tipo: "represa",
    nota: 4.7,
    avaliacoes: 312,
    distanciaKm: 3.2,
    endereco: "Rod. SP-318, km 248 — São Carlos, SP",
    cor: "#9DBFAE",
    lat: -21.98,
    lng: -47.83,
  },
  {
    id: "pq2",
    nome: "Pesque-pague Bom Retiro",
    tipo: "pesque-pague",
    nota: 4.5,
    avaliacoes: 189,
    distanciaKm: 5.8,
    endereco: "Estr. do Broa, s/n — Itirapina, SP",
    cor: "#BBC79A",
    lat: -22.25,
    lng: -47.82,
  },
  {
    id: "pq3",
    nome: "Rio Sapucaí – Norte",
    tipo: "rio",
    nota: 4.8,
    avaliacoes: 76,
    distanciaKm: 12,
    endereco: "Margem norte — Luís Antônio, SP",
    cor: "#A9BBD0",
    lat: -21.55,
    lng: -47.77,
  },
  {
    id: "pq4",
    nome: "Lagoa Azul",
    tipo: "lago",
    nota: 4.3,
    avaliacoes: 240,
    distanciaKm: 8.1,
    endereco: "Cond. Lagoa Azul — Analândia, SP",
    cor: "#AFC4D2",
    lat: -22.13,
    lng: -47.66,
  },
];

export const pesqueiroById = (id: string) =>
  pesqueiros.find((p) => p.id === id);

/** Espécies comuns por pesqueiro (ids) — usado no detalhe. */
export const especiesPorPesqueiro: Record<string, string[]> = {
  pq1: ["s3", "s5", "s1", "s8"],
  pq2: ["s1", "s2", "s4", "s7"],
  pq3: ["s3", "s8", "s6"],
  pq4: ["s4", "s5", "s1"],
};

/** Amigos que pescaram em cada pesqueiro (subset, p/ avatares). */
export const amigosPorPesqueiro: Record<string, User[]> = {
  pq1: [rafael, bia, caio],
  pq2: [bia, caio],
  pq3: [rafael, bia],
  pq4: [caio, rafael, bia],
};
