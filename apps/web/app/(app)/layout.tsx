import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AccentApplier } from "@/components/layout/AccentApplier";
import { NotificationsProvider } from "@/lib/notifications";
import { ChatProvider } from "@/lib/chat-context";
import { ChatDock } from "@/components/chat/ChatDock";

/**
 * Layout do grupo (app): exige sessão (AuthGuard), aplica a cor de
 * destaque do usuário, provê notificações + chat e envolve as telas com
 * a casca. O ChatDock flutua sobre tudo (desktop).
 */
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AccentApplier />
      <NotificationsProvider>
        <ChatProvider>
          <AppShell>{children}</AppShell>
          <ChatDock />
        </ChatProvider>
      </NotificationsProvider>
    </AuthGuard>
  );
}
