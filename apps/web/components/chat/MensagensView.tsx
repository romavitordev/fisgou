"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { ConversationList } from "./ConversationList";
import { ChatThread } from "./ChatThread";
import { NewChatButton } from "./NewChatButton";
import type { ConversationSummary } from "@fisgou/shared";

/**
 * Tela /mensagens: lista + thread. Desktop = duas colunas; mobile troca
 * entre lista e conversa aberta.
 */
export function MensagensView({
  conversasIniciais,
  initialActiveId = null,
}: {
  conversasIniciais: ConversationSummary[];
  initialActiveId?: string | null;
}) {
  const [conversas, setConversas] = useState(conversasIniciais);
  const [activeId, setActiveId] = useState<string | null>(initialActiveId);

  const carregar = useCallback(async () => {
    try {
      const r = await fetch("/api/conversations", { cache: "no-store" });
      if (!r.ok) return;
      const d = (await r.json()) as { conversas: ConversationSummary[] };
      setConversas(d.conversas);
    } catch {
      /* ignore */
    }
  }, []);

  // Mantém a lista fresca (novas conversas / não-lidas).
  useEffect(() => {
    const t = window.setInterval(carregar, 10000);
    return () => window.clearInterval(t);
  }, [carregar]);

  return (
    // `absolute inset-0` ancora a tela na viewport do <main> (relative):
    // cabeçalho da conversa e campo de digitação ficam FIXOS, só a lista
    // de mensagens rola, e a coluna de contatos preenche a altura toda.
    <div className="absolute inset-0 flex">
      {/* Lista */}
      <aside
        className={cn(
          "flex w-full flex-col border-border md:w-[340px] md:border-r",
          activeId && "hidden md:flex",
        )}
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h1 className="text-lg font-bold">Mensagens</h1>
          <NewChatButton
            onCreated={(id) => {
              void carregar();
              setActiveId(id);
            }}
          />
        </header>
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversas={conversas}
            activeId={activeId}
            onOpen={setActiveId}
          />
        </div>
      </aside>

      {/* Thread */}
      <section
        className={cn(
          "flex-1 flex-col",
          activeId ? "flex" : "hidden md:flex",
        )}
      >
        {activeId ? (
          <ChatThread
            conversationId={activeId}
            onBack={() => setActiveId(null)}
            onActivity={carregar}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <MessageCircle className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Suas mensagens</h2>
            <p className="mt-1 max-w-xs text-sm text-text-2">
              Escolha uma conversa ou comece uma nova para combinar a próxima
              pescaria.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
