import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  // Marca como lidas apenas as que ainda não foram visualizadas.
  await prisma.notification.updateMany({
    where: { recipientId: me.id, lida: false },
    data: { lida: true },
  });

  return NextResponse.json({ ok: true });
}

