import { NextResponse } from "next/server";
import { getSpeciesList } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const species = await getSpeciesList();
  return NextResponse.json({ species });
}
