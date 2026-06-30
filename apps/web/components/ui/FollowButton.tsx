"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Botão Seguir/Seguindo (otimista) — POST /api/users/[handle]/follow. */
export function FollowButton({
  handle,
  initialFollowing,
  className,
}: {
  handle: string;
  initialFollowing: boolean;
  className?: string;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pend, setPend] = useState(false);

  async function toggle() {
    if (pend) return;
    setPend(true);
    setFollowing((v) => !v);
    try {
      const r = await fetch(`/api/users/${handle}/follow`, { method: "POST" });
      if (!r.ok) throw new Error();
    } catch {
      setFollowing((v) => !v); // reverte
    } finally {
      setPend(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pend}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold transition-colors active:scale-95 disabled:opacity-60",
        following
          ? "border border-border text-text-2 hover:bg-surface-2"
          : "bg-brand text-brand-fg hover:opacity-90",
        className,
      )}
    >
      {following ? "Seguindo" : "Seguir"}
    </button>
  );
}
