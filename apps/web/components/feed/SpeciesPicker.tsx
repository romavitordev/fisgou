"use client";

import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { RarityDot } from "@/components/ui/RarityDot";
import type { Species } from "@fisgou/shared";

/** Bottom sheet simples para escolher uma espécie (busca + lista). */
export function SpeciesPicker({
  onSelect,
  onClose,
}: {
  onSelect: (s: Species) => void;
  onClose: () => void;
}) {
  const [lista, setLista] = useState<Species[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/species")
      .then((r) => r.json())
      .then((d) => setLista(d.species ?? []))
      .finally(() => setCarregando(false));
  }, []);

  const filtradas = lista.filter((s) =>
    s.nome.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex max-h-[80vh] w-full max-w-sm flex-col rounded-t-2xl bg-surface sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-semibold">Marcar espécie</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-2 hover:bg-surface-2 hover:text-text"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative p-3">
          <Search
            className="pointer-events-none absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-text-2"
            aria-hidden="true"
          />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar espécie…"
            className="campo pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {carregando && (
            <p className="px-3 py-6 text-center text-sm text-text-2">Carregando…</p>
          )}
          {!carregando && filtradas.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-text-2">
              Nenhuma espécie encontrada.
            </p>
          )}
          {filtradas.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-surface-2"
            >
              <span
                className="h-10 w-10 shrink-0 rounded-lg"
                style={{ backgroundColor: s.cor }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{s.nome}</span>
                <RarityDot rarity={s.raridade} withLabel />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
