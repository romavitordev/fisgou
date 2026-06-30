import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/session";
import { toNotification } from "@/lib/dto";

export const dynamic = "force-dynamic";

export async function GET() {
  const me = await getCurrentDbUser();
  if (!me) return NextResponse.json({ unread: 0, latest: null });

  const [unread, latest] = await Promise.all([
    prisma.notification.count({
      where: { recipientId: me.id, lida: false },
    }),
    prisma.notification.findFirst({
      where: { recipientId: me.id },
      orderBy: { criadoEm: "desc" },
      include: { actor: true, species: true },
    }),
  ]);

  return NextResponse.json({
    unread,
    latest: latest ? toNotification(latest) : null,
  });
}
