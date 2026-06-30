import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";
import { toUser } from "@/lib/dto";
import { isAccentKey } from "@/lib/accent";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

function iniciaisDe(nome: string) {
  const p = nome.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

/** Atualiza o perfil do usuário logado. */
export async function PATCH(req: Request) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const data: Prisma.UserUpdateInput = {};

  if (typeof body.nome === "string") {
    const n = body.nome.trim();
    if (n.length < 2)
      return NextResponse.json({ error: "Nome muito curto." }, { status: 400 });
    data.nome = n;
    data.iniciais = iniciaisDe(n);
  }
  if (typeof body.bio === "string") data.bio = body.bio.trim() || null;
  if (typeof body.cidade === "string") data.cidade = body.cidade.trim() || null;

  if ("accent" in body) {
    if (body.accent === null) data.accent = null;
    else if (isAccentKey(body.accent)) data.accent = body.accent;
    else return NextResponse.json({ error: "Cor inválida." }, { status: 400 });
  }

  if ("bannerUrl" in body) {
    if (body.bannerUrl === null) data.bannerUrl = null;
    else if (typeof body.bannerUrl === "string" && body.bannerUrl.startsWith("/uploads/"))
      data.bannerUrl = body.bannerUrl;
    else return NextResponse.json({ error: "Banner inválido." }, { status: 400 });
  }

  if ("imagemUrl" in body) {
    if (body.imagemUrl === null) data.imagemUrl = null;
    else if (typeof body.imagemUrl === "string" && body.imagemUrl.startsWith("/uploads/"))
      data.imagemUrl = body.imagemUrl;
    else return NextResponse.json({ error: "Foto inválida." }, { status: 400 });
  }

  // Virar / deixar de ser criador: migra os contadores de forma coerente.
  if (typeof body.criador === "boolean" && body.criador !== me.criador) {
    data.criador = body.criador;
    const [followers, following] = await Promise.all([
      prisma.follow.count({ where: { followingId: me.id } }),
      prisma.follow.count({ where: { followerId: me.id } }),
    ]);
    if (body.criador) {
      data.seguidores = followers;
      data.seguindo = following;
      data.amigos = null;
    } else {
      data.amigos = followers;
      data.seguidores = null;
      data.seguindo = null;
    }
  }

  const updated = await prisma.user.update({ where: { id: me.id }, data });
  return NextResponse.json({ user: toUser(updated) });
}
