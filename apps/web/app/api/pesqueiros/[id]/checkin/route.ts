import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Registra um check-in do usuário logado no pesqueiro. */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const pesqueiro = await prisma.pesqueiro.findUnique({ where: { id: params.id } });
  if (!pesqueiro)
    return NextResponse.json({ error: "Pesqueiro não encontrado." }, { status: 404 });

  await prisma.checkIn.create({
    data: { userId: me.id, pesqueiroId: params.id },
  });

  const total = await prisma.checkIn.count({ where: { pesqueiroId: params.id } });
  return NextResponse.json({ ok: true, total });
}
