import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

/** Superfície base — flat, borda fina, cantos arredondados. */
export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface",
        className,
      )}
      {...props}
    />
  );
}
