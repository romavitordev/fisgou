import Link from "next/link";
import { Heart, MessageCircle, UserPlus, BadgeCheck } from "lucide-react";
import { TopBar, TopBarTitle } from "@/components/layout/TopBar";
import { PageContainer } from "@/components/layout/PageContainer";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { tempoRelativo } from "@/lib/format";
import { getNotifications, getViewer } from "@/lib/queries";
import { MarkNotificationsRead } from "@/components/layout/MarkNotificationsRead";
import type { Notification, NotificationType } from "@fisgou/shared";

export const dynamic = "force-dynamic";

const iconByType: Record<NotificationType, typeof Heart> = {
  curtida: Heart,
  comentario: MessageCircle,
  seguidor: UserPlus,
  verificacao: BadgeCheck,
};

const colorByType: Record<NotificationType, string> = {
  curtida: "text-red-500",
  comentario: "text-brand",
  seguidor: "text-brand",
  verificacao: "text-brand",
};

function texto(n: Notification): string {
  const nome = n.ator?.nome ?? "Sistema";
  switch (n.tipo) {
    case "curtida":
      return `${nome} curtiu sua publicação.`;
    case "comentario":
      return `${nome} comentou na sua publicação.`;
    case "seguidor":
      return `${nome} começou a te seguir.`;
    case "verificacao":
      return `Sua captura de ${n.especie?.nome ?? "espécie"} foi verificada! 🎣`;
    default:
      return "Nova notificação.";
  }
}


export default async function NotificacoesPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const notifications = await getNotifications(viewer.id);

  return (
    <PageContainer>
      {/* Marca como lidas e zera o badge (client, via provider). */}
      <MarkNotificationsRead />
      <TopBar>
        <TopBarTitle title="Notificações" />
      </TopBar>

      <ul className="divide-y divide-border">
        {notifications.map((n) => {
          const Icon = iconByType[n.tipo];
          const corpo = (
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2",
                !n.lida && "bg-brand-soft/40",
              )}
            >
              {n.ator ? (
                <Avatar iniciais={n.ator.iniciais} cor={n.ator.cor} size="md" />
              ) : (
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft">
                  <BadgeCheck className="h-5 w-5 text-brand" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug">{texto(n)}</p>
                <p className="mt-0.5 text-xs text-text-2">
                  {tempoRelativo(n.criadoEm)}
                </p>
              </div>
              <Icon
                className={cn("h-5 w-5 shrink-0", colorByType[n.tipo])}
                aria-hidden="true"
              />
              {!n.lida && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
              )}
            </div>
          );

          return (
            <li key={n.id}>
              {n.postId ? (
                <Link href={`/post/${n.postId}`}>{corpo}</Link>
              ) : n.ator ? (
                <Link href={`/u/${n.ator.handle}`}>{corpo}</Link>
              ) : (
                corpo
              )}
            </li>
          );
        })}
      </ul>
    </PageContainer>
  );
}
