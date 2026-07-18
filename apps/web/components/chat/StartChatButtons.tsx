"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, CalendarPlus, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useChat } from "@/lib/chat-context";
import { cn } from "@/lib/cn";
import type { User } from "@fisgou/shared";

/** Abre a conversa no dock (desktop) ou na página /mensagens (mobile). */
function useOpenConv() {
  const { openConversation } = useChat();
  const router = useRouter();
  return useCallback(
    (id: string) => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches
      ) {
        openConversation(id);
      } else {
        router.push(`/mensagens?c=${id}`);
      }
    },
    [openConversation, router],
  );
}

/** Botão "Falar com Pesqueiro" — abre/cria a conversa com o estabelecimento. */
export function FalarComPesqueiroButton({ pesqueiroId }: { pesqueiroId: string }) {
  const abrir = useOpenConv();
  const [carregando, setCarregando] = useState(false);

  async function onClick() {
    if (carregando) return;
    setCarregando(true);
    try {
      const r = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pesqueiroId }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.id) abrir(d.id as string);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Button className="flex-1" onClick={onClick} disabled={carregando}>
      {carregando ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
      )}
      Falar com Pesqueiro
    </Button>
  );
}

/** Botão "Combinar pescaria" — cria um grupo com amigos + evento (data/pesqueiro). */
export function CombinarPescariaButton({
  pesqueiroId,
  pesqueiroNome,
}: {
  pesqueiroId?: string;
  pesqueiroNome?: string;
}) {
  const abrir = useOpenConv();
  const [aberto, setAberto] = useState(false);
  const [seguindo, setSeguindo] = useState<User[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [titulo, setTitulo] = useState(
    pesqueiroNome ? `Pescaria no ${pesqueiroNome}` : "Pescaria",
  );
  const [data, setData] = useState("");
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!aberto) return;
    setCarregando(true);
    fetch("/api/users/following", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setSeguindo(d.users ?? []))
      .catch(() => setSeguindo([]))
      .finally(() => setCarregando(false));
  }, [aberto]);

  function toggle(id: string) {
    setSel((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function criar() {
    if (criando) return;
    if (sel.size === 0) {
      setErro("Convide pelo menos um amigo.");
      return;
    }
    setErro(null);
    setCriando(true);
    try {
      const r = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "grupo",
          titulo,
          memberIds: [...sel],
          evento: data ? { data: new Date(data).toISOString(), pesqueiroId } : undefined,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error ?? "Não foi possível criar o grupo.");
      setAberto(false);
      abrir(d.id as string);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível criar o grupo.");
    } finally {
      setCriando(false);
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setAberto(true)}>
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        Combinar pescaria
      </Button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setAberto(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-surface sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-base font-semibold">Combinar pescaria</h2>
              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-2 hover:bg-surface-2"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-4 overflow-y-auto p-4">
              {erro && (
                <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                  {erro}
                </p>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Nome do grupo</span>
                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="campo"
                  maxLength={80}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">
                  Data e hora (opcional)
                </span>
                <input
                  type="datetime-local"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="campo"
                />
              </label>

              {pesqueiroNome && (
                <p className="text-xs text-text-2">
                  Local: <span className="font-medium text-text">{pesqueiroNome}</span>
                </p>
              )}

              <div>
                <p className="mb-2 text-sm font-medium">
                  Convidar amigos{sel.size > 0 && ` (${sel.size})`}
                </p>
                {carregando ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-text-2" aria-hidden="true" />
                  </div>
                ) : seguindo.length === 0 ? (
                  <p className="py-4 text-center text-sm text-text-2">
                    Você precisa seguir amigos para convidá-los.
                  </p>
                ) : (
                  <ul className="max-h-56 space-y-1 overflow-y-auto">
                    {seguindo.map((u) => {
                      const ativo = sel.has(u.id);
                      return (
                        <li key={u.id}>
                          <button
                            type="button"
                            onClick={() => toggle(u.id)}
                            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-surface-2"
                          >
                            <Avatar
                              iniciais={u.iniciais}
                              cor={u.cor}
                              src={u.imagemUrl}
                              size="sm"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {u.nome}
                              </span>
                              <span className="block truncate text-xs text-text-2">
                                @{u.handle}
                              </span>
                            </span>
                            <span
                              className={cn(
                                "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                                ativo
                                  ? "border-brand bg-brand text-brand-fg"
                                  : "border-border",
                              )}
                            >
                              {ativo && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border p-3">
              <Button variant="secondary" onClick={() => setAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={criar} disabled={criando || sel.size === 0}>
                {criando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                Criar grupo
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
