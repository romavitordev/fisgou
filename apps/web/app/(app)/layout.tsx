import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AccentApplier } from "@/components/layout/AccentApplier";
import { NotificationsProvider } from "@/lib/notifications";

/**
 * Layout do grupo (app): exige sessão (AuthGuard), aplica a cor de
 * destaque do usuário, provê notificações e envolve as telas com a casca.
 */
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AccentApplier />
      <NotificationsProvider>
        <AppShell>{children}</AppShell>
      </NotificationsProvider>
    </AuthGuard>
  );
}
