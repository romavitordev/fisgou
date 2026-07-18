import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Apaga um comentário — só o autor do comentário pode. */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; commentId: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const comment = await prisma.comment.findUnique({ where: { id: params.commentId } });
  if (!comment || comment.postId !== params.id) {
    return NextResponse.json({ error: "Comentário não encontrado." }, { status: 404 });
  }
  if (comment.autorId !== me.id) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  // Apagar um comentário-raiz cascateia as respostas (onDelete: Cascade),
  // então o contador desconta 1 + as respostas apagadas — decrementar só 1
  // deixava o contador inflado para sempre (bug A5 da rodada 2).
  const respostas = await prisma.comment.count({
    where: { parentId: params.commentId },
  });

  await prisma.comment.delete({ where: { id: params.commentId } });
  await prisma.post
    .update({
      where: { id: params.id },
      data: { comentarios: { decrement: 1 + respostas } },
    })
    .catch(() => {});

  return NextResponse.json({ ok: true, removidos: 1 + respostas });
}
