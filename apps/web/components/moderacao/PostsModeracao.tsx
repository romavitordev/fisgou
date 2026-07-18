"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldAlert, Trash2, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { tempoRelativo } from "@/lib/format";
import type { Post } from "@fisgou/shared";

/**
 * Triagem de conteúdo: publicações recentes com ação de remoção
 * (posts mal-intencionados). Remover pede confirmação em 2 passos.
 */
export function PostsModeracao({ posts }: { posts: Post[] }) {
  const [itens, setItens] = useState(posts);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <header className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold leading-tight">
            Publicações recentes
          </h2>
          <p className="text-xs text-text-2">
            Remova conteúdo impróprio ou mal-intencionado.
          </p>
        </div>
      </header>

      {itens.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-2">
          Nenhuma publicação para revisar.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {itens.map((p) => (
            <PostRow
              key={p.id}
              post={p}
              onRemoved={() =>
                setItens((prev) => prev.filter((x) => x.id !== p.id))
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function PostRow({ post, onRemoved }: { post: Post; onRemoved: () => void }) {
  const [confirmando, setConfirmando] = useState(false);
  const [removendo, setRemovendo] = useState(false);

  async function remover() {
    if (removendo) return;
    if (!confirmando) {
      setConfirmando(true);
      // Volta ao normal se o moderador não confirmar em 4s.
      window.setTimeout(() => setConfirmando(false), 4000);
      return;
    }
    setRemovendo(true);
    try {
      const r = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (r.ok) onRemoved();
      else setRemovendo(false);
    } catch {
      setRemovendo(false);
    }
  }

  return (
    <li className="flex items-center gap-3 py-3">
      <span
        className="h-12 w-12 shrink-0 overflow-hidden rounded-lg"
        style={{ backgroundColor: post.imagemCor }}
      >
        {post.imagemUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.imagemUrl} alt="" className="h-full w-full object-cover" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm">
          <Avatar
            iniciais={post.autor.iniciais}
            cor={post.autor.cor}
            src={post.autor.imagemUrl}
            size="sm"
            className="h-5 w-5 text-[9px]"
          />
          <Link
            href={`/u/${post.autor.handle}`}
            className="shrink-0 font-medium hover:underline"
          >
            {post.autor.nome}
          </Link>
          <span className="shrink-0 text-xs text-text-2">
            · {tempoRelativo(post.criadoEm)}
          </span>
        </p>
        <Link
          href={`/post/${post.id}`}
          className="mt-0.5 block truncate text-xs text-text-2 hover:underline"
        >
          {post.legenda}
        </Link>
      </div>

      <button
        type="button"
        onClick={remover}
        disabled={removendo}
        className={
          confirmando
            ? "inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            : "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-text-2 transition-colors hover:bg-surface-2 hover:text-red-600 disabled:opacity-60"
        }
      >
        {removendo ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        )}
        {confirmando ? "Confirmar remoção" : "Remover"}
      </button>
    </li>
  );
}
