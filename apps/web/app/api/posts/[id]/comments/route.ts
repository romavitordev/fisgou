import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";
import { toComment } from "@/lib/dto";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { texto } = await req.json().catch(() => ({}));
  if (!texto || !String(texto).trim()) {
    return NextResponse.json({ error: "Comentário vazio." }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });

  const comment = await prisma.comment.create({
    data: { postId: params.id, autorId: me.id, texto: String(texto).trim() },
    include: { autor: true },
  });
  await prisma.post.update({
    where: { id: params.id },
    data: { comentarios: { increment: 1 } },
  });

  // Notifica o autor do post (menos quando comenta no próprio).
  if (post.autorId !== me.id) {
    await prisma.notification.create({
      data: {
        recipientId: post.autorId,
        tipo: "comentario",
        actorId: me.id,
        postId: post.id,
      },
    });
  }

  return NextResponse.json({ comment: toComment(comment) });
}
