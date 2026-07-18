import "server-only";
import { prisma } from "./prisma";
import { getSessionUserId } from "./session";
import {
  toUser,
  toSpecies,
  toPost,
  toComment,
  toPesqueiro,
  toBadge,
  toCollectionEntry,
  toNotification,
} from "./dto";
import type { User } from "@fisgou/shared";

const COLLECTION_TOTAL = 100;

/** Usuário logado (DTO) ou null. */
export async function getViewer(): Promise<User | null> {
  const uid = await getSessionUserId();
  if (!uid) return null;
  const u = await prisma.user.findUnique({ where: { id: uid } });
  return u ? toUser(u) : null;
}

/** Conjunto de postIds curtidos pelo viewer (p/ marcar o coração). */
async function likedSet(viewerId: string | null, postIds: string[]) {
  if (!viewerId || postIds.length === 0) return new Set<string>();
  const likes = await prisma.like.findMany({
    where: { userId: viewerId, postId: { in: postIds } },
    select: { postId: true },
  });
  return new Set(likes.map((l) => l.postId));
}

// ── Feed / posts ────────────────────────────────────────────────────
const FEED_LIMIT = 50;

/** Include padrão de post (autor, espécie, pesqueiro, marcados, enquete). */
const POST_INCLUDE = {
  autor: true,
  species: true,
  pesqueiro: true,
  marcados: { include: { user: true } },
  poll: {
    include: {
      options: { include: { votes: { select: { id: true } } } },
      votes: true,
    },
  },
} as const;

export async function getFeed(viewerId: string | null = null) {
  const posts = await prisma.post.findMany({
    orderBy: { criadoEm: "desc" },
    take: FEED_LIMIT,
    include: POST_INCLUDE,
  });
  const liked = await likedSet(viewerId, posts.map((p) => p.id));
  return posts.map((p) => toPost(p, liked.has(p.id), viewerId));
}

/** Conjunto de commentIds curtidos pelo viewer. */
async function commentLikedSet(viewerId: string | null, commentIds: string[]) {
  if (!viewerId || commentIds.length === 0) return new Set<string>();
  const likes = await prisma.commentLike.findMany({
    where: { userId: viewerId, commentId: { in: commentIds } },
    select: { commentId: true },
  });
  return new Set(likes.map((l) => l.commentId));
}

export async function getPostDetail(id: string, viewerId: string | null = null) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: POST_INCLUDE,
  });
  if (!post) return null;
  const comentarios = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { criadoEm: "asc" },
    include: { autor: true },
  });
  const liked = await likedSet(viewerId, [post.id]);
  const commentsLiked = await commentLikedSet(viewerId, comentarios.map((c) => c.id));
  return {
    post: toPost(post, liked.has(post.id), viewerId),
    comentarios: comentarios.map((c) => toComment(c, commentsLiked.has(c.id))),
  };
}

/** Usuários que `userId` segue (para marcar amigos numa publicação). */
export async function getFollowing(userId: string): Promise<User[]> {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: true },
    orderBy: { following: { nome: "asc" } },
  });
  return follows.map((f) => toUser(f.following));
}

// ── Espécies / coleção ──────────────────────────────────────────────
export async function getSpeciesList() {
  const list = await prisma.species.findMany({ orderBy: { nome: "asc" } });
  return list.map(toSpecies);
}

