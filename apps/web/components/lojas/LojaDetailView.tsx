"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, MessageCircle, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatNota } from "@/lib/format";
import { precoBRL, type LojaMock } from "@/data/lojas-mock";

/**
 * Página de uma loja parceira (E2, mock): capa, dados, catálogo de
 * produtos e ação "Falar com a loja" (aviso de demonstração — sem chat
 * real com a loja ainda).
 */
export function LojaDetailView({ loja }: { loja: LojaMock }) {
  const [avisoChat, setAvisoChat] = useState(false);
  const [adicionado, setAdicionado] = useState<string | null>(null);

  return (
    <div className="pb-8">
      {/* Capa */}
      <div className="relative">
        <div className="h-32 w-full" style={{ backgroundColor: loja.cor }} aria-hidden="true" />
        <Link
          href="/lojas"
          aria-label="Voltar"
          className="absolute left-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur transition-colors hover:bg-black/40"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <span
          className="absolute -bottom-8 left-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white ring-4 ring-bg"
          style={{ backgroundColor: loja.cor }}
          aria-hidden="true"
        >
          {loja.iniciais}
        </span>
      </div>

      <div className="px-4 pt-10">
        <h1 className="text-xl font-bold">{loja.nome}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-2">
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-text">
            {loja.categoria}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber text-amber" aria-hidden="true" />
            {formatNota(loja.nota)} ({loja.avaliacoes})
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {loja.cidade}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-2">{loja.descricao}</p>

        <Button className="mt-4 w-full" onClick={() => setAvisoChat(true)}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Falar com a loja
        </Button>
      </div>

      {/* Catálogo */}
      <section className="px-4 pt-6">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
          <ShoppingBag className="h-4 w-4 text-brand" aria-hidden="true" />
          Produtos
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {loja.produtos.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <span
                className="relative flex h-28 items-center justify-center text-5xl"
                style={{ backgroundColor: p.cor }}
                aria-hidden="true"
              >
                {p.emoji}
                {p.precoAntigo && (
                  <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    OFERTA
                  </span>
                )}
              </span>
              <div className="p-3">
                <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium">
                  {p.nome}
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-brand">{precoBRL(p.preco)}</span>
                  {p.precoAntigo && (
                    <span className="text-xs text-text-2 line-through">
                      {precoBRL(p.precoAntigo)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAdicionado(p.id);
                    window.setTimeout(() => setAdicionado((cur) => (cur === p.id ? null : cur)), 1500);
                  }}
                  className="mt-2 w-full rounded-xl bg-brand-soft py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-fg"
                >
                  {adicionado === p.id ? "Adicionado ✓" : "Adicionar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-6 px-4 text-center text-xs text-text-2">
        Loja de demonstração — sem checkout ou estoque reais.
      </p>

      {/* Aviso "Falar com a loja" (mock) */}
      {avisoChat && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setAvisoChat(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-2xl bg-surface p-5 text-center sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: loja.cor }}
              aria-hidden="true"
            >
              <MessageCircle className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="text-base font-semibold">Falar com {loja.nome}</h3>
            <p className="mt-1 text-sm text-text-2">
              O chat com lojas parceiras está a caminho. Em breve você conversa
              direto com a loja por aqui pra tirar dúvidas e combinar entregas.
            </p>
            <Button className="mt-4 w-full" onClick={() => setAvisoChat(false)}>
              <X className="h-4 w-4" aria-hidden="true" />
              Entendi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
