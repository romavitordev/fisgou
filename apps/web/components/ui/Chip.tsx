import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ChipTone = "neutral" | "brand" | "amber";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: ChipTone;
  active?: boolean;
  children: ReactNode;
  /** Renderiza como <span> quando não é interativo. */
  as?: "button" | "span";
}

/**
 * Chip neutro/brand/âmbar, com estado ativo.
 * Âmbar PREENCHIDO é reservado a status especial (ver regra do âmbar).
 */
const base =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors";

function toneClasses(tone: ChipTone, active: boolean): string {
  if (active) {
    switch (tone) {
      case "amber":
        return "bg-amber text-white";
      case "neutral":
        return "bg-text text-bg";
      case "brand":
      default:
        return "bg-brand text-brand-fg";
    }
  }
  switch (tone) {
    case "brand":
      return "bg-brand-soft text-brand";
    case "amber":
      return "bg-amber-soft text-amber";
    case "neutral":
    default:
      return "border border-border bg-surface text-text-2 hover:bg-surface-2";
  }
}

export function Chip({
  tone = "neutral",
  active = false,
  className,
  children,
  as = "button",
  ...props
}: ChipProps) {
  if (as === "span") {
    return (
      <span className={cn(base, toneClasses(tone, active), className)}>
        {children}
      </span>
    );
  }
  return (
    <button
      type="button"
      className={cn(base, toneClasses(tone, active), className)}
      {...props}
    >
      {children}
    </button>
  );
}
