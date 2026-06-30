import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const me = await getCurrentDbUser();
  if (!me) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const imagemUrl = body?.imagemUrl;

  if (imagemUrl === null) {
    await prisma.user.update({
      where: { id: me.id },
      data: { imagemUrl: null },
    });
    return NextResponse.json({ ok: true });
  }

  if (typeof imagemUrl !== "string" || !imagemUrl.startsWith("/uploads/")) {
    return NextResponse.json({ error: "URL de imagem inválida." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: me.id },
    data: { imagemUrl },
  });

  return NextResponse.json({ ok: true });
}
