"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Scale, Ruler, Clock, ChevronRight, Sparkles } from "lucide-react";
import { SpeciesCard } from "@/components/fisgados/SpeciesCard";
import { LockedSpeciesCard } from "@/components/fisgados/LockedSpeciesCard";
import { ProgressoColecao } from "@/components/fisgados/ProgressoColecao";
import { RarityDot } from "@/components/ui/RarityDot";
import { cn } from "@/lib/cn";
import { rarityLabel } from "@/lib/rarity";
import type { CollectionEntry, Species, Rarity } from "@fisgou/shared";

/** Ordem de raridade (do mais raro pro mais comum). */
const RARIDADE_PESO: Record<Rarity, number> = {
  lendario: 0,
  raro: 1,
  incomum: 2,
  comum: 3,
};

/**
 * Peso/tamanho MOCK e determinístico por espécie (não há métrica real
 * ainda). Estável entre renders — some quando o backend guardar de verdade.
 */
function metricasMock(s: Species) {
  let h = 0;
  for (const ch of s.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const base = RARIDADE_PESO[s.raridade];
  const kg = (12 - base * 2 + (h % 40) / 10).toFixed(1);
  const cm = 90 - base * 12 - (h % 15);
  return { kg: `${kg} kg`.replace(".", ","), cm: `${cm} cm` };
}

/**
 * Aba Fisgados (item 4 + F2). Visão enxuta: 3 resumos (Maior / Mais
 * Pesado / Último) + os 6 mais raros. "Ver mais" expande a coleção
 * inteira; "Ver todos" leva ao catálogo. Menos poluição no 1º olhar.
 */
export function FisgadosTab({
  entries,
  locked,
  capturadas,
  total,
  isMe,
}: {
  entries: CollectionEntry[];
  locked: Species[];
  capturadas: number;
  total: number;
  isMe: boolean;
}) {
  const [expandido, setExpandido] = useState(false);

  const ordenados = useMemo(
    () =>
      [...entries].sort(
        (a, b) => RARIDADE_PESO[a.species.raridade] - RARIDADE_PESO[b.species.raridade],
      ),
    [entries],
  );

  const raros = ordenados.slice(0, 6);

  const ultimo = useMemo(() => {
    const comData = entries.filter((e) => e.capturadoEm);
    if (comData.length === 0) return entries[0];
    return [...comData].sort(
      (a, b) => +new Date(b.capturadoEm!) - +new Date(a.capturadoEm!),
    )[0];
  }, [entries]);

  const maior = ordenados[0]; // o mais raro como "troféu" de maior
  const maisPesado = ordenados[1] ?? ordenados[0];

  if (entries.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-text-2">
        {isMe
          ? "Você ainda não fisgou nenhuma espécie. Publique uma captura pra começar sua coleção!"
          : "Nenhum fisgado ainda."}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Resumos: Maior · Mais Pesado · Último */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {maior && (
          <ResumoCard
            icon={Ruler}
            titulo="Maior Fisgado"
            species={maior.species}
            valor={metricasMock(maior.species).cm}
          />
        )}
        {maisPesado && (
          <ResumoCard
            icon={Scale}
            titulo="Mais Pesado"
            species={maisPesado.species}
            valor={metricasMock(maisPesado.species).kg}
          />
        )}
        {ultimo && (
          <ResumoCard
            icon={Clock}
            titulo="Último Fisgado"
            species={ultimo.species}
            valor={
              ultimo.capturadoEm
                ? new Date(ultimo.capturadoEm).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })
                : "recente"
            }
          />
        )}
      </div>

      {/* Cabeçalho da coleção + ver todos (catálogo) */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
          {expandido ? "Coleção completa" : "Mais raros"}
          <span className="text-text-2">
            · {capturadas}/{total}
          </span>
        </h2>
        <Link
          href="/fisgados"
          className="inline-flex items-center gap-0.5 text-sm font-medium text-brand hover:underline"
        >
          Ver todos
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Grade: 6 mais raros (enxuto) ou coleção inteira (expandido) */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {(expandido ? ordenados : raros).map((entry) => (
          <SpeciesCard key={entry.species.id} entry={entry} />
        ))}
        {expandido && isMe && locked.map((s) => <LockedSpeciesCard key={s.id} />)}
      </div>

      {/* Ver mais / menos */}
      {(entries.length > 6 || (isMe && locked.length > 0)) && (
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className={cn(
            "w-full rounded-xl border border-border py-2.5 text-sm font-medium text-text-2 transition-colors hover:bg-surface-2 hover:text-text",
          )}
        >
          {expandido ? "Ver menos" : `Ver mais (${entries.length - raros.length + (isMe ? locked.length : 0)})`}
        </button>
      )}

      {isMe && <ProgressoColecao capturadas={capturadas} total={total} />}
    </div>
  );
}

function ResumoCard({
  icon: Icon,
  titulo,
  species,
  valor,
}: {
  icon: typeof Scale;
  titulo: string;
  species: Species;
  valor: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-text-2">
        <Icon className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
        {titulo}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: species.cor }}
          aria-hidden="true"
        >
          {species.nome[0]}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{species.nome}</p>
          <p className="flex items-center gap-1 text-xs text-text-2">
            <RarityDot rarity={species.raridade} />
            {rarityLabel[species.raridade]}
          </p>
        </div>
      </div>
      <p className="mt-2 text-lg font-bold text-brand">{valor}</p>
    </div>
  );
}
