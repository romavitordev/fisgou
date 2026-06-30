"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import type { Post } from "@fisgou/shared";
import { PostCard } from "./PostCard";

function countNew(prev: Post[], next: Post[]) {
  const prevIds = new Set(prev.map((p) => p.id));
  let n = 0;
  for (const p of next) if (!prevIds.has(p.id)) n += 1;
  return n;
}

/** Rola o scroller do app (<main>) pro topo. O feed NÃO rola a janela. */
function scrollFeedTop() {
  const main = document.querySelector("main");
  if (main) main.scrollTo({ top: 0, behavior: "smooth" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export function FeedAutoReload({
  initialPosts,
  refreshMs = 10000,
}: {
  initialPosts: Post[];
  refreshMs?: number;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [pendentes, setPendentes] = useState<Post[]>([]);
  const latestRef = useRef<Post[]>(initialPosts);

  useEffect(() => {
    latestRef.current = posts;
  }, [posts]);

  const buscar = useCallback(async (): Promise<Post[] | null> => {
    try {
      const res = await fetch("/api/posts", { cache: "no-store" });
      if (!res.ok) return null;
      const data = (await res.json()) as { posts?: Post[] };
      return data.posts ?? [];
    } catch {
      return null;
    }
  }, []);

  // Polling: detecta publicações novas e guarda como "pendentes".
  useEffect(() => {
    let alive = true;
    async function tick() {
      const next = await buscar();
      if (!alive || !next) return;
      if (countNew(latestRef.current, next) > 0) {
        setPendentes(next);
      } else {
        setPendentes([]);
      }
    }
    const t = window.setInterval(tick, refreshMs);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, [buscar, refreshMs]);

  function mostrarNovos() {
    if (pendentes.length > 0) {
      setPosts(pendentes);
      latestRef.current = pendentes;
      setPendentes([]);
    }
    scrollFeedTop();
  }

  const novos = useMemo(
    () => countNew(posts, pendentes),
    [posts, pendentes],
  );

  return (
    <>
      {/* Pílula "Nova publicação" no topo (aparece quando há novos posts). */}
      {novos > 0 && (
        <div className="pointer-events-none sticky top-2 z-40 flex justify-center">
          <button
            type="button"
            onClick={mostrarNovos}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-fg shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
            {novos === 1 ? "Nova publicação" : `${novos} novas publicações`}
          </button>
        </div>
      )}

      <div className="space-y-3 p-3 pt-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
