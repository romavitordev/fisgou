import { Fish } from "lucide-react";
import { cn } from "@/lib/cn";

/** Marca "Fisgou": peixe em quadrado brand + wordmark. */
export function Logo({
  withWordmark = true,
  className,
}: {
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-fg">
        <Fish className="h-5 w-5" aria-hidden="true" />
      </span>
      {withWordmark && (
        <span className="text-xl font-bold tracking-tight">Fisgou</span>
      )}
    </span>
  );
}
