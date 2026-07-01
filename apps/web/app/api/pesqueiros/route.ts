import { NextResponse } from "next/server";
import { getPesqueiros } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const pesqueiros = await getPesqueiros();
  return NextResponse.json({ pesqueiros });
}
