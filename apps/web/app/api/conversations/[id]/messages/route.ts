import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";
import { toMessage } from "@/lib/dto";

export const dynamic = "force-dynamic";

const MAX = 2000;

/** Confere que o usuário é membro; devolve a membership ou null. */
async function membership(convId: string, userId: string) {
  return prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId: convId, userId } },
  });
}

/**
 * Mensagens da conversa. `?after=<iso>` traz só as posteriores (polling).
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  if (!(await membership(params.id, me.id)))
    return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });

  const after = new URL(req.url).searchParams.get("after");
  const afterDate = after ? new Date(after) : null;

  const mensagens = await prisma.message.findMany({
    where: {
      conversationId: params.id,
      ...(afterDate && !Number.isNaN(afterDate.getTime())
        ? { criadoEm: { gt: afterDate } }
        : {}),
    },
    orderBy: { criadoEm: "asc" },
    include: { autor: true },
    take: 200,
  });

  return NextResponse.json({ mensagens: mensagens.map((m) => toMessage(m, me.id)) });
}

/** Envia uma mensagem. Body: { texto }. */
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  if (!(await membership(params.id, me.id)))
    return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const texto = typeof body.texto === "string" ? body.texto.trim() : "";
  if (!texto)
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  if (texto.length > MAX)
    return NextResponse.json({ error: "Mensagem muito longa." }, { status: 400 });

  const msg = await prisma.message.create({
    data: { conversationId: params.id, autorId: me.id, texto },
    include: { autor: true },
  });

  // Sobe a conversa no topo e marca como lida pra quem enviou.
  await Promise.all([
    prisma.conversation.update({
      where: { id: params.id },
      data: { atualizadoEm: new Date() },
    }),
    prisma.conversationMember.update({
      where: { conversationId_userId: { conversationId: params.id, userId: me.id } },
      data: { lastReadAt: new Date() },
    }),
  ]);

  return NextResponse.json({ mensagem: toMessage(msg, me.id) }, { status: 201 });
}
