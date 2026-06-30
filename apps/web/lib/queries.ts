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

export async function getFeed(viewerId: string | null = null) {
  const posts = await prisma.post.findMany({
    orderBy: { criadoEm: "desc" },
    take: FEED_LIMIT,
    include: { autor: true, species: true },
  });
  const liked = await likedSet(viewerId, posts.map((p) => p.id));
  return posts.map((p) => toPost(p, liked.has(p.id)));
}

export async function getPostDetail(id: string, viewerId: string | null = null) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { autor: true, species: true },
  });
  if (!post) return null;
  const comentarios = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { criadoEm: "asc" },
    include: { autor: true },
  });
  const liked = await likedSet(viewerId, [post.id]);
  return {
    post: toPost(post, liked.has(post.id)),
    comentarios: comentarios.map(toComment),
  };
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

// ── Perfil ──────────────────────────────────────────────────────────
export async function getProfile(handle: string, viewerId: string | null) {
  const u = await prisma.user.findUnique({ where: { handle } });
  if (!u) return null;

  const postsRaw = await prisma.post.findMany({
    where: { autorId: u.id },
    orderBy: { criadoEm: "desc" },
    include: { autor: true, species: true },
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
    posts: postsRaw.map((p) => toPost(p, liked.has(p.id))),
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
  const [emAlta, candidatos] = await Promise.all([
    prisma.species.findMany({
      where: { raridade: { in: ["raro", "lendario"] } },
      take: 4,
      orderBy: { nome: "asc" },
    }),
    // Sugere outros usuários (exclui o próprio viewer).
    prisma.user.findMany({
      where: viewerId ? { id: { not: viewerId } } : undefined,
      take: 4,
      orderBy: { seguidores: "desc" },
    }),
  ]);

  // Quais desses o viewer já segue.
  const seguindo = viewerId
    ? new Set(
        (
          await prisma.follow.findMany({
            where: {
              followerId: viewerId,
              followingId: { in: candidatos.map((u) => u.id) },
            },
            select: { followingId: true },
          })
        ).map((f) => f.followingId),
      )
    : new Set<string>();

  return {
    emAlta: emAlta.map(toSpecies),
    pescadores: candidatos.map((u) => ({
      user: toUser(u),
      isFollowing: seguindo.has(u.id),
    })),
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
