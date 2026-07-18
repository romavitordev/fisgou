"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  MapPin,
  Users,
  Footprints,
  ImageIcon,
  Star,
  Pencil,
  ExternalLink,
  Plus,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PesqueiroForm } from "./PesqueiroForm";
import { CapturasPendentes } from "./CapturasPendentes";
import { pesqueiroTipoLabel } from "@/lib/rarity";
import { formatNota, tempoRelativo } from "@/lib/format";
import type { PainelPesqueiro } from "@/lib/queries";
import type { Post } from "@fisgou/shared";

export function PainelView({
  pesqueiros,
  capturasPendentes = [],
  nomeNegocio,
}: {
  pesqueiros: PainelPesqueiro[];
  capturasPendentes?: Post[];
  nomeNegocio?: string;
}) {
  const [criando, setCriando] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const vazio = pesqueiros.length === 0;

  return (
    <div className="px-4 py-5">
      {/* Cabeçalho */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-brand">
          <Store className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Painel do vendedor
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          {nomeNegocio || "Meus pesqueiros"}
        </h1>
        <p className="mt-1 text-sm text-text-2">
          Gerencie seus pesqueiros e acompanhe o movimento de quem pesca com você.
        </p>
      </header>

      {/* Fila de verificação de capturas */}
      <CapturasPendentes capturas={capturasPendentes} />

      {/* Estado vazio → form de cadastro do primeiro pesqueiro */}
      {vazio && !criando && (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <span className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Store className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold">Cadastre seu primeiro pesqueiro</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-text-2">
            Ele aparece na busca e no mapa do app, recebe check-ins e pode ser
            marcado nas publicações dos pescadores.
          </p>
          <Button className="mt-4" onClick={() => setCriando(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Cadastrar pesqueiro
          </Button>
        </div>
      )}

      {/* Form de cadastro (primeiro ou adicional) */}
      {criando && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-4 text-lg font-semibold">Novo pesqueiro</h2>
          <PesqueiroForm
            onSaved={() => setCriando(false)}
            onCancel={() => setCriando(false)}
          />
        </section>
      )}

      {/* Lista de pesqueiros */}
      {!vazio && (
        <div className="space-y-5">
          {pesqueiros.map((p) =>
            editandoId === p.pesqueiro.id ? (
              <section
                key={p.pesqueiro.id}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <h2 className="mb-4 text-lg font-semibold">Editar pesqueiro</h2>
                <PesqueiroForm
                  pesqueiro={p.pesqueiro}
                  onSaved={() => setEditandoId(null)}
                  onCancel={() => setEditandoId(null)}
                />
              </section>
            ) : (
              <PesqueiroCard
                key={p.pesqueiro.id}
                dados={p}
                onEditar={() => setEditandoId(p.pesqueiro.id)}
              />
            ),
          )}

          {!criando && (
            <button
              type="button"
              onClick={() => setCriando(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-surface/50 py-4 text-sm font-medium text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Adicionar outro pesqueiro
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PesqueiroCard({
  dados,
  onEditar,
}: {
  dados: PainelPesqueiro;
  onEditar: () => void;
}) {
  const { pesqueiro: p, totalCheckIns, visitantesUnicos, totalPosts } = dados;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* Faixa de capa com a cor escolhida */}
      <div className="h-16 w-full" style={{ backgroundColor: p.cor }} />

      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{p.nome}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium capitalize text-text">
                {pesqueiroTipoLabel[p.tipo]}
              </span>
              {p.cidade && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {p.cidade}
                </span>
              )}
              {p.avaliacoes > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star
                    className="h-3.5 w-3.5 fill-amber text-amber"
                    aria-hidden="true"
                  />
                  {formatNota(p.nota)} ({p.avaliacoes})
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/pesqueiros/${p.id}`}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Ver página</span>
            </Link>
            <Button size="sm" variant="secondary" onClick={onEditar}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Editar
            </Button>
          </div>
        </div>

        {p.descricao && (
          <p className="mt-3 whitespace-pre-line text-sm text-text-2">{p.descricao}</p>
        )}

        {/* Estatísticas */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat icon={Footprints} valor={totalCheckIns} rotulo="check-ins" />
          <Stat icon={Users} valor={visitantesUnicos} rotulo="visitantes" />
          <Stat icon={ImageIcon} valor={totalPosts} rotulo="publicações" />
        </div>

        {/* Check-ins recentes */}
        {dados.checkInsRecentes.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-semibold">Quem pescou aqui</h3>
            <ul className="space-y-2">
              {dados.checkInsRecentes.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Link href={`/u/${c.user.handle}`} className="shrink-0">
                    <Avatar
                      iniciais={c.user.iniciais}
                      cor={c.user.cor}
                      src={c.user.imagemUrl}
                      size="sm"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/u/${c.user.handle}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {c.user.nome}
                    </Link>
                  </div>
                  <span className="shrink-0 text-xs text-text-2">
                    {tempoRelativo(c.criadoEm)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Publicações recentes marcando o pesqueiro */}
        {dados.postsRecentes.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-semibold">Publicações recentes</h3>
            <ul className="space-y-2">
              {dados.postsRecentes.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/post/${post.id}`}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-2"
                  >
                    <span
                      className="h-10 w-10 shrink-0 overflow-hidden rounded-lg"
                      style={{ backgroundColor: post.imagemCor }}
                    >
                      {post.imagemUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.imagemUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">
                        <span className="font-medium">{post.autor.nome}</span>{" "}
                        <span className="text-text-2">{post.legenda}</span>
                      </span>
                      <span className="text-xs text-text-2">
                        {tempoRelativo(post.criadoEm)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  valor,
  rotulo,
}: {
  icon: typeof Users;
  valor: number;
  rotulo: string;
}) {
  return (
    <div className="rounded-xl bg-surface-2 p-3 text-center">
      <Icon className="mx-auto mb-1 h-4 w-4 text-brand" aria-hidden="true" />
      <div className="text-lg font-bold leading-none">{valor}</div>
      <div className="mt-1 text-[11px] text-text-2">{rotulo}</div>
    </div>
  );
}
