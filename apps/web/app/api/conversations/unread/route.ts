import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/session";
import { getUnreadTotal } from "@/lib/chat";

export const dynamic = "force-dynamic";

/** Total de mensagens não lidas (badge da navegação/dock). */
export async function GET() {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ unread: 0 });
  const unread = await getUnreadTotal(me.id);
  return NextResponse.json({ unread });
}
