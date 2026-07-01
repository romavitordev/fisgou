"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

/**
 * Menu "..." de uma publicação — só aparece pro autor. Apagar exige
 * confirmação em dois passos (sem modal nativo).
 *
 * `onDeleted` é usado por chamadores client (ex.: feed com polling, que
 * precisa remover o post do estado local). `redirectOnDelete` é uma URL
 * (serializável) usada quando o chamador é um Server Component — funções
 * não podem cruzar essa fronteira.
 */
export function PostMenu({
  postId,
  autorId,
  onDeleted,
  redirectOnDelete,
}: {
  postId: string;
  autorId: string;
  onDeleted?: (id: string) => void;
  redirectOnDelete?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [apagando, setApagando] = useState(false);

  if (!user || user.id !== autorId) return null;

  async function apagar() {
    if (apagando) return;
    setApagando(true);
    try {
      const r = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      if (onDeleted) onDeleted(postId);
      else if (redirectOnDelete) router.push(redirectOnDelete);
      else router.refresh();
    } catch {
      setApagando(false);
      setConfirmando(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Mais opções"
        aria-expanded={open}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <>
          {/* Backdrop pra fechar ao clicar fora. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => {
              setOpen(false);
              setConfirmando(false);
            }}
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg">
            {!confirmando ? (
              <button
                type="button"
                onClick={() => setConfirmando(true)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-surface-2"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Apagar publicação
              </button>
            ) : (
              <div className="px-3 py-2">
                <p className="mb-2 text-xs text-text-2">
                  Apagar esta publicação? Não pode ser desfeito.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={apagar}
                    disabled={apagando}
                    className="flex-1 rounded-lg bg-red-500 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-60"
                  >
                    {apagando ? "Apagando…" : "Apagar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmando(false)}
                    className="flex-1 rounded-lg border border-border py-1.5 text-xs font-semibold hover:bg-surface-2"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
