import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { toUser } from "@/lib/dto";

const CORES = ["#14916B", "#2D7DD2", "#7C5CD6", "#E0A11A", "#2DB98B", "#D2691E"];

function iniciaisDe(nome: string) {
  const partes = nome.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? "") + (partes[1]?.[0] ?? "")).toUpperCase() || "?";
}

async function handleUnico(base: string) {
  let h = base.replace(/[^a-z0-9._]/gi, "").toLowerCase() || "pescador";
  let cand = h;
  let i = 1;
  while (await prisma.user.findUnique({ where: { handle: cand } })) {
    cand = `${h}${i++}`;
  }
  return cand;
}

export async function POST(req: Request) {
  const { nome, email, senha } = await req.json().catch(() => ({}));

  if (!nome || String(nome).trim().length < 2) {
    return NextResponse.json({ error: "Informe seu nome." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }
  if (!senha || String(senha).length < 6) {
    return NextResponse.json(
      { error: "A senha precisa ter ao menos 6 caracteres." },
      { status: 400 },
    );
  }

  const emailNorm = String(email).toLowerCase().trim();
  if (await prisma.user.findUnique({ where: { email: emailNorm } })) {
    return NextResponse.json({ error: "Esse e-mail já tem conta." }, { status: 409 });
  }

  const handle = await handleUnico(emailNorm.split("@")[0]);
  const user = await prisma.user.create({
    data: {
      nome: String(nome).trim(),
      email: emailNorm,
      handle,
      passwordHash: bcrypt.hashSync(String(senha), 10),
      cor: CORES[Math.floor(Math.random() * CORES.length)],
      iniciais: iniciaisDe(String(nome)),
      // Usuário novo começa como comum, com modelo de "amigos".
      amigos: 0,
    },
  });

  await createSession(user.id);
  return NextResponse.json({ user: toUser(user) });
}
