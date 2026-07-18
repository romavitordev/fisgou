"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, CalendarClock, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { tempoRelativo } from "@/lib/format";
import type { ConversationDetail, Message } from "@fisgou/shared";

const POLL_MS = 5000;

/**
 * Thread de uma conversa: carrega o detalhe, faz polling incremental
 * (?after) e envia mensagens. Usada na página /mensagens e no ChatDock.
 */
export function ChatThread({
  conversationId,
  onBack,
  onActivity,
  compact = false,
}: {
  conversationId: string;
  onBack?: () => void;
  /** Avisa o pai que houve leitura/mudança (p/ atualizar badges/lista). */
  onActivity?: () => void;
  compact?: boolean;
}) {
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastAt = useRef<string | null>(null);

  const marcarLida = useCallback(async () => {
    try {
      await fetch(`/api/conversations/${conversationId}/read`, { method: "POST" });
      onActivity?.();
    } catch {
      /* ignore */
    }
  }, [conversationId, onActivity]);

  // Carga inicial.
  useEffect(() => {
    let vivo = true;
    setCarregando(true);
    setDetail(null);
    setMensagens([]);
    lastAt.current = null;
    (async () => {
      try {
        const r = await fetch(`/api/conversations/${conversationId}`, {
          cache: "no-store",
        });
        if (!r.ok) throw new Error();
        const d = (await r.json()) as { conversa: ConversationDetail };
        if (!vivo) return;
        setDetail(d.conversa);
        setMensagens(d.conversa.mensagens);
        lastAt.current = d.conversa.mensagens.at(-1)?.criadoEm ?? null;
        void marcarLida();
      } catch {
        if (vivo) setErro("Não foi possível abrir a conversa.");
      } finally {
        if (vivo) setCarregando(false);
      }
    })();
    return () => {
      vivo = false;
    };
  }, [conversationId, marcarLida]);

  // Polling incremental.
  useEffect(() => {
    const tick = async () => {
      if (!lastAt.current) return;
      try {
        const r = await fetch(
          `/api/conversations/${conversationId}/messages?after=${encodeURIComponent(
            lastAt.current,
          )}`,
          { cache: "no-store" },
        );
        if (!r.ok) return;
        const d = (await r.json()) as { mensagens: Message[] };
        if (d.mensagens.length) {
          setMensagens((prev) => [...prev, ...d.mensagens]);
          lastAt.current = d.mensagens.at(-1)!.criadoEm;
          if (d.mensagens.some((m) => !m.mine)) void marcarLida();
        }
      } catch {
        /* ignore */
      }
    };
    const t = window.setInterval(tick, POLL_MS);
    const onFocus = () => void tick();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(t);
      window.removeEventListener("focus", onFocus);
    };
  }, [conversationId, marcarLida]);

  // Rola pro fim quando a lista muda.
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [mensagens.length]);

  async function enviar() {
    const t = texto.trim();
    if (!t || enviando) return;
    setEnviando(true);
    setErro(null);
    try {
      const r = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: t }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error ?? "Falha ao enviar.");
      setMensagens((prev) => [...prev, d.mensagem as Message]);
      lastAt.current = (d.mensagem as Message).criadoEm;
      setTexto("");
      onActivity?.();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao enviar.");
    } finally {
      setEnviando(false);
    }
  }

  const grupo = detail?.tipo === "grupo";

  return (
    <div className="flex h-full flex-col">
      {/* Cabeçalho */}
      <header className="flex items-center gap-3 border-b border-border bg-surface px-3 py-2.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        {detail && (
          <>
            <Avatar
              iniciais={detail.iniciais}
              cor={detail.cor}
              src={detail.imagemUrl}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">
                {detail.outroHandle ? (
                  <Link href={`/u/${detail.outroHandle}`} className="hover:underline">
                    {detail.titulo}
                  </Link>
                ) : (
                  detail.titulo
                )}
              </p>
              <p className="truncate text-xs text-text-2">
                {grupo
                  ? `${detail.participantes.length} participantes`
                  : detail.tipo === "pesqueiro"
                    ? "Pesqueiro"
                    : detail.outroHandle
                      ? `@${detail.outroHandle}`
                      : ""}
              </p>
            </div>
          </>
        )}
      </header>

      {/* Card de evento (Combinar Pescaria) */}
      {detail?.evento && (
        <div className="border-b border-border bg-brand-soft/60 px-4 py-2.5 text-sm">
          <p className="flex items-center gap-1.5 font-semibold text-brand">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            Pescaria combinada
          </p>
          <p className="mt-0.5 text-text-2">
            {new Date(detail.evento.data).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {detail.evento.pesqueiroNome && (
              <span className="inline-flex items-center gap-1">
                {" · "}
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {detail.evento.pesqueiroNome}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Mensagens */}
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 space-y-2 overflow-y-auto px-3 py-3",
          compact ? "min-h-0" : "",
        )}
      >
        {carregando ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-text-2" aria-hidden="true" />
          </div>
        ) : mensagens.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-2">
            Nenhuma mensagem ainda. Diga um oi! 👋
          </p>
        ) : (
          mensagens.map((m) => (
            <MessageBubble key={m.id} msg={m} grupo={grupo} />
          ))
        )}
      </div>

      {/* Composição */}
      <div className="border-t border-border bg-surface p-2">
        {erro && (
          <p role="alert" className="px-2 pb-1 text-xs text-red-600 dark:text-red-400">
            {erro}
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void enviar();
              }
            }}
            rows={1}
            placeholder="Mensagem…"
            className="max-h-28 min-h-[40px] flex-1 resize-none rounded-2xl border border-border bg-bg px-3 py-2 text-sm placeholder:text-text-2 focus:border-brand focus:outline-none"
          />
          <button
            type="button"
            onClick={enviar}
            disabled={enviando || !texto.trim()}
            aria-label="Enviar"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {enviando ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, grupo }: { msg: Message; grupo: boolean }) {
  const mine = !!msg.mine;
  return (
    <div className={cn("flex items-end gap-2", mine && "flex-row-reverse")}>
      {!mine && (
        <Avatar
          iniciais={msg.autor.iniciais}
          cor={msg.autor.cor}
          src={msg.autor.imagemUrl}
          size="sm"
          className="mb-4"
        />
      )}
      <div className={cn("max-w-[78%]", mine && "items-end text-right")}>
        {!mine && grupo && (
          <p className="mb-0.5 px-1 text-[11px] font-medium text-text-2">
            {msg.autor.nome}
          </p>
        )}
        <div
          className={cn(
            "inline-block rounded-2xl px-3 py-2 text-sm",
            mine
              ? "rounded-br-md bg-brand text-brand-fg"
              : "rounded-bl-md bg-surface-2 text-text",
          )}
        >
          <span className="whitespace-pre-line break-words">{msg.texto}</span>
        </div>
        <p className="mt-0.5 px-1 text-[10px] text-text-2">
          {tempoRelativo(msg.criadoEm)}
        </p>
      </div>
    </div>
  );
}
