"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import { TopBar, TopBarTitle } from "@/components/layout/TopBar";
import { PageContainer } from "@/components/layout/PageContainer";
import { Chip } from "@/components/ui/Chip";
import { Avatar } from "@/components/ui/Avatar";
import { RarityDot } from "@/components/ui/RarityDot";
import { formatNota } from "@/lib/format";
import type { User, Species, Pesqueiro } from "@fisgou/shared";

// Remove acentos para busca tolerante (NFD + corta diacríticos).
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

type Tipo = "tudo" | "pescadores" | "especies" | "pesqueiros";

const filtros: { id: Tipo; label: string }[] = [
  { id: "tudo", label: "Tudo" },
  { id: "pescadores", label: "Pescadores" },
  { id: "especies", label: "Espécies" },
  { id: "pesqueiros", label: "Pesqueiros" },
];

export function BuscarView({
  users,
  species,
  pesqueiros,
}: {
  users: User[];
  species: Species[];
  pesqueiros: Pesqueiro[];
}) {
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<Tipo>("tudo");
  const termo = norm(q.trim());

  const r = useMemo(() => {
    if (!termo) return { users: [], species: [], pesqueiros: [] };
    const match = (s: string) => norm(s).includes(termo);
    return {
      users: users.filter((u) => match(u.nome) || match(u.handle)),
      species: species.filter((s) => match(s.nome) || match(s.nomeCientifico)),
      pesqueiros: pesqueiros.filter((p) => match(p.nome) || match(p.tipo)),
    };
  }, [termo, users, species, pesqueiros]);

  const mostra = (t: Tipo) => tipo === "tudo" || tipo === t;
  const total = r.users.length + r.species.length + r.pesqueiros.length;
  const vazio = termo.length > 0 && total === 0;

  return (
    <PageContainer>
      <TopBar>
        <TopBarTitle title="Buscar" />
      </TopBar>

      {/* Campo de busca centralizado e em destaque */}
      <div className="px-4 pt-4">
        <div className="relative mx-auto max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-2"
            aria-hidden="true"
          />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar pescadores, espécies, pesqueiros…"
            aria-label="Buscar"
            className="w-full rounded-full border border-border bg-surface-2 py-3 pl-11 pr-4 text-center text-sm placeholder:text-text-2 focus:border-brand focus:bg-surface focus:text-left focus:outline-none"
          />
        </div>

        {/* Filtros por tipo */}
        <div className="no-scrollbar mx-auto mt-3 flex max-w-md justify-center gap-2 overflow-x-auto">
          {filtros.map((f) => (
            <Chip
              key={f.id}
              tone="brand"
              active={tipo === f.id}
              onClick={() => setTipo(f.id)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-6 p-4">
        {!termo && (
          <p className="py-8 text-center text-sm text-text-2">
            Comece a digitar para encontrar pessoas, espécies e pesqueiros.
          </p>
        )}

        {vazio && (
          <p className="py-8 text-center text-sm text-text-2">
            Nada encontrado para “{q}”.
          </p>
        )}

        {mostra("pescadores") && r.users.length > 0 && (
          <Secao titulo="Pescadores">
            {r.users.map((u) => (
              <Link
                key={u.id}
                href={`/u/${u.handle}`}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-2"
              >
                <Avatar iniciais={u.iniciais} cor={u.cor} size="md" src={u.imagemUrl} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {u.nome}
                  </span>
                  <span className="block truncate text-xs text-text-2">
                    @{u.handle}
                  </span>
                </span>
              </Link>
            ))}
          </Secao>
        )}

        {mostra("especies") && r.species.length > 0 && (
          <Secao titulo="Espécies">
            {r.species.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl p-2">
                <span
                  className="h-10 w-10 shrink-0 rounded-lg"
                  style={{ backgroundColor: s.cor }}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {s.nome}
                  </span>
                  <RarityDot rarity={s.raridade} withLabel />
                </span>
              </div>
            ))}
          </Secao>
        )}

        {mostra("pesqueiros") && r.pesqueiros.length > 0 && (
          <Secao titulo="Pesqueiros">
            {r.pesqueiros.map((p) => (
              <Link
                key={p.id}
                href={`/pesqueiros/${p.id}`}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-2"
              >
                <span
                  className="h-10 w-10 shrink-0 rounded-lg"
                  style={{ backgroundColor: p.cor }}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {p.nome}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-2">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {p.distanciaKm} km · ★ {formatNota(p.nota)}
                  </span>
                </span>
              </Link>
            ))}
          </Secao>
        )}
      </div>
    </PageContainer>
  );
}

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-text-2">
        {titulo}
      </h2>
      <div className="space-y-1">{children}</div>
    </section>
  );
}
