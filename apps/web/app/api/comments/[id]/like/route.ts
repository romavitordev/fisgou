import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Alterna a curtida do usuário no comentário e ajusta o contador. */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const comment = await prisma.comment.findUnique({ where: { id: params.id } });
  if (!comment) return NextResponse.json({ error: "Comentário não encontrado." }, { status: 404 });

  const existing = await prisma.commentLike.findUnique({
    where: { commentId_userId: { commentId: params.id, userId: me.id } },
  });

  let liked: boolean;
  if (existing) {
    await prisma.commentLike.delete({ where: { id: existing.id } });
    await prisma.comment.update({
      where: { id: params.id },
      data: { curtidas: { decrement: 1 } },
    });
    // Descurtir remove a notificação (padrão das demais ações).
    const notif = await prisma.notification.findFirst({
      where: {
        recipientId: comment.autorId,
        tipo: "curtida_comentario",
        actorId: me.id,
        postId: comment.postId,
      },
    });
    if (notif) await prisma.notification.delete({ where: { id: notif.id } });
    liked = false;
  } else {
    await prisma.commentLike.create({
      data: { commentId: params.id, userId: me.id },
    });
    await prisma.comment.update({
      where: { id: params.id },
      data: { curtidas: { increment: 1 } },
    });
    // Notifica o DONO do comentário curtido (numa resposta, o autor da
    // resposta — nunca o dono do comentário-raiz). Não notifica a si mesmo.
    if (comment.autorId !== me.id) {
      await prisma.notification.create({
        data: {
          recipientId: comment.autorId,
          tipo: "curtida_comentario",
          actorId: me.id,
          postId: comment.postId,
        },
      });
    }
    liked = true;
  }

  const atualizado = await prisma.comment.findUnique({ where: { id: params.id } });
  return NextResponse.json({ liked, curtidas: atualizado?.curtidas ?? 0 });
}
