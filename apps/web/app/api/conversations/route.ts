import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";
import {
  getConversations,
  findOrCreateDM,
  findOrCreatePesqueiroConversation,
} from "@/lib/chat";

export const dynamic = "force-dynamic";

/** Lista as conversas do usuário logado. */
export async function GET() {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const conversas = await getConversations(me.id);
  return NextResponse.json({ conversas });
}

/**
 * Abre (ou cria) uma conversa e devolve o id.
 * Body: { userId } | { handle } (DM) — ou { pesqueiroId } (estabelecimento).
 */
export async function POST(req: Request) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  // Grupo ("Combinar Pescaria"): título + membros + evento opcional.
  if (body.tipo === "grupo") {
    const titulo =
      typeof body.titulo === "string" && body.titulo.trim()
        ? body.titulo.trim().slice(0, 80)
        : "Pescaria";
    const idsBrutos: string[] = Array.isArray(body.memberIds)
      ? body.memberIds.filter((x: unknown): x is string => typeof x === "string")
      : [];
    // Confirma que são usuários reais e dedup (sempre inclui o criador).
    const validos = idsBrutos.length
      ? (
          await prisma.user.findMany({
            where: { id: { in: idsBrutos } },
            select: { id: true },
          })
        ).map((u) => u.id)
      : [];
    const memberIds = Array.from(new Set([me.id, ...validos]));
    if (memberIds.length < 2)
      return NextResponse.json(
        { error: "Convide pelo menos um amigo para o grupo." },
        { status: 400 },
      );

    let eventoData: Date | null = null;
    let eventoPesqueiroId: string | null = null;
    if (body.evento && typeof body.evento === "object") {
      const d = new Date(body.evento.data);
      if (body.evento.data && !Number.isNaN(d.getTime())) eventoData = d;
      if (typeof body.evento.pesqueiroId === "string")
        eventoPesqueiroId = body.evento.pesqueiroId || null;
    }

    const conv = await prisma.conversation.create({
      data: {
        tipo: "grupo",
        titulo,
        eventoData,
        eventoPesqueiroId,
        members: { create: memberIds.map((userId) => ({ userId })) },
        messages: {
          create: {
            autorId: me.id,
            texto: eventoData
              ? "Bora combinar essa pescaria! 🎣"
              : "Criei o grupo. Bora combinar! 🎣",
          },
        },
      },
    });
    return NextResponse.json({ id: conv.id }, { status: 201 });
  }

  // Conversa com um pesqueiro.
  if (typeof body.pesqueiroId === "string" && body.pesqueiroId) {
    const pq = await prisma.pesqueiro.findUnique({ where: { id: body.pesqueiroId } });
    if (!pq)
      return NextResponse.json({ error: "Pesqueiro não encontrado." }, { status: 404 });
    const id = await findOrCreatePesqueiroConversation(me.id, pq.id);
    return NextResponse.json({ id }, { status: 201 });
  }

  // DM por id ou handle.
  let otherId: string | null = null;
  if (typeof body.userId === "string" && body.userId) {
    otherId = body.userId;
  } else if (typeof body.handle === "string" && body.handle) {
    const u = await prisma.user.findUnique({ where: { handle: body.handle } });
    otherId = u?.id ?? null;
  }
  if (!otherId)
    return NextResponse.json({ error: "Destinatário inválido." }, { status: 400 });
  if (otherId === me.id)
    return NextResponse.json(
      { error: "Você não pode conversar consigo mesmo." },
      { status: 400 },
    );

  const alvo = await prisma.user.findUnique({ where: { id: otherId } });
  if (!alvo)
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  // Privacidade de DM (C3): "amigos" exige seguimento mútuo — a menos que
  // a conversa já exista (aí só reabre, sem criar nada novo).
  if (alvo.dmPrivacy === "amigos") {
    const [euSigo, eleMeSegue, existente] = await Promise.all([
      prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: me.id, followingId: alvo.id } },
      }),
      prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: alvo.id, followingId: me.id } },
      }),
      prisma.conversation.findFirst({
        where: {
          tipo: "dm",
          AND: [
            { members: { some: { userId: me.id } } },
            { members: { some: { userId: alvo.id } } },
          ],
        },
        select: { id: true },
      }),
    ]);
    if (!existente && !(euSigo && eleMeSegue))
      return NextResponse.json(
        { error: `${alvo.nome} só recebe mensagens de amigos.` },
        { status: 403 },
      );
  }

  const id = await findOrCreateDM(me.id, otherId);
  return NextResponse.json({ id }, { status: 201 });
}
