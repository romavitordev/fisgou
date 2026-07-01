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
    liked = false;
  } else {
    await prisma.commentLike.create({
      data: { commentId: params.id, userId: me.id },
    });
    await prisma.comment.update({
      where: { id: params.id },
      data: { curtidas: { increment: 1 } },
    });
    liked = true;
  }

  const atualizado = await prisma.comment.findUnique({ where: { id: params.id } });
  return NextResponse.json({ liked, curtidas: atualizado?.curtidas ?? 0 });
}
