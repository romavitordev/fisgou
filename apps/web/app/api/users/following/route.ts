import { NextResponse } from "next/server";
import { getFollowing } from "@/lib/queries";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Lista de usuários que o viewer segue (para marcar amigos numa publicação). */
export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ users: [] });
  const users = await getFollowing(uid);
  return NextResponse.json({ users });
}
