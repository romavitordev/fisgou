import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { toUser } from "@/lib/dto";
import {
  verificarRateLimit,
  limparRateLimit,
  ipDaRequisicao,
} from "@/lib/ratelimit";

export async function POST(req: Request) {
  // Força bruta: 5 tentativas por IP / 15 min.
  const ip = ipDaRequisicao(req);
  const limite = verificarRateLimit("login", ip);
  if (!limite.permitido) {
    const minutos = Math.max(1, Math.ceil(limite.liberaEmSegundos / 60));
    return NextResponse.json(
      { error: `Muitas tentativas. Tente novamente em ${minutos} minuto(s).` },
      { status: 429 },
    );
  }

  const { email, senha } = await req.json().catch(() => ({}));

  if (!email || !senha) {
    return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email).toLowerCase().trim() },
  });
  if (!user || !bcrypt.compareSync(String(senha), user.passwordHash)) {
    return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
  }

  // Sucesso: não pune quem errou a senha e depois acertou.
  limparRateLimit("login", ip);
  await createSession(user.id);
  return NextResponse.json({ user: toUser(user) });
}
