import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/session";
import { getConversationDetail } from "@/lib/chat";

export const dynamic = "force-dynamic";

/** Detalhe de uma conversa (participantes + mensagens). Só membros. */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const conversa = await getConversationDetail(params.id, me.id);
  if (!conversa)
    return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });

  return NextResponse.json({ conversa });
}
