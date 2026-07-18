import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * Verifica (aprova/recusa) uma captura. Só o vendedor dono do pesqueiro
 * marcado na publicação pode. Body: { aprovar: boolean }.
 * - aprovar: post → "verificado", coleção do autor → "verificado" (+especies),
 *   notifica o autor (tipo "verificacao").
 * - recusar: post → "nao_verificado", coleção volta a "nao_verificado",
 *   notifica o autor (tipo "verificacao_recusada").
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { pesqueiro: true },
  });
  if (!post)
    return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
  if (!post.pesqueiro || post.pesqueiro.donoId !== me.id)
    return NextResponse.json(
      { error: "Você não administra o pesqueiro desta captura." },
      { status: 403 },
    );
  if (!post.speciesId)
    return NextResponse.json(
      { error: "Publicação sem espécie para verificar." },
      { status: 400 },
    );
  if (post.status !== "em_analise")
    return NextResponse.json(
      { error: "Esta captura não está em análise." },
      { status: 409 },
    );

  const body = await req.json().catch(() => ({}));
  const aprovar = body.aprovar === true;
  const speciesId = post.speciesId;

  if (aprovar) {
    const entry = await prisma.collectionEntry.findUnique({
      where: { userId_speciesId: { userId: post.autorId, speciesId } },
    });
    const jaVerificada = entry?.status === "verificado";

    await prisma.$transaction([
      prisma.post.update({ where: { id: post.id }, data: { status: "verificado" } }),
      prisma.collectionEntry.upsert({
        where: { userId_speciesId: { userId: post.autorId, speciesId } },
        create: {
          userId: post.autorId,
          speciesId,
          status: "verificado",
          capturadoEm: new Date(),
        },
        update: { status: "verificado", capturadoEm: entry?.capturadoEm ?? new Date() },
      }),
    ]);

    if (!jaVerificada) {
      await prisma.user.update({
        where: { id: post.autorId },
        data: { especies: { increment: 1 } },
      });
    }
    if (post.autorId !== me.id) {
      await prisma.notification.create({
        data: {
          recipientId: post.autorId,
          tipo: "verificacao",
          actorId: me.id,
          postId: post.id,
          speciesId,
        },
      });
    }
    return NextResponse.json({ ok: true, status: "verificado" });
  }

  // Recusar
  await prisma.$transaction([
    prisma.post.update({ where: { id: post.id }, data: { status: "nao_verificado" } }),
    prisma.collectionEntry.updateMany({
      where: { userId: post.autorId, speciesId, status: "em_analise" },
      data: { status: "nao_verificado" },
    }),
  ]);
  if (post.autorId !== me.id) {
    await prisma.notification.create({
      data: {
        recipientId: post.autorId,
        tipo: "verificacao_recusada",
        actorId: me.id,
        postId: post.id,
        speciesId,
      },
    });
  }
  return NextResponse.json({ ok: true, status: "nao_verificado" });
}
