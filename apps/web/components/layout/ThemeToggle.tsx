"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, type MouseEvent } from "react";
import { cn } from "@/lib/cn";

/**
 * Botão de troca de tema (claro/escuro).
 * Usa a View Transitions API para um reveal circular saindo do botão
 * (~0.5s). Onde não houver suporte, cai no crossfade de cor do globals.css.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita mismatch de hidratação: só renderiza o ícone após montar.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  // Antes de montar não sabemos o tema → label neutro p/ evitar mismatch
  // de hidratação (server não conhece o tema resolvido).
  const label = !mounted
    ? "Alternar tema"
    : isDark
      ? "Mudar para tema claro"
      : "Mudar para tema escuro";

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    const next = isDark ? "light" : "dark";

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!doc.startViewTransition || prefersReduced) {
      setTheme(next);
      return;
    }

    // Origem do reveal = centro do botão clicado.
    const r = e.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--tt-x", `${r.left + r.width / 2}px`);
    root.style.setProperty("--tt-y", `${r.top + r.height / 2}px`);

    doc.startViewTransition(() => setTheme(next));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text",
        className,
      )}
    >
      {mounted && isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