export async function getCollectionData(userId: string) {
  const entries = await prisma.collectionEntry.findMany({
    where: { userId },
    include: { species: true },
  });
  const ownedIds = entries.map((e) => e.speciesId);
  const locked = await prisma.species.findMany({
    where: { id: { notIn: ownedIds } },
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return {
    entries: entries.map(toCollectionEntry),
    locked: locked.map(toSpecies),
    capturadas: user?.especies ?? entries.length,
    total: COLLECTION_TOTAL,
  };
}

// ── Pesqueiros ──────────────────────────────────────────────────────
export async function getPesqueiros() {
  const list = await prisma.pesqueiro.findMany({ orderBy: { distanciaKm: "asc" } });
  return list.map(toPesqueiro);
}

export async function getPesqueiroDetail(id: string, viewerId: string | null = null) {
  const p = await prisma.pesqueiro.findUnique({ where: { id } });
  if (!p) return null;

  // Espécies comuns: amostra do banco (sem mapa curado no schema).
  const especies = await prisma.species.findMany({ take: 4, orderBy: { nome: "asc" } });

  // Amigos que pescaram aqui = check-ins reais (mais recentes, sem repetir usuário).
  const checkIns = await prisma.checkIn.findMany({
    where: { pesqueiroId: id },
    orderBy: { criadoEm: "desc" },
    include: { user: true },
    take: 30,
  });
  const vistos = new Set<string>();
  const amigos = [];
  for (const c of checkIns) {
    if (vistos.has(c.userId)) continue;
    vistos.add(c.userId);
    amigos.push(c.user);
    if (amigos.length >= 6) break;
  }

  const totalCheckIns = await prisma.checkIn.count({ where: { pesqueiroId: id } });
  const meuCheckIn = viewerId
    ? !!(await prisma.checkIn.findFirst({ where: { pesqueiroId: id, userId: viewerId } }))
    : false;

  return {
    pesqueiro: toPesqueiro(p),
    especies: especies.map(toSpecies),
    amigos: amigos.map(toUser),
    totalCheckIns,
    jaFezCheckIn: meuCheckIn,
  };
}

export async function getPesqueiroIds() {
  const list = await prisma.pesqueiro.findMany({ select: { id: true } });
  return list.map((p) => p.id);
}

// ── Painel do vendedor ──────────────────────────────────────────────
/**
 * Pesqueiros administrados por `userId` (vendedor) + estatísticas de
 * engajamento (check-ins, visitantes únicos, publicações que marcam o
 * local) e atividade recente. Alimenta a tela /painel.
 */
export async function getPainelData(userId: string) {
  const pesqueiros = await prisma.pesqueiro.findMany({
    where: { donoId: userId },
    orderBy: { nome: "asc" },
  });

  return Promise.all(
    pesqueiros.map(async (p) => {
      const [totalCheckIns, visitantes, checkIns, totalPosts, posts] =
        await Promise.all([
          prisma.checkIn.count({ where: { pesqueiroId: p.id } }),
          prisma.checkIn.findMany({
            where: { pesqueiroId: p.id },
            select: { userId: true },
            distinct: ["userId"],
          }),
          prisma.checkIn.findMany({
            where: { pesqueiroId: p.id },
            orderBy: { criadoEm: "desc" },
            include: { user: true },
            take: 8,
          }),
          prisma.post.count({ where: { pesqueiroId: p.id } }),
          prisma.post.findMany({
            where: { pesqueiroId: p.id },
            orderBy: { criadoEm: "desc" },
            take: 6,
            include: { autor: true, species: true },
          }),
        ]);

      return {
        pesqueiro: toPesqueiro(p),
        totalCheckIns,
        visitantesUnicos: visitantes.length,
        totalPosts,
        checkInsRecentes: checkIns.map((c) => ({
          user: toUser(c.user),
          criadoEm: c.criadoEm.toISOString(),
        })),
        postsRecentes: posts.map((post) => toPost(post, false, userId)),
      };
    }),
  );
}

export type PainelPesqueiro = Awaited<ReturnType<typeof getPainelData>>[number];

// ── Moderação (equipe Fisgou) ───────────────────────────────────────
/**
 * TODAS as capturas aguardando verificação (posts "em análise" com
 * espécie), com ou sem pesqueiro marcado. Fila do painel de moderação —
 * o moderador avalia se a foto é real, se a espécie confere e se ela
 * existe naquela região/pesqueiro.
 */
export async function getCapturasPendentes() {
  const posts = await prisma.post.findMany({
    where: { status: "em_analise", speciesId: { not: null } },
    orderBy: { criadoEm: "desc" },
    include: { autor: true, species: true, pesqueiro: true },
    take: 50,
  });
  return posts.map((p) => toPost(p));
}

/** Contagem da fila (bloco "Verificações pendentes" nas notificações). */
export async function getCapturasPendentesCount() {
  return prisma.post.count({
    where: { status: "em_analise", speciesId: { not: null } },
  });
}

/** Publicações recentes para triagem de conteúdo mal-intencionado. */
export async function getPostsParaModeracao() {
  const posts = await prisma.post.findMany({
    orderBy: { criadoEm: "desc" },
    include: { autor: true, species: true, pesqueiro: true },
    take: 30,
  });
  return posts.map((p) => toPost(p));
}

// ── Perfil ──────────────────────────────────────────────────────────
export async function getProfile(handle: string, viewerId: string | null) {
  const u = await prisma.user.findUnique({ where: { handle } });
  if (!u) return null;

  const postsRaw = await prisma.post.findMany({
    where: { autorId: u.id },
    orderBy: { criadoEm: "desc" },
    include: POST_INCLUDE,
  });
  const liked = await likedSet(viewerId, postsRaw.map((p) => p.id));
  const col = await getCollectionData(u.id);
  const badges = (await prisma.badge.findMany({ orderBy: { ordem: "asc" } })).map(toBadge);

  let isFollowing = false;
  if (viewerId && viewerId !== u.id) {
    isFollowing = !!(await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: viewerId, followingId: u.id } },
    }));
  }

  return {
    user: toUser(u),
    posts: postsRaw.map((p) => toPost(p, liked.has(p.id), viewerId)),
    collection: col,
    badges,
    isFollowing,
    isMe: viewerId === u.id,
  };
}

