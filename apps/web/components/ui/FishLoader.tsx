import { Fish } from "lucide-react";
import { cn } from "@/lib/cn";

/** Tela de carregamento com um peixe "nadando" + bolhas. */
export function FishLoader({
  label = "Carregando…",
  fullscreen = true,
  className,
}: {
  label?: string;
  fullscreen?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 bg-bg",
        fullscreen && "h-[100dvh]",
        className,
      )}
      role="status"
      aria-label={label}
    >
      <div className="relative">
        <Fish className="h-12 w-12 text-brand animate-swim" aria-hidden="true" />
        {/* bolhas saindo da boca do peixe */}
        <span className="absolute -right-1 top-1 h-2 w-2 rounded-full bg-brand/40 animate-bubble" />
        <span className="absolute -right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand/30 animate-bubble [animation-delay:0.7s]" />
        <span className="absolute right-0 top-3 h-1 w-1 rounded-full bg-brand/30 animate-bubble [animation-delay:1.3s]" />
      </div>
      <span className="text-sm text-text-2">{label}</span>
    </div>
  );
}
