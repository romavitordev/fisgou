import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Badge } from "@fisgou/shared";

/** Resolve o nome do ícone (string do mock) para o componente lucide. */
function resolveIcon(name: string): LucideIcon {
  return (icons as unknown as Record<string, LucideIcon>)[name] ?? icons.Award;
}

/**
 * Faixa de insígnias. Insígnias tier "lendario" (ex.: Recordista)
 * usam âmbar — uma das exceções permitidas da regra do âmbar.
 */
export function BadgeRow({ badges }: { badges: Badge[] }) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto">
      {badges.map((badge) => {
        const Icon = resolveIcon(badge.icon);
        const lendaria = badge.tier === "lendario";
        return (
          <div
            key={badge.id}
            className="flex w-16 shrink-0 flex-col items-center gap-1.5 text-center"
          >
            <span
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-full border",
                lendaria
                  ? "border-amber/40 bg-amber-soft text-amber"
                  : "border-border bg-brand-soft text-brand",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-[11px] leading-tight text-text-2">
              {badge.nome}
            </span>
          </div>
        );
      })}
    </div>
  );
}
