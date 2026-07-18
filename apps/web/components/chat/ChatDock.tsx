"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { useChat } from "@/lib/chat-context";
import { cn } from "@/lib/cn";
import { ConversationList } from "./ConversationList";
import { ChatThread } from "./ChatThread";
import { NewChatButton } from "./NewChatButton";
import type { ConversationSummary } from "@fisgou/shared";

/**
 * Dock de chat flutuante (desktop) — estilo Instagram/Messenger.
 * Botão no canto inferior direito abre um painel com as conversas;
 * clicar numa conversa abre uma janela flutuante (até 3 lado a lado).
 * Escondido no mobile (lá usa-se a página /mensagens) e na própria /mensagens.
 */
export function ChatDock() {
  const pathname = usePathname();
  const { unread, refreshUnread, openIds, openConversation, closeConversation } =
    useChat();
  const [painelAberto, setPainelAberto] = useState(false);
  const [conversas, setConversas] = useState<ConversationSummary[]>([]);

  const carregar = async () => {
    try {
      const r = await fetch("/api/conversations", { cache: "no-store" });
      if (!r.ok) return;
      const d = (await r.json()) as { conversas: ConversationSummary[] };
      setConversas(d.conversas);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (painelAberto) void carregar();
  }, [painelAberto]);

  // Não duplica na página dedicada de mensagens.
  if (pathname?.startsWith("/mensagens")) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 hidden items-end gap-3 md:flex">
      {/* Janelas abertas */}
      {openIds.map((id) => (
        <div
          key={id}
          className="pointer-events-auto flex h-[440px] w-80 flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-xl"
        >
          <ChatThread
            conversationId={id}
            compact
            onClose={() => closeConversation(id)}
            onActivity={() => {
              refreshUnread();
              if (painelAberto) void carregar();
            }}
          />
        </div>
      ))}

      {/* Painel de conversas */}
      {painelAberto && (
        <div className="pointer-events-auto flex h-[440px] w-80 flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-xl">
          <header className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <h2 className="text-sm font-bold">Mensagens</h2>
            <div className="flex items-center gap-1">
              <NewChatButton
                onCreated={(id) => {
                  openConversation(id);
                  setPainelAberto(false);
                }}
              />
              <button
                type="button"
                onClick={() => setPainelAberto(false)}
                aria-label="Fechar"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-2 hover:bg-surface-2"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversas={conversas}
              onOpen={(id) => {
                openConversation(id);
                setPainelAberto(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Botão lançador */}
      <button
        type="button"
        onClick={() => setPainelAberto((v) => !v)}
        aria-label="Mensagens"
        className={cn(
          "pointer-events-auto relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-fg shadow-lg transition-transform hover:scale-105 active:scale-95",
        )}
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white ring-2 ring-bg">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
    </div>
  );
}
