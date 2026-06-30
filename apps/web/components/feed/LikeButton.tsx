"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";

/** Botão de curtir com "pop" + persistência (POST /api/posts/[id]/like). */
export function LikeButton({
  postId,
  curtidas,
  liked: likedInicial = false,
}: {
  postId: string;
  curtidas: number;
  liked?: boolean;
}) {
  const [liked, setLiked] = useState(likedInicial);
  const [total, setTotal] = useState(curtidas);
  const [animar, setAnimar] = useState(false);

  async function toggle() {
    // Otimista.
    const novo = !liked;
    setLiked(novo);
    setTotal((t) => t + (novo ? 1 : -1));
    setAnimar(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setTotal(data.curtidas);
      } else {
        // reverte
        setLiked(!novo);
        setTotal((t) => t + (novo ? -1 : 1));
      }
    } catch {
      setLiked(!novo);
      setTotal((t) => t + (novo ? -1 : 1));
    }
  }

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label="Curtir"
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm transition-colors",
        liked ? "text-red-500" : "hover:text-text",
      )}
    >
      <Heart
        className={cn("h-5 w-5", liked && "fill-current", animar && "animate-pop")}
        aria-hidden="true"
        onAnimationEnd={() => setAnimar(false)}
      />
      <span>{total}</span>
    </button>
  );
}
