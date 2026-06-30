import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";

/** Alterna a curtida do usuário no post e ajusta o contador. */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId: params.id, userId: me.id } },
  });

  let liked: boolean;
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    await prisma.post.update({
      where: { id: params.id },
      data: { curtidas: { decrement: 1 } },
    });
    // Remove a notificação de curtida correspondente (best effort).
    await prisma.notification.deleteMany({
      where: {
        recipientId: post.autorId,
        actorId: me.id,
        tipo: "curtida",
        postId: post.id,
      },
    });
    liked = false;
  } else {
    await prisma.like.create({ data: { postId: params.id, userId: me.id } });
    await prisma.post.update({
      where: { id: params.id },
      data: { curtidas: { increment: 1 } },
    });
    if (post.autorId !== me.id) {
      await prisma.notification.create({
        data: {
          recipientId: post.autorId,
          tipo: "curtida",
          actorId: me.id,
          postId: post.id,
        },
      });
    }
    liked = true;
  }

  const atualizado = await prisma.post.findUnique({ where: { id: params.id } });
  return NextResponse.json({ liked, curtidas: atualizado?.curtidas ?? 0 });
}
