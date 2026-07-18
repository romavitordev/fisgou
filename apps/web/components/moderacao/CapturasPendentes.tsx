"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Check, X, Loader2, Fish, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { RarityDot } from "@/components/ui/RarityDot";
import { tempoRelativo } from "@/lib/format";
import type { Post } from "@fisgou/shared";

/**
 * Fila de verificação de capturas — moderação Fisgou. O moderador avalia
 * se a foto é real, se a espécie confere e se ela existe naquela
 * região/pesqueiro. Aprovar/recusar chama /api/posts/[id]/verificar.
 */
export function CapturasPendentes({ capturas }: { capturas: Post[] }) {
  const [itens, setItens] = useState(capturas);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <header className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <BadgeCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold leading-tight">
            Verificações pendentes
          </h2>
          <p className="text-xs text-text-2">
            A foto é real? A espécie confere e existe nessa região/pesqueiro?
          </p>
        </div>
        {itens.length > 0 && (
          <span className="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-2 text-xs font-bold text-brand-fg">
            {itens.length}
          </span>
        )}
      </header>

      {itens.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-2">
          Nenhuma captura aguardando verificação. 🎣
        </p>
      ) : (
        <ul className="space-y-3">
          {itens.map((p) => (
            <CapturaCard
              key={p.id}
              post={p}
              onResolved={() => setItens((prev) => prev.filter((x) => x.id !== p.id))}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function CapturaCard({ post, onResolved }: { post: Post; onResolved: () => void }) {
  const router = useRouter();
  const [acao, setAcao] = useState<"aprovar" | "recusar" | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function decidir(aprovar: boolean) {
    if (acao) return;
    setAcao(aprovar ? "aprovar" : "recusar");
    setErro(null);
    try {
      const r = await fetch(`/api/posts/${post.id}/verificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aprovar }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d?.error ?? "Falha ao verificar.");
      }
      onResolved();
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao verificar.");
      setAcao(null);
    }
  }

  return (
    <li className="rounded-xl border border-border bg-bg p-3">
      <div className="flex gap-3">
        {/* Thumb da captura */}
        <span
          className="h-16 w-16 shrink-0 overflow-hidden rounded-lg"
          style={{ backgroundColor: post.imagemCor }}
        >
          {post.imagemUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imagemUrl} alt="" className="h-full w-full object-cover" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          {/* Espécie declarada */}
          {post.especie ? (
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <RarityDot rarity={post.especie.raridade} />
              {post.especie.nome}
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-text-2">
              <Fish className="h-4 w-4" aria-hidden="true" />
              Espécie não informada
            </p>
          )}

          <p className="mt-0.5 flex items-center gap-1 text-xs text-text-2">
            <Link
              href={`/u/${post.autor.handle}`}
              className="inline-flex items-center gap-1 hover:underline"
            >
              <Avatar
                iniciais={post.autor.iniciais}
                cor={post.autor.cor}
                src={post.autor.imagemUrl}
                size="sm"
                className="h-4 w-4 text-[8px]"
              />
              {post.autor.nome}
            </Link>
            · {tempoRelativo(post.criadoEm)}
          </p>

          {post.pesqueiro && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-text-2">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {post.pesqueiro.nome}
            </p>
          )}

          {post.legenda && (
            <p className="mt-1 line-clamp-2 text-xs text-text-2">{post.legenda}</p>
          )}
        </div>
      </div>

      {erro && (
        <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => decidir(true)}
          disabled={!!acao}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-brand-fg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {acao === "aprovar" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="h-4 w-4" aria-hidden="true" />
          )}
          Verificar
        </button>
        <button
          type="button"
          onClick={() => decidir(false)}
          disabled={!!acao}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-text-2 transition-colors hover:bg-surface-2 hover:text-text disabled:opacity-50"
        >
          {acao === "recusar" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <X className="h-4 w-4" aria-hidden="true" />
          )}
          Recusar
        </button>
      </div>
    </li>
  );
}
