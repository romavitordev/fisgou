"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export function NoticeToast({
  text,
  onDismiss,
}: {
  text: string;
  onDismiss: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        "fixed bottom-20 right-4 z-50 w-[min(360px,calc(100vw-2rem))]"
      }
    >
      <div
        className={
          "relative rounded-2xl border border-border bg-surface p-4 shadow-xl " +
          (mounted ? "animate-rise" : "opacity-0")
        }
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Bell className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Nova notificação</p>
            <p className="mt-1 text-sm text-text-2">{text}</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Fechar"
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

