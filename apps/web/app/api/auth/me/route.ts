import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/session";
import { toUser } from "@/lib/dto";

export const dynamic = "force-dynamic";

export async function GET() {
  const u = await getCurrentDbUser();
  return NextResponse.json({ user: u ? toUser(u) : null });
}
