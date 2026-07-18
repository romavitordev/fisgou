import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Marca a conversa como lida até agora (zera não-lidas do viewer). */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const membership = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId: params.id, userId: me.id } },
  });
  if (!membership)
    return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });

  await prisma.conversationMember.update({
    where: { conversationId_userId: { conversationId: params.id, userId: me.id } },
    data: { lastReadAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
