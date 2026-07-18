"use client";

import { useEffect, useState } from "react";
import { PenSquare, X, Loader2, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { User } from "@fisgou/shared";

/**
 * Botão "Nova mensagem": abre um seletor de quem você segue e cria
 * (ou reabre) a DM, chamando `onCreated(convId)`.
 */
export function NewChatButton({ onCreated }: { onCreated: (id: string) => void }) {
  const [aberto, setAberto] = useState(false);
  const [seguindo, setSeguindo] = useState<User[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState("");
  const [criando, setCriando] = useState<string | null>(null);

  useEffect(() => {
    if (!aberto) return;
    setCarregando(true);
    fetch("/api/users/following", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setSeguindo(d.users ?? d.following ?? []))
      .catch(() => setSeguindo([]))
      .finally(() => setCarregando(false));
  }, [aberto]);

  async function abrirDM(u: User) {
    if (criando) return;
    setCriando(u.id);
    try {
      const r = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u.id }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.id) {
        setAberto(false);
        onCreated(d.id as string);
      }
    } finally {
      setCriando(null);
    }
  }

  const filtrados = busca.trim()
    ? seguindo.filter(
        (u) =>
          u.nome.toLowerCase().includes(busca.toLowerCase()) ||
          u.handle.toLowerCase().includes(busca.toLowerCase()),
      )
    : seguindo;

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Nova mensagem"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
      >
        <PenSquare className="h-5 w-5" aria-hidden="true" />
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setAberto(false)}
        >
          <div
            className="flex max-h-[75vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-surface sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-base font-semibold">Nova mensagem</h2>
              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-2 hover:bg-surface-2"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className="border-b border-border p-3">
              <div className="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2">
                <Search className="h-4 w-4 text-text-2" aria-hidden="true" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar quem você segue…"
                  className="w-full bg-transparent text-sm placeholder:text-text-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {carregando ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-text-2" aria-hidden="true" />
                </div>
              ) : filtrados.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-text-2">
                  {seguindo.length === 0
                    ? "Você ainda não segue ninguém para conversar."
                    : "Ninguém encontrado."}
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {filtrados.map((u) => (
                    <li key={u.id}>
                      <button
                        type="button"
                        onClick={() => abrirDM(u)}
                        disabled={!!criando}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2 disabled:opacity-60"
                      >
                        <Avatar
                          iniciais={u.iniciais}
                          cor={u.cor}
                          src={u.imagemUrl}
                          size="md"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">
                            {u.nome}
                          </span>
                          <span className="block truncate text-xs text-text-2">
                            @{u.handle}
                          </span>
                        </span>
                        {criando === u.id && (
                          <Loader2 className="h-4 w-4 animate-spin text-text-2" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
