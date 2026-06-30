"use client";

import { useNotifications } from "@/lib/notifications";

/** Bolha com a contagem de não lidas — dirigida pelo NotificationsProvider. */
export function NotificationsBadge() {
  const { unread } = useNotifications();
  if (unread <= 0) return null;

  return (
    <span
      aria-label={`${unread} notificações não lidas`}
      className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-fg"
    >
      {unread > 99 ? "99+" : unread}
    </span>
  );
}
