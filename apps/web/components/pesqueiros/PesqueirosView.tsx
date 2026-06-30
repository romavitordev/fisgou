"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TopBar, TopBarTitle } from "@/components/layout/TopBar";
import { PageContainer } from "@/components/layout/PageContainer";
import { Chip } from "@/components/ui/Chip";
import { MapPlaceholder } from "@/components/pesqueiros/MapPlaceholder";
import { PesqueirosMap } from "@/components/pesqueiros/PesqueirosMap";
import { PesqueiroCard } from "@/components/pesqueiros/PesqueiroCard";
import type { Pesqueiro, PesqueiroTipo } from "@fisgou/shared";

// Inlined no build; com chave usamos o mapa real, senão o placeholder.
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type Filtro = "todos" | PesqueiroTipo;

const filtros: { id: Filtro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pesque-pague", label: "pesque-pague" },
  { id: "represa", label: "represa" },
  { id: "rio", label: "rio" },
  { id: "lago", label: "lago" },
];

export function PesqueirosView({ pesqueiros }: { pesqueiros: Pesqueiro[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const lista = useMemo(
    () =>
      filtro === "todos"
        ? pesqueiros
        : pesqueiros.filter((p) => p.tipo === filtro),
    [filtro, pesqueiros],
  );

  const pins = useMemo(
    () =>
      lista.map((p, i) => ({
        x: 18 + ((i * 27) % 64),
        y: 22 + ((i * 19) % 48),
        nota: p.nota,
      })),
    [lista],
  );

  return (
    <PageContainer width="wide">
      <TopBar
        actions={
          <button
            type="button"
            aria-label="Buscar pesqueiros"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
        }
      >
        <TopBarTitle title="Pesqueiros" />
      </TopBar>

      <div className="space-y-4 p-3">
        {MAPS_KEY ? (
          <PesqueirosMap pesqueiros={lista} apiKey={MAPS_KEY} />
        ) : (
          <MapPlaceholder pins={pins} />
        )}

        <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
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

        <div className="space-y-3">
          {lista.map((p) => (
            <PesqueiroCard key={p.id} pesqueiro={p} />
          ))}
          {lista.length === 0 && (
            <p className="py-8 text-center text-sm text-text-2">
              Nenhum pesqueiro deste tipo por perto.
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
