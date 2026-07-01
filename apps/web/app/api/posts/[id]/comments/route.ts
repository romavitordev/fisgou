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

  const { texto, parentId } = await req.json().catch(() => ({}));
  if (!texto || !String(texto).trim()) {
    return NextResponse.json({ error: "Comentário vazio." }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });

  // Resposta: sempre pendura no comentário raiz (só 1 nível de thread).
  let raizId: string | null = null;
  if (parentId) {
    const pai = await prisma.comment.findUnique({ where: { id: String(parentId) } });
    if (!pai || pai.postId !== params.id) {
      return NextResponse.json({ error: "Comentário original não encontrado." }, { status: 404 });
    }
    raizId = pai.parentId ?? pai.id;
  }

  const comment = await prisma.comment.create({
    data: {
      postId: params.id,
      autorId: me.id,
      texto: String(texto).trim(),
      parentId: raizId,
    },
    include: { autor: true },
  });
  await prisma.post.update({
    where: { id: params.id },
    data: { comentarios: { increment: 1 } },
  });

  // Notifica quem deve saber: autor do comentário-raiz (se for resposta)
  // ou autor do post (se for um comentário novo) — nunca a si mesmo.
  let destinatarioId = post.autorId;
  if (raizId) {
    const raiz = await prisma.comment.findUnique({ where: { id: raizId } });
    if (raiz) destinatarioId = raiz.autorId;
  }
  if (destinatarioId !== me.id) {
    await prisma.notification.create({
      data: {
        recipientId: destinatarioId,
        tipo: "comentario",
        actorId: me.id,
        postId: post.id,
      },
    });
  }

  return NextResponse.json({ comment: toComment(comment) });
}
