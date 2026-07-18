import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";
import { toPesqueiro } from "@/lib/dto";
import { parsePesqueiroInput } from "@/lib/pesqueiro-input";

export const dynamic = "force-dynamic";

/** Edita um pesqueiro — só o vendedor dono pode. */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const pesqueiro = await prisma.pesqueiro.findUnique({ where: { id: params.id } });
  if (!pesqueiro)
    return NextResponse.json({ error: "Pesqueiro não encontrado." }, { status: 404 });
  if (pesqueiro.donoId !== me.id)
    return NextResponse.json(
      { error: "Você não administra este pesqueiro." },
      { status: 403 },
    );

  const body = await req.json().catch(() => ({}));
  const parsed = parsePesqueiroInput(body, { partial: true });
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const atualizado = await prisma.pesqueiro.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ pesqueiro: toPesqueiro(atualizado) });
}
