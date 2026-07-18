import "server-only";
import { prisma } from "./prisma";
import { toUser, toMessage } from "./dto";
import type { ConversationSummary, ConversationDetail } from "@fisgou/shared";
import type { Prisma } from "@prisma/client";

/** Iniciais a partir de um nome ("Recanto do Lago" → "RL"). */
function iniciaisDe(nome: string) {
  const p = nome.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

const CONV_INCLUDE = {
  members: { include: { user: true } },
  pesqueiro: true,
} satisfies Prisma.ConversationInclude;

type ConvWithRel = Prisma.ConversationGetPayload<{ include: typeof CONV_INCLUDE }>;
type MessageWithAutor = Prisma.MessageGetPayload<{ include: { autor: true } }>;

/** Monta o resumo de uma conversa do ponto de vista do viewer. */
function buildSummary(
  conv: ConvWithRel,
  viewerId: string,
  ultima: MessageWithAutor | null,
  naoLidas: number,
): ConversationSummary {
  let titulo = conv.titulo ?? "Conversa";
  let cor = "#14916B";
  let iniciais = "?";
  let imagemUrl: string | undefined;
  let outroHandle: string | undefined;
  let pesqueiroId: string | undefined;

  if (conv.tipo === "pesqueiro" && conv.pesqueiro) {
    titulo = conv.pesqueiro.nome;
    cor = conv.pesqueiro.cor;
    iniciais = iniciaisDe(conv.pesqueiro.nome);
    pesqueiroId = conv.pesqueiro.id;
  } else if (conv.tipo === "grupo") {
    titulo = conv.titulo ?? "Grupo";
    iniciais = iniciaisDe(titulo);
  } else {
    const outro = conv.members.find((m) => m.userId !== viewerId)?.user;
    if (outro) {
      titulo = outro.nome;
      cor = outro.cor;
      iniciais = outro.iniciais;
      imagemUrl = outro.imagemUrl ?? undefined;
      outroHandle = outro.handle;
    }
  }

  return {
    id: conv.id,
    tipo: conv.tipo as ConversationSummary["tipo"],
    titulo,
    cor,
    iniciais,
    imagemUrl,
    outroHandle,
    pesqueiroId,
    ultimaMensagem: ultima?.texto,
    ultimaEm: (ultima?.criadoEm ?? conv.atualizadoEm).toISOString(),
    naoLidas,
    membros: conv.tipo === "grupo" ? conv.members.length : undefined,
    evento: conv.eventoData
      ? {
          data: conv.eventoData.toISOString(),
          pesqueiroId: conv.eventoPesqueiroId ?? undefined,
        }
      : undefined,
  };
}

/** Todas as conversas do viewer, mais recentes primeiro. */
export async function getConversations(
  viewerId: string,
): Promise<ConversationSummary[]> {
  const memberships = await prisma.conversationMember.findMany({
    where: { userId: viewerId },
    include: {
      conversation: {
        include: {
          ...CONV_INCLUDE,
          messages: { orderBy: { criadoEm: "desc" }, take: 1, include: { autor: true } },
        },
      },
    },
  });

  memberships.sort(
    (a, b) =>
      b.conversation.atualizadoEm.getTime() - a.conversation.atualizadoEm.getTime(),
  );

  return Promise.all(
    memberships.map(async (m) => {
      const conv = m.conversation;
      const naoLidas = await prisma.message.count({
        where: {
          conversationId: conv.id,
          autorId: { not: viewerId },
          ...(m.lastReadAt ? { criadoEm: { gt: m.lastReadAt } } : {}),
        },
      });
      return buildSummary(conv, viewerId, conv.messages[0] ?? null, naoLidas);
    }),
  );
}

/** Total de mensagens não lidas do viewer (badge da nav). */
export async function getUnreadTotal(viewerId: string): Promise<number> {
  const memberships = await prisma.conversationMember.findMany({
    where: { userId: viewerId },
    select: { conversationId: true, lastReadAt: true },
  });
  const counts = await Promise.all(
    memberships.map((m) =>
      prisma.message.count({
        where: {
          conversationId: m.conversationId,
          autorId: { not: viewerId },
          ...(m.lastReadAt ? { criadoEm: { gt: m.lastReadAt } } : {}),
        },
      }),
    ),
  );
  return counts.reduce((a, b) => a + b, 0);
}

/** Conversa aberta (só se o viewer for membro). */
export async function getConversationDetail(
  convId: string,
  viewerId: string,
): Promise<ConversationDetail | null> {
  const membership = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId: convId, userId: viewerId } },
  });
  if (!membership) return null;

  const conv = await prisma.conversation.findUnique({
    where: { id: convId },
    include: {
      ...CONV_INCLUDE,
      messages: { orderBy: { criadoEm: "asc" }, include: { autor: true } },
    },
  });
  if (!conv) return null;

  const summary = buildSummary(
    conv,
    viewerId,
    conv.messages[conv.messages.length - 1] ?? null,
    0,
  );

  // Resolve o nome do pesqueiro do evento (Combinar Pescaria), se houver.
  if (summary.evento?.pesqueiroId) {
    const pq = await prisma.pesqueiro.findUnique({
      where: { id: summary.evento.pesqueiroId },
      select: { nome: true },
    });
    if (pq) summary.evento.pesqueiroNome = pq.nome;
  }

  return {
    ...summary,
    participantes: conv.members.map((m) => toUser(m.user)),
    mensagens: conv.messages.map((m) => toMessage(m, viewerId)),
  };
}

/** Encontra (ou cria) a DM entre o viewer e outro usuário. Retorna o id. */
export async function findOrCreateDM(
  viewerId: string,
  otherId: string,
): Promise<string> {
  const existing = await prisma.conversation.findFirst({
    where: {
      tipo: "dm",
      AND: [
        { members: { some: { userId: viewerId } } },
        { members: { some: { userId: otherId } } },
      ],
    },
    select: { id: true },
  });
  if (existing) return existing.id;

  const conv = await prisma.conversation.create({
    data: {
      tipo: "dm",
      members: { create: [{ userId: viewerId }, { userId: otherId }] },
    },
  });
  return conv.id;
}

/** Encontra (ou cria) a conversa do viewer com um pesqueiro. */
export async function findOrCreatePesqueiroConversation(
  viewerId: string,
  pesqueiroId: string,
): Promise<string> {
  const existing = await prisma.conversation.findFirst({
    where: { tipo: "pesqueiro", pesqueiroId, members: { some: { userId: viewerId } } },
    select: { id: true },
  });
  if (existing) return existing.id;

  const conv = await prisma.conversation.create({
    data: {
      tipo: "pesqueiro",
      pesqueiroId,
      members: { create: [{ userId: viewerId }] },
    },
  });
  return conv.id;
}
