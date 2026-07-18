"use client";

import { useMemo, useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
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

const RAIOS_KM = [10, 25, 50, 100];

/** Distância em km entre duas coordenadas (fórmula de Haversine). */
function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

type GeoStatus = "inativo" | "carregando" | "ativo" | "erro";

export function PesqueirosView({ pesqueiros }: { pesqueiros: Pesqueiro[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [cidade, setCidade] = useState<string | null>(null);
  const [geo, setGeo] = useState<GeoStatus>("inativo");
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [raio, setRaio] = useState(50);

  const cidades = useMemo(
    () =>
      [...new Set(pesqueiros.map((p) => p.cidade).filter(Boolean))] as string[],
    [pesqueiros],
  );

  function alternarPertoDeMim() {
    if (geo === "ativo" || geo === "carregando") {
      setGeo("inativo");
      setPos(null);
      return;
    }
    if (!navigator.geolocation) {
      setGeo("erro");
      return;
    }
    setGeo("carregando");
    navigator.geolocation.getCurrentPosition(
      (r) => {
        setPos({ lat: r.coords.latitude, lng: r.coords.longitude });
        setGeo("ativo");
      },
      () => setGeo("erro"),
      { timeout: 10_000, maximumAge: 60_000 },
    );
  }

  const lista = useMemo(() => {
    let l = pesqueiros;
    if (filtro !== "todos") l = l.filter((p) => p.tipo === filtro);
    if (cidade) l = l.filter((p) => p.cidade === cidade);

    // Perto de mim: recalcula a distância real, filtra pelo raio e
    // ordena do mais perto pro mais longe.
    if (geo === "ativo" && pos) {
      l = l
        .filter((p) => p.lat != null && p.lng != null)
        .map((p) => ({
          ...p,
          distanciaKm:
            Math.round(distanciaKm(pos.lat, pos.lng, p.lat!, p.lng!) * 10) / 10,
        }))
        .filter((p) => p.distanciaKm <= raio)
        .sort((a, b) => a.distanciaKm - b.distanciaKm);
    }
    return l;
  }, [pesqueiros, filtro, cidade, geo, pos, raio]);

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

        {/* Tipo */}
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

        {/* Cidade + perto de mim */}
        <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
          <Chip
            tone="brand"
            active={geo === "ativo" || geo === "carregando"}
            onClick={alternarPertoDeMim}
            aria-label="Filtrar pesqueiros perto de mim"
          >
            {geo === "carregando" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Perto de mim
          </Chip>
          <Chip tone="neutral" active={cidade === null} onClick={() => setCidade(null)}>
            Todas as cidades
          </Chip>
          {cidades.map((c) => (
            <Chip
              key={c}
              tone="neutral"
              active={cidade === c}
              onClick={() => setCidade(cidade === c ? null : c)}
            >
              {c}
            </Chip>
          ))}
        </div>

        {/* Raio (só com geolocalização ativa) */}
        {geo === "ativo" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-2">
              Raio
            </span>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {RAIOS_KM.map((r) => (
                <Chip
                  key={r}
                  tone="brand"
                  active={raio === r}
                  onClick={() => setRaio(r)}
                >
                  {r} km
                </Chip>
              ))}
            </div>
          </div>
        )}

        {geo === "erro" && (
          <p role="alert" className="text-sm text-text-2">
            Não conseguimos sua localização — verifique a permissão do
            navegador e tente de novo.
          </p>
        )}

        <div className="space-y-3">
          {lista.map((p) => (
            <PesqueiroCard key={p.id} pesqueiro={p} />
          ))}
          {lista.length === 0 && (
            <p className="py-8 text-center text-sm text-text-2">
              {geo === "ativo"
                ? `Nenhum pesqueiro num raio de ${raio} km.`
                : "Nenhum pesqueiro com esses filtros."}
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
