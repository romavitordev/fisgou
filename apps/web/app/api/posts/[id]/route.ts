import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Apaga uma publicação — o autor ou um moderador (conteúdo impróprio). */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
  if (post.autorId !== me.id && me.role !== "moderador") {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  // Comments/Likes/CommentLikes cascateiam pelo schema; Notifications com
  // essa postId ficam com postId nulo (relação opcional).
  await prisma.post.delete({ where: { id: params.id } });

  // Decrementa o contador do AUTOR (vale também quando o moderador remove).
  await prisma.user
    .update({ where: { id: post.autorId }, data: { peixes: { decrement: 1 } } })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
