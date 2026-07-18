import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";
import { toPoll } from "@/lib/dto";

/**
 * Vota numa opção da enquete. 1 voto por usuário (unique pollId+userId);
 * votar em outra opção troca o voto (upsert).
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { optionId } = await req.json().catch(() => ({}));
  if (!optionId) {
    return NextResponse.json({ error: "Escolha uma opção." }, { status: 400 });
  }

  const option = await prisma.pollOption.findUnique({
    where: { id: String(optionId) },
  });
  if (!option || option.pollId !== params.id) {
    return NextResponse.json({ error: "Opção não encontrada." }, { status: 404 });
  }

  await prisma.pollVote.upsert({
    where: { pollId_userId: { pollId: params.id, userId: me.id } },
    create: { pollId: params.id, optionId: option.id, userId: me.id },
    update: { optionId: option.id },
  });

  const poll = await prisma.poll.findUnique({
    where: { id: params.id },
    include: {
      options: { include: { votes: { select: { id: true } } } },
      votes: true,
    },
  });
  if (!poll) return NextResponse.json({ error: "Enquete não encontrada." }, { status: 404 });

  return NextResponse.json({ poll: toPoll(poll, me.id) });
}
