"use client";

import { useChat } from "@/lib/chat-context";

/** Bolha com a contagem de mensagens não lidas — dirigida pelo ChatProvider. */
export function ChatNavBadge() {
  const { unread } = useChat();
  if (unread <= 0) return null;

  return (
    <span
      aria-label={`${unread} mensagens não lidas`}
      className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-fg"
    >
      {unread > 99 ? "99+" : unread}
    </span>
  );
}
