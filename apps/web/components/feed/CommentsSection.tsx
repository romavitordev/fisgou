"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Heart, Send, Trash2, CornerDownRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { tempoRelativo } from "@/lib/format";
import type { Comment, User } from "@fisgou/shared";

/**
 * Lista + composição de comentários (estilo Twitter/Reddit), com
 * respostas em thread de 1 nível (como Instagram: responder a uma
 * resposta ainda pendura no comentário raiz).
 * Persiste via POST /api/posts/[id]/comments. Curtir e apagar são
 * funcionais (POST /api/comments/[id]/like, DELETE .../comments/[id]).
 */
export function CommentsSection({
  postId,
  iniciais,
  viewer,
}: {
  postId: string;
  iniciais: Comment[];
  viewer: User | null;
}) {
  const [comentarios, setComentarios] = useState(iniciais);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [apagando, setApagando] = useState<string | null>(null);
  const [respondendo, setRespondendo] = useState<{ rootId: string; handle: string } | null>(
    null,
  );
  const [textoResposta, setTextoResposta] = useState("");
  const [enviandoResposta, setEnviandoResposta] = useState(false);

  const arvore = useMemo(() => {
    const raizes = comentarios.filter((c) => !c.parentId);
    return raizes.map((raiz) => ({
      raiz,
      respostas: comentarios.filter((c) => c.parentId === raiz.id),
    }));
  }, [comentarios]);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const t = texto.trim();
    if (!t || enviando) return;
    setEnviando(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: t }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setComentarios((cs) => [...cs, data.comment]);
        setTexto("");
      }
    } finally {
      setEnviando(false);
    }
  }

  async function enviarResposta(e: FormEvent) {
    e.preventDefault();
    const t = textoResposta.trim();
    if (!t || !respondendo || enviandoResposta) return;
    setEnviandoResposta(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: t, parentId: respondendo.rootId }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setComentarios((cs) => [...cs, data.comment]);
        setTextoResposta("");
        setRespondendo(null);
      }
    } finally {
      setEnviandoResposta(false);
    }
  }

  async function curtir(c: Comment) {
    const alvo = c.id;
    setComentarios((cs) =>
      cs.map((x) =>
        x.id === alvo
          ? { ...x, liked: !x.liked, curtidas: x.curtidas + (x.liked ? -1 : 1) }
          : x,
      ),
    );
    try {
      const res = await fetch(`/api/comments/${alvo}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setComentarios((cs) =>
          cs.map((x) =>
            x.id === alvo ? { ...x, liked: data.liked, curtidas: data.curtidas } : x,
          ),
        );
      }
    } catch {
      setComentarios((cs) =>
        cs.map((x) =>
          x.id === alvo
            ? { ...x, liked: !x.liked, curtidas: x.curtidas + (x.liked ? -1 : 1) }
            : x,
        ),
      );
    }
  }

  async function apagar(commentId: string) {
    if (apagando) return;
    setApagando(commentId);
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComentarios((cs) => cs.filter((x) => x.id !== commentId && x.parentId !== commentId));
      }
    } finally {
      setApagando(null);
    }
  }

  function abrirResposta(c: Comment) {
    const rootId = c.parentId ?? c.id;
    if (respondendo?.rootId === rootId) {
      setRespondendo(null);
      return;
    }
    setRespondendo({ rootId, handle: c.autor.handle });
    setTextoResposta("");
  }

  function ComentarioItem({ c, resposta = false }: { c: Comment; resposta?: boolean }) {
    const dono = viewer?.id === c.autor.id;
    return (
      <li className={cn("flex gap-3", resposta && "ml-9 mt-3")}>
        <Avatar
          iniciais={c.autor.iniciais}
          cor={c.autor.cor}
          size={resposta ? "sm" : "sm"}
          src={c.autor.imagemUrl}
        />
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-surface-2 px-3 py-2">
            <p className="text-sm">
              <span className="font-semibold">{c.autor.nome}</span>{" "}
              <span className="text-text-2">@{c.autor.handle}</span>
            </p>
            <p className="mt-0.5 text-sm leading-relaxed">{c.texto}</p>
          </div>
          <div className="mt-1 flex items-center gap-3 px-1 text-xs text-text-2">
            <span>{tempoRelativo(c.criadoEm)}</span>
            <button
              type="button"
              onClick={() => curtir(c)}
              aria-pressed={!!c.liked}
              aria-label="Curtir comentário"
              className={cn(
                "inline-flex items-center gap-1 transition-colors hover:text-text",
                c.liked && "text-red-500",
              )}
            >
              <Heart
                className={cn("h-3.5 w-3.5", c.liked && "fill-current")}
                aria-hidden="true"
              />
              {c.curtidas > 0 && c.curtidas}
            </button>
            {viewer && (
              <button
                type="button"
                onClick={() => abrirResposta(c)}
                className="hover:text-text"
              >
                Responder
              </button>
            )}
            {dono && (
              <button
                type="button"
                onClick={() => apagar(c.id)}
                disabled={apagando === c.id}
                aria-label="Apagar comentário"
                className="inline-flex items-center gap-1 transition-colors hover:text-red-500 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                {apagando === c.id ? "Apagando…" : "Apagar"}
              </button>
            )}
          </div>
        </div>
      </li>
    );
  }

  return (
    <section className="px-3 pb-6">
      <h2 className="px-1 py-3 text-sm font-semibold text-text-2">
        {comentarios.length} comentários
      </h2>

      {viewer && (
        <form onSubmit={enviar} className="flex items-center gap-2 pb-4">
          <Avatar iniciais={viewer.iniciais} cor={viewer.cor} size="sm" src={viewer.imagemUrl} />
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva um comentário…"
            aria-label="Escreva um comentário"
            className="flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm placeholder:text-text-2 focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Enviar comentário"
            disabled={!texto.trim() || enviando}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-brand-fg transition active:scale-95 disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      )}

      <ul className="space-y-4">
        {arvore.map(({ raiz, respostas }) => (
          <li key={raiz.id}>
            <ul>
              <ComentarioItem c={raiz} />
              {respostas.map((r) => (
                <ComentarioItem key={r.id} c={r} resposta />
              ))}
            </ul>

            {respondendo?.rootId === raiz.id && (
              <form
                onSubmit={enviarResposta}
                className="ml-9 mt-3 flex items-center gap-2"
              >
                <CornerDownRight
                  className="h-4 w-4 shrink-0 text-text-2"
                  aria-hidden="true"
                />
                <input
                  autoFocus
                  value={textoResposta}
                  onChange={(e) => setTextoResposta(e.target.value)}
                  placeholder={`Responder a @${respondendo.handle}…`}
                  aria-label="Escreva uma resposta"
                  className="flex-1 rounded-full border border-border bg-surface px-4 py-1.5 text-sm placeholder:text-text-2 focus:border-brand focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Enviar resposta"
                  disabled={!textoResposta.trim() || enviandoResposta}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg transition active:scale-95 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
