"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import type { Poll } from "@fisgou/shared";

/**
 * Enquete do post: antes de votar, opções como botões; depois, barras
 * de % (estilo Twitter). Voto otimista + reconciliação com a resposta.
 * Trocar de opção é permitido (o backend faz upsert).
 */
export function PollView({ poll: inicial }: { poll: Poll }) {
  const { user } = useAuth();
  const [poll, setPoll] = useState(inicial);
  const [enviando, setEnviando] = useState(false);

  const votou = !!poll.votedOptionId;

  async function votar(optionId: string) {
    if (!user || enviando || optionId === poll.votedOptionId) return;
    setEnviando(true);

    // Otimista: move o voto localmente.
    setPoll((p) => {
      const anterior = p.votedOptionId;
      const options = p.options.map((o) => {
        let votos = o.votos;
        if (o.id === anterior) votos--;
        if (o.id === optionId) votos++;
        return { ...o, votos };
      });
      return {
        ...p,
        options,
        totalVotos: anterior ? p.totalVotos : p.totalVotos + 1,
        votedOptionId: optionId,
      };
    });

    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.poll) setPoll(data.poll);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-2 px-3 pt-3" role="group" aria-label="Enquete">
      {/* Pergunta SEMPRE acima das opções. */}
      <p className="text-sm font-semibold leading-snug">{poll.pergunta}</p>
      {poll.options.map((o) => {
        const pct =
          poll.totalVotos > 0 ? Math.round((o.votos / poll.totalVotos) * 100) : 0;
        const escolhida = poll.votedOptionId === o.id;

        return (
          <button
            key={o.id}
            type="button"
            onClick={() => votar(o.id)}
            disabled={!user || enviando}
            aria-pressed={escolhida}
            className={cn(
              "relative block w-full overflow-hidden rounded-xl border px-3 py-2 text-left text-sm transition-colors",
              escolhida
                ? "border-brand font-semibold"
                : "border-border hover:bg-surface-2",
              !user && "cursor-default",
            )}
          >
            {/* Barra de % atrás do texto (só depois de alguém votar). */}
            {votou && (
              <span
                className={cn(
                  "absolute inset-y-0 left-0 transition-[width] duration-500",
                  escolhida ? "bg-brand-soft" : "bg-surface-2",
                )}
                style={{ width: `${pct}%` }}
                aria-hidden="true"
              />
            )}
            <span className="relative flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="truncate">{o.texto}</span>
                {escolhida && (
                  <Check className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                )}
              </span>
              {votou && <span className="shrink-0 text-text-2">{pct}%</span>}
            </span>
          </button>
        );
      })}
      <p className="px-1 text-xs text-text-2">
        {poll.totalVotos === 1 ? "1 voto" : `${poll.totalVotos} votos`}
      </p>
    </div>
  );
}