// ── Notificações ────────────────────────────────────────────────────
export async function getNotifications(userId: string) {
  const list = await prisma.notification.findMany({
    where: { recipientId: userId },
    orderBy: { criadoEm: "desc" },
    include: { actor: true, species: true },
  });
  return list.map(toNotification);
}

// ── Right rail (desktop) ────────────────────────────────────────────
export async function getRailData(viewerId: string | null = null) {
  // Recomendados relevantes (C2): os MAIS PRÓXIMOS (mesma cidade do
  // viewer) primeiro e, dentro de cada grupo, os MAIS FAMOSOS (mais
  // seguidores/amigos). Nunca sugere quem o viewer já segue.
  const [viewer, jaSigo] = viewerId
    ? await Promise.all([
        prisma.user.findUnique({
          where: { id: viewerId },
          select: { cidade: true },
        }),
        prisma.follow.findMany({
          where: { followerId: viewerId },
          select: { followingId: true },
        }),
      ])
    : [null, [] as { followingId: string }[]];

  const [emAlta, candidatos] = await Promise.all([
    prisma.species.findMany({
      where: { raridade: { in: ["raro", "lendario"] } },
      take: 4,
      orderBy: { nome: "asc" },
    }),
    prisma.user.findMany({
      where: viewerId
        ? { id: { notIn: [viewerId, ...jaSigo.map((f) => f.followingId)] } }
        : undefined,
      // Fama = seguidores (criadores) e amigos (usuários comuns); nulls
      // por último pra não flutuarem no desc do SQLite.
      orderBy: [
        { seguidores: { sort: "desc", nulls: "last" } },
        { amigos: { sort: "desc", nulls: "last" } },
      ],
      take: 12,
    }),
  ]);

  // Mesma cidade sobe pro topo (sort estável preserva a ordem de fama).
  const cidade = viewer?.cidade?.trim().toLowerCase();
  const ranqueados = cidade
    ? [...candidatos].sort(
        (a, b) =>
          Number((b.cidade ?? "").trim().toLowerCase() === cidade) -
          Number((a.cidade ?? "").trim().toLowerCase() === cidade),
      )
    : candidatos;

  return {
    emAlta: emAlta.map(toSpecies),
    // Quem já é seguido foi excluído da query — isFollowing sempre false.
    pescadores: ranqueados
      .slice(0, 4)
      .map((u) => ({ user: toUser(u), isFollowing: false })),
  };
}

// ── Busca ───────────────────────────────────────────────────────────
export async function getSearchData() {
  const [users, species, pesqueiros] = await Promise.all([
    prisma.user.findMany({ orderBy: { nome: "asc" } }),
    prisma.species.findMany({ orderBy: { nome: "asc" } }),
    prisma.pesqueiro.findMany({ orderBy: { distanciaKm: "asc" } }),
  ]);
  return {
    users: users.map(toUser),
    species: species.map(toSpecies),
    pesqueiros: pesqueiros.map(toPesqueiro),
  };
}
