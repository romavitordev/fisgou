"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { NoticeToast } from "@/components/ui/NoticeToast";
import type { Notification } from "@fisgou/shared";

/**
 * Notificações por POLLING (robusto e simples — sem SSE).
 * - Faz polling de /api/notifications/unread (conta + última notificação).
 * - Mostra um toast global quando chega uma notificação realmente nova
 *   (depois do baseline inicial, pra não "tocar" as antigas ao abrir).
 * - Expõe `unread` pro badge e `markAllRead` pra zerar ao ver /notificacoes.
 * O toast é renderizado aqui (nível do app) → funciona no mobile e desktop.
 */

// Polling curto p/ sensação "em tempo real" (curtidas/comentários/seguidores).
const POLL_MS = 8000;

interface NotificationsContextValue {
  unread: number;
  refresh: () => void;
  markAllRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

function buildText(n: Notification): string {
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
    case "marcacao":
      return `${nome} marcou você em uma publicação.`;
    default:
      return "Você tem uma nova notificação.";
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState<{ id: string; text: string } | null>(null);

  const lastSeenId = useRef<string | null>(null);
  const baselined = useRef(false);
  const toastTimer = useRef<number | null>(null);

  const dismiss = useCallback(() => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = null;
    setToast(null);
  }, []);

  const showToast = useCallback((n: Notification) => {
    setToast({ id: String(n.id), text: buildText(n) });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 5000);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/notifications/unread", { cache: "no-store" });
      if (!r.ok) return;
      const d = (await r.json()) as {
        unread?: number;
        latest?: Notification | null;
      };
      setUnread(Number(d.unread ?? 0));

      const latest = d.latest ?? null;
      if (latest) {
        if (!baselined.current) {
          // 1ª leitura: define baseline sem tocar toast nas antigas.
          baselined.current = true;
        } else if (latest.id !== lastSeenId.current && !latest.lida) {
          showToast(latest);
        }
        lastSeenId.current = latest.id;
      }
    } catch {
      // silencioso — tenta de novo no próximo ciclo
    }
  }, [showToast]);

  const markAllRead = useCallback(async () => {
    try {
      await fetch("/api/notifications/mark-read", { method: "POST" });
    } catch {
      /* ignore */
    }
    setUnread(0);
  }, []);

  useEffect(() => {
    void refresh();
    const t = window.setInterval(() => void refresh(), POLL_MS);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(t);
      window.removeEventListener("focus", onFocus);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [refresh]);

  return (
    <NotificationsContext.Provider value={{ unread, refresh, markAllRead }}>
      {children}
      {toast && <NoticeToast text={toast.text} onDismiss={dismiss} />}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error("useNotifications precisa estar dentro de <NotificationsProvider>");
  return ctx;
}
