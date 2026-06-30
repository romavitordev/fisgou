import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { toUser } from "@/lib/dto";

export async function POST(req: Request) {
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

  await createSession(user.id);
  return NextResponse.json({ user: toUser(user) });
}
