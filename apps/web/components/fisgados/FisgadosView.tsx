"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { TopBar, TopBarTitle } from "@/components/layout/TopBar";
import { PageContainer } from "@/components/layout/PageContainer";
import { Chip } from "@/components/ui/Chip";
import { SpeciesCard } from "@/components/fisgados/SpeciesCard";
import { LockedSpeciesCard } from "@/components/fisgados/LockedSpeciesCard";
import { Button } from "@/components/ui/Button";
import { RarityDot } from "@/components/ui/RarityDot";
import type { CollectionEntry, Rarity, Species, WaterType } from "@fisgou/shared";

type Filtro = "todos" | WaterType | "regiao";

const filtros: { id: Filtro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "doce", label: "água doce" },
  { id: "salgada", label: "água salgada" },
  { id: "regiao", label: "região" },
];

const legenda: Rarity[] = ["comum", "incomum", "raro", "lendario"];

export function FisgadosView({
  entries,
  locked,
  capturadas,
  total,
}: {
  entries: CollectionEntry[];
  locked: Species[];
  capturadas: number;
  total: number;
}) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const entradasVisiveis = useMemo(() => {
    if (filtro === "doce" || filtro === "salgada") {
      return entries.filter((e) => e.species.agua === filtro);
    }
    return entries;
  }, [filtro, entries]);

  const mostrarBloqueados = filtro === "todos" || filtro === "regiao";

  return (
    <PageContainer width="wide">
      <TopBar
        actions={
          <span className="text-right">
            <span className="block text-lg font-bold leading-none text-brand">
              {capturadas}
              <span className="text-text-2">/{total}</span>
            </span>
            <span className="text-xs text-text-2">espécies</span>
          </span>
        }
      >
        <TopBarTitle title="FISGADOS" subtitle="sua coleção de espécies" />
      </TopBar>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-3">
        {filtros.map((f) => (
          <Chip
            key={f.id}
            tone="brand"
            active={filtro === f.id}
            onClick={() => setFiltro(f.id)}
          >
            {f.label}
          </Chip>
        ))}
      </div>

      <div className="px-3 pb-28">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {entradasVisiveis.map((entry) => (
            <SpeciesCard key={entry.species.id} entry={entry} />
          ))}
          {mostrarBloqueados &&
            locked.map((s) => <LockedSpeciesCard key={s.id} />)}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4">
          <span className="text-xs font-medium text-text-2">Raridade:</span>
          {legenda.map((r) => (
            <RarityDot key={r} rarity={r} withLabel />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-surface p-3">
        <Button size="lg" className="w-full">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Provar um peixe
        </Button>
      </div>
    </PageContainer>
  );
}
