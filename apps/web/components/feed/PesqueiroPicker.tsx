"use client";

import { useEffect, useState } from "react";
import { X, Search, MapPin } from "lucide-react";
import type { Pesqueiro } from "@fisgou/shared";

/** Bottom sheet simples para escolher um pesqueiro (busca + lista). */
export function PesqueiroPicker({
  onSelect,
  onClose,
}: {
  onSelect: (p: Pesqueiro) => void;
  onClose: () => void;
}) {
  const [lista, setLista] = useState<Pesqueiro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/pesqueiros")
      .then((r) => r.json())
      .then((d) => setLista(d.pesqueiros ?? []))
      .finally(() => setCarregando(false));
  }, []);

  const termo = q.trim().toLowerCase();
  const filtrados = lista.filter(
    (p) =>
      p.nome.toLowerCase().includes(termo) ||
      (p.endereco ?? "").toLowerCase().includes(termo),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex max-h-[80vh] w-full max-w-sm flex-col rounded-t-2xl bg-surface sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-semibold">Marcar pesqueiro</h2>
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
            placeholder="Buscar pesqueiro…"
            className="campo pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {carregando && (
            <p className="px-3 py-6 text-center text-sm text-text-2">Carregando…</p>
          )}
          {!carregando && filtrados.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-text-2">
              Nenhum pesqueiro encontrado.
            </p>
          )}
          {filtrados.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-surface-2"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: p.cor }}
                aria-hidden="true"
              >
                <MapPin className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{p.nome}</span>
                <span className="block truncate text-xs capitalize text-text-2">
                  {p.tipo.replace("-", " ")}
                  {p.endereco ? ` · ${p.endereco}` : ""}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
