"use client";

import { useEffect } from "react";
import { useNotifications } from "@/lib/notifications";

/** Ao montar (abrir /notificacoes), marca tudo como lido e zera o badge. */
export function MarkNotificationsRead() {
  const { markAllRead } = useNotifications();
  useEffect(() => {
    void markAllRead();
  }, [markAllRead]);
  return null;
}
