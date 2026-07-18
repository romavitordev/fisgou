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

  const id = await findOrCreateDM(me.id, otherId);
  return NextResponse.json({ id }, { status: 201 });
}
