"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Store,
  MapPin,
  Star,
  ChevronRight,
  ChevronLeft,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatNota } from "@/lib/format";
import {
  lojasMock,
  lojaCategorias,
  produtosDestaque,
  precoBRL,
} from "@/data/lojas-mock";

/**
 * Vitrine do marketplace (E2, mock): banner, carrossel de ofertas em
 * destaque e grade de lojas parceiras com filtro por categoria.
 */
export function LojasView() {
  const [categoria, setCategoria] = useState<string | null>(null);
  const ofertasRef = useRef<HTMLDivElement>(null);

  function rolarOfertas(dir: 1 | -1) {
    const el = ofertasRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  const lojas = categoria
    ? lojasMock.filter((l) => l.categoria === categoria)
    : lojasMock;

  return (
    <div className="px-4 py-5">
      {/* Cabeçalho */}
      <header className="mb-5">
        <div className="flex items-center gap-2 text-brand">
          <Store className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Marketplace
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Lojas parceiras</h1>
        <p className="mt-1 text-sm text-text-2">
          Iscas, equipamentos e tudo pra sua próxima pescaria — direto de quem é
          da comunidade.
        </p>
      </header>

      {/* Ofertas em destaque */}
      <section className="group relative mb-6">
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
          <Tag className="h-4 w-4 text-brand" aria-hidden="true" />
          Ofertas em destaque
        </h2>

        {/* Setas (desktop) — no mobile usa-se o swipe. */}
        <button
          type="button"
          onClick={() => rolarOfertas(-1)}
          aria-label="Ver ofertas anteriores"
          className="absolute left-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 text-text shadow-sm backdrop-blur transition-colors hover:bg-surface-2 md:flex"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => rolarOfertas(1)}
          aria-label="Ver mais ofertas"
          className="absolute right-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 text-text shadow-sm backdrop-blur transition-colors hover:bg-surface-2 md:flex"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Full-bleed (-mx-4) com inset px-4: margem lateral simétrica de
            16px e os cards conseguem rolar até a borda (peek). */}
        <div
          ref={ofertasRef}
          className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 no-scrollbar"
        >
          {produtosDestaque.map((p) => (
            <Link
              key={`${p.lojaId}-${p.id}`}
              href={`/lojas/${p.lojaId}`}
              className="w-40 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
            >
              <span
                className="flex h-24 items-center justify-center text-4xl"
                style={{ backgroundColor: p.cor }}
                aria-hidden="true"
              >
                {p.emoji}
              </span>
              <span className="block p-2.5">
                <span className="block truncate text-sm font-medium">{p.nome}</span>
                <span className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-brand">
                    {precoBRL(p.preco)}
                  </span>
                  {p.precoAntigo && (
                    <span className="text-xs text-text-2 line-through">
                      {precoBRL(p.precoAntigo)}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-text-2">
                  {p.lojaNome}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Filtro por categoria */}
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
        <Chip ativo={categoria === null} onClick={() => setCategoria(null)}>
          Todas
        </Chip>
        {lojaCategorias.map((c) => (
          <Chip key={c} ativo={categoria === c} onClick={() => setCategoria(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {/* Grade de lojas */}
      <section className="grid gap-3 sm:grid-cols-2">
        {lojas.map((loja) => (
          <Link
            key={loja.id}
            href={`/lojas/${loja.id}`}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-surface-2"
          >
            <span
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white"
              style={{ backgroundColor: loja.cor }}
              aria-hidden="true"
            >
              {loja.iniciais}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                {loja.nome}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-2">
                <span className="rounded-full bg-surface-2 px-2 py-0.5 font-medium text-text">
                  {loja.categoria}
                </span>
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber text-amber" aria-hidden="true" />
                  {formatNota(loja.nota)}
                </span>
                <span className="inline-flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {loja.cidade}
                </span>
              </span>
            </span>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-text-2 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ))}
      </section>

      <p className="mt-6 text-center text-xs text-text-2">
        Vitrine de demonstração — produtos e preços são exemplos.
      </p>
    </div>
  );
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        ativo
          ? "bg-brand text-brand-fg"
          : "border border-border bg-surface text-text-2 hover:bg-surface-2 hover:text-text",
      )}
    >
      {children}
    </button>
  );
}
