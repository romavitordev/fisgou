import { NextResponse } from "next/server";
import { getPesqueiros } from "@/lib/queries";
import { getCurrentDbUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { toPesqueiro } from "@/lib/dto";
import { parsePesqueiroInput } from "@/lib/pesqueiro-input";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const pesqueiros = await getPesqueiros();
  return NextResponse.json({ pesqueiros });
}

/** Cadastra um pesqueiro administrado pelo vendedor logado. */
export async function POST(req: Request) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  if (me.role !== "vendedor")
    return NextResponse.json(
      { error: "Apenas vendedores podem cadastrar pesqueiros." },
      { status: 403 },
    );

  const body = await req.json().catch(() => ({}));
  const parsed = parsePesqueiroInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const criado = await prisma.pesqueiro.create({
    data: {
      ...(parsed.data as Prisma.PesqueiroUncheckedCreateInput),
      donoId: me.id,
    },
  });

  return NextResponse.json({ pesqueiro: toPesqueiro(criado) }, { status: 201 });
}
