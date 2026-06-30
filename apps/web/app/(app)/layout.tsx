import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { NotificationsProvider } from "@/lib/notifications";

/**
 * Layout do grupo (app): exige sessão (AuthGuard), provê notificações
 * (toast global + badge) e envolve as telas com a casca responsiva.
 */
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <NotificationsProvider>
        <AppShell>{children}</AppShell>
      </NotificationsProvider>
    </AuthGuard>
  );
}
