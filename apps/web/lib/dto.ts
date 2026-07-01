/**
 * Mapeadores Prisma → tipos de domínio (@fisgou/shared). Mantêm a UI
 * desacoplada do schema do banco.
 */
import type {
  User as PrismaUser,
  Species as PrismaSpecies,
  Post as PrismaPost,
  Comment as PrismaComment,
  Pesqueiro as PrismaPesqueiro,
  Badge as PrismaBadge,
  CollectionEntry as PrismaCollectionEntry,
  Notification as PrismaNotification,
} from "@prisma/client";
import type {
  User,
  Species,
  Post,
  Comment,
  Pesqueiro,
  Badge,
  CollectionEntry,
  Notification,
  Rarity,
  WaterType,
  CatchStatus,
  LocationPrivacy,
  PesqueiroTipo,
  BadgeTier,
  NotificationType,
  UserRole,
} from "@fisgou/shared";

export function toUser(u: PrismaUser): User {
  return {
    id: u.id,
    nome: u.nome,
    handle: u.handle,
    cidade: u.cidade ?? undefined,
    bio: u.bio ?? undefined,
    imagemUrl: u.imagemUrl ?? undefined,
    bannerUrl: u.bannerUrl ?? undefined,
    accent: u.accent ?? undefined,
    cor: u.cor,
    iniciais: u.iniciais,
    criador: u.criador,
    role: (u.role as UserRole | undefined) ?? "pescador",
    nomeNegocio: u.nomeNegocio ?? undefined,
    stats: {
      peixes: u.peixes,
      especies: u.especies,
      seguidores: u.seguidores ?? undefined,
      seguindo: u.seguindo ?? undefined,
      amigos: u.amigos ?? undefined,
    },
  };
}

export function toSpecies(s: PrismaSpecies): Species {
  return {
    id: s.id,
    nome: s.nome,
    nomeCientifico: s.nomeCientifico,
    raridade: s.raridade as Rarity,
    agua: s.agua as WaterType,
    cor: s.cor,
  };
}

export function toPost(
  p: PrismaPost & { autor: PrismaUser; species: PrismaSpecies | null },
  liked = false,
): Post {
  return {
    id: p.id,
    autor: toUser(p.autor),
    criadoEm: p.criadoEm.toISOString(),
    imagemCor: p.imagemCor,
    imagemUrl: p.imagemUrl ?? undefined,
    legenda: p.legenda,
    especie: p.species ? toSpecies(p.species) : undefined,
    status: (p.status as CatchStatus | null) ?? undefined,
    curtidas: p.curtidas,
    comentarios: p.comentarios,
    liked,
    localPrivacidade: (p.localPrivacidade as LocationPrivacy | null) ?? undefined,
  };
}

export function toComment(
  c: PrismaComment & { autor: PrismaUser },
  liked = false,
): Comment {
  return {
    id: c.id,
    postId: c.postId,
    autor: toUser(c.autor),
    texto: c.texto,
    criadoEm: c.criadoEm.toISOString(),
    curtidas: c.curtidas,
    liked,
    parentId: c.parentId ?? undefined,
  };
}

export function toPesqueiro(p: PrismaPesqueiro): Pesqueiro {
  return {
    id: p.id,
    nome: p.nome,
    tipo: p.tipo as PesqueiroTipo,
    nota: p.nota,
    avaliacoes: p.avaliacoes,
    distanciaKm: p.distanciaKm,
    endereco: p.endereco ?? undefined,
    cor: p.cor,
    lat: p.lat ?? undefined,
    lng: p.lng ?? undefined,
  };
}

export function toBadge(b: PrismaBadge): Badge {
  return { id: b.id, nome: b.nome, icon: b.icon, tier: b.tier as BadgeTier };
}

export function toCollectionEntry(
  e: PrismaCollectionEntry & { species: PrismaSpecies },
): CollectionEntry {
  return {
    species: toSpecies(e.species),
    status: e.status as CatchStatus,
    capturadoEm: e.capturadoEm?.toISOString(),
  };
}

export function toNotification(
  n: PrismaNotification & {
    actor: PrismaUser | null;
    species: PrismaSpecies | null;
  },
): Notification {
  return {
    id: n.id,
    tipo: n.tipo as NotificationType,
    ator: n.actor ? toUser(n.actor) : undefined,
    postId: n.postId ?? undefined,
    especie: n.species ? toSpecies(n.species) : undefined,
    criadoEm: n.criadoEm.toISOString(),
    lida: n.lida,
  };
}
