"use client";

import { Users, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { tempoRelativo } from "@/lib/format";
import type { ConversationSummary } from "@fisgou/shared";

/** Lista de conversas (usada na página e no dock). */
export function ConversationList({
  conversas,
  activeId,
  onOpen,
}: {
  conversas: ConversationSummary[];
  activeId?: string | null;
  onOpen: (id: string) => void;
}) {
  if (conversas.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-text-2">
        Nenhuma conversa ainda. Comece uma nova!
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {conversas.map((c) => (
        <li key={c.id}>
          <button
            type="button"
            onClick={() => onOpen(c.id)}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-surface-2",
              activeId === c.id && "bg-surface-2",
            )}
          >
            <span className="relative shrink-0">
              <Avatar iniciais={c.iniciais} cor={c.cor} src={c.imagemUrl} size="md" />
              {c.tipo === "grupo" && (
                <span className="absolute -bottom-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand text-brand-fg ring-2 ring-surface">
                  <Users className="h-2.5 w-2.5" aria-hidden="true" />
                </span>
              )}
              {c.tipo === "pesqueiro" && (
                <span className="absolute -bottom-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand text-brand-fg ring-2 ring-surface">
                  <MapPin className="h-2.5 w-2.5" aria-hidden="true" />
                </span>
              )}
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold">{c.titulo}</span>
                {c.ultimaEm && (
                  <span className="shrink-0 text-[11px] text-text-2">
                    {tempoRelativo(c.ultimaEm)}
                  </span>
                )}
              </span>
              <span className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "truncate text-xs",
                    c.naoLidas > 0 ? "font-medium text-text" : "text-text-2",
                  )}
                >
                  {c.ultimaMensagem ?? "Conversa iniciada"}
                </span>
                {c.naoLidas > 0 && (
                  <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-brand-fg">
                    {c.naoLidas > 9 ? "9+" : c.naoLidas}
                  </span>
                )}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
