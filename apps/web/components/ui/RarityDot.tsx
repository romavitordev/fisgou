import { cn } from "@/lib/cn";
import { rarityColor, rarityLabel } from "@/lib/rarity";
import type { Rarity } from "@fisgou/shared";

interface RarityDotProps {
  rarity: Rarity;
  className?: string;
  /** Inclui o rótulo de raridade ao lado do ponto. */
  withLabel?: boolean;
}

/** Ponto colorido que indica a raridade da espécie. */
export function RarityDot({ rarity, className, withLabel }: RarityDotProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: rarityColor[rarity] }}
        aria-hidden="true"
      />
      {withLabel && (
        <span className="text-sm text-text-2">{rarityLabel[rarity]}</span>
      )}
    </span>
  );
}
