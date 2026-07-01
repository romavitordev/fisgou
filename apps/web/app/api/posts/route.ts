import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";
import { getFeed } from "@/lib/queries";

export const dynamic = "force-dynamic";

const CORES = ["#9DBFAE", "#A9C7D6", "#C9C3E0", "#D8C7A0", "#BDD3C7"];

// Timeline para o polling do feed. Usa o mesmo DTO do SSR (getFeed),
// que NÃO expõe dados sensíveis (ex.: passwordHash) e já marca `liked`.
export async function GET() {
  const me = await getCurrentDbUser();
  const posts = await getFeed(me?.id ?? null);
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { legenda, localPrivacidade, speciesId, pesqueiroId, imagemUrl } = await req
    .json()
    .catch(() => ({}));

  if (!legenda || !String(legenda).trim()) {
    return NextResponse.json({ error: "Escreva uma legenda." }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      autorId: me.id,
      legenda: String(legenda).trim(),
      imagemCor: CORES[Math.floor(Math.random() * CORES.length)],
      imagemUrl: imagemUrl ?? null,
      localPrivacidade: localPrivacidade ?? "aproximado",
      speciesId: speciesId ?? null,
      pesqueiroId: pesqueiroId ?? null,
      // Captura com espécie entra em análise; sem espécie, sem status.
      status: speciesId ? "em_analise" : null,
    },
  });

  await prisma.user.update({
    where: { id: me.id },
    data: { peixes: { increment: 1 } },
  });

  return NextResponse.json({ id: post.id });
}
