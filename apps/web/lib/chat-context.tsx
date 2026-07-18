"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Estado global leve do chat: contagem de mensagens não lidas (badge da
 * nav + dock). Polling simples de /api/conversations/unread. O dock
 * (ChatDock) reaproveita `refreshUnread` após ler/enviar.
 */

const POLL_MS = 8000;

const MAX_JANELAS = 3;

interface ChatContextValue {
  unread: number;
  refreshUnread: () => void;
  /** Ids das conversas abertas como janelas flutuantes (dock, desktop). */
  openIds: string[];
  openConversation: (id: string) => void;
  closeConversation: (id: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [unread, setUnread] = useState(0);
  const [openIds, setOpenIds] = useState<string[]>([]);

  const openConversation = useCallback((id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) return prev;
      return [id, ...prev].slice(0, MAX_JANELAS);
    });
  }, []);

  const closeConversation = useCallback((id: string) => {
    setOpenIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const refreshUnread = useCallback(async () => {
    try {
      const r = await fetch("/api/conversations/unread", { cache: "no-store" });
      if (!r.ok) return;
      const d = (await r.json()) as { unread?: number };
      setUnread(Number(d.unread ?? 0));
    } catch {
      /* silencioso */
    }
  }, []);

  useEffect(() => {
    void refreshUnread();
    const t = window.setInterval(() => void refreshUnread(), POLL_MS);
    const onFocus = () => void refreshUnread();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(t);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshUnread]);

  return (
    <ChatContext.Provider
      value={{ unread, refreshUnread, openIds, openConversation, closeConversation }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat precisa estar dentro de <ChatProvider>");
  return ctx;
}
