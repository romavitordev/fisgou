"use client";

import { Anchor, Ruler } from "lucide-react";
import type { Species } from "@fisgou/shared";

export function AchievementRow({
  maxWeight = "12,4 kg",
  maxLength = "78 cm",
  heaviest,
  longest,
}: {
  maxWeight?: string;
  maxLength?: string;
  heaviest?: Species | null;
  longest?: Species | null;
}) {
  return (
    <div className="mt-4 flex gap-3 px-4">
      <div className="flex-1 rounded-2xl border border-border bg-surface p-3">
        <div className="flex items-center gap-3">
          {heaviest ? (
            <div
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white overflow-hidden"
              style={{ backgroundColor: heaviest.cor }}
              aria-hidden
            >
              <span className="text-xs font-semibold">{heaviest.nome[0]}</span>
            </div>
          ) : (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Anchor className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          <div>
            <div className="text-sm font-semibold">Fisgados mais Pesados</div>
            <div className="text-xs text-text-2">{maxWeight}</div>
            {heaviest && (
              <div className="mt-1 text-xs text-text-2">{heaviest.nome}</div>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-text-2">Critério: Maior peso verificado em uma captura marcada.</p>
      </div>

      <div className="flex-1 rounded-2xl border border-border bg-surface p-3">
        <div className="flex items-center gap-3">
          {longest ? (
            <div
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white overflow-hidden"
              style={{ backgroundColor: longest.cor }}
              aria-hidden
            >
              <span className="text-xs font-semibold">{longest.nome[0]}</span>
            </div>
          ) : (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Ruler className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          <div>
            <div className="text-sm font-semibold">Maiores Fisgados</div>
            <div className="text-xs text-text-2">{maxLength}</div>
            {longest && (
              <div className="mt-1 text-xs text-text-2">{longest.nome}</div>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-text-2">Critério: Maior comprimento verificado em uma captura marcada.</p>
      </div>
    </div>
  );
}
