import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";

/** Ajusta o contador de seguidores (criador) ou amigos (comum) em ±delta. */
async function ajustarSeguidores(userId: string, delta: number) {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) return;
  if (u.seguidores != null) {
    await prisma.user.update({
      where: { id: userId },
      data: { seguidores: { increment: delta } },
    });
  } else if (u.amigos != null) {
    await prisma.user.update({
      where: { id: userId },
      data: { amigos: { increment: delta } },
    });
  }
}

export async function POST(
  _req: Request,
  { params }: { params: { handle: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const alvo = await prisma.user.findUnique({ where: { handle: params.handle } });
  if (!alvo || alvo.id === me.id) {
    return NextResponse.json({ error: "Alvo inválido." }, { status: 400 });
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId: me.id, followingId: alvo.id },
    },
  });

  let following: boolean;
  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    await ajustarSeguidores(alvo.id, -1);
    if (me.seguindo != null) {
      await prisma.user.update({
        where: { id: me.id },
        data: { seguindo: { decrement: 1 } },
      });
    }
    await prisma.notification.deleteMany({
      where: { recipientId: alvo.id, actorId: me.id, tipo: "seguidor" },
    });
    following = false;
  } else {
    await prisma.follow.create({
      data: { followerId: me.id, followingId: alvo.id },
    });
    await ajustarSeguidores(alvo.id, 1);
    if (me.seguindo != null) {
      await prisma.user.update({
        where: { id: me.id },
        data: { seguindo: { increment: 1 } },
      });
    }
    await prisma.notification.create({
      data: { recipientId: alvo.id, tipo: "seguidor", actorId: me.id },
    });
    following = true;
  }

  return NextResponse.json({ following });
}
