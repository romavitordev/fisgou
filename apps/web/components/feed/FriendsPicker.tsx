"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Search, Check } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { User } from "@fisgou/shared";

/**
 * Bottom sheet multi-seleção para marcar amigos (quem o usuário segue).
 * Retorna os usuários escolhidos ao confirmar.
 */
export function FriendsPicker({
  jaSelecionados = [],
  onConfirm,
  onClose,
}: {
  jaSelecionados?: User[];
  onConfirm: (users: User[]) => void;
  onClose: () => void;
}) {
  const [lista, setLista] = useState<User[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Set<string>>(
    () => new Set(jaSelecionados.map((u) => u.id)),
  );

  useEffect(() => {
    fetch("/api/users/following")
      .then((r) => r.json())
      .then((d) => setLista(d.users ?? []))
      .finally(() => setCarregando(false));
  }, []);

  const termo = q.trim().toLowerCase();
  const filtrados = useMemo(
    () =>
      lista.filter(
        (u) =>
          u.nome.toLowerCase().includes(termo) ||
          u.handle.toLowerCase().includes(termo),
      ),
    [lista, termo],
  );

  function toggle(id: string) {
    setSel((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function confirmar() {
    onConfirm(lista.filter((u) => sel.has(u.id)));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex max-h-[80vh] w-full max-w-sm flex-col rounded-t-2xl bg-surface sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-semibold">
            Marcar amigos{sel.size > 0 ? ` (${sel.size})` : ""}
          </h2>
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
            placeholder="Buscar quem você segue…"
            className="campo pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {carregando && (
            <p className="px-3 py-6 text-center text-sm text-text-2">Carregando…</p>
          )}
          {!carregando && lista.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-text-2">
              Você ainda não segue ninguém para marcar.
            </p>
          )}
          {!carregando && lista.length > 0 && filtrados.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-text-2">
              Nenhum resultado.
            </p>
          )}
          {filtrados.map((u) => {
            const ativo = sel.has(u.id);
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => toggle(u.id)}
                aria-pressed={ativo}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-surface-2"
              >
                <Avatar iniciais={u.iniciais} cor={u.cor} size="md" src={u.imagemUrl} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{u.nome}</span>
                  <span className="block truncate text-xs text-text-2">
                    @{u.handle}
                  </span>
                </span>
                <span
                  className={cn(
                    "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    ativo
                      ? "border-brand bg-brand text-brand-fg"
                      : "border-border",
                  )}
                  aria-hidden="true"
                >
                  {ativo && <Check className="h-3.5 w-3.5" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-border p-3">
          <Button className="w-full" onClick={confirmar}>
            {sel.size > 0 ? `Marcar ${sel.size}` : "Concluir"}
          </Button>
        </div>
      </div>
    </div>
  );
}
