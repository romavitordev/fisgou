import { Card } from "@/components/ui/Card";
import { RarityDot } from "@/components/ui/RarityDot";
import { VerificationSeal } from "@/components/ui/VerificationSeal";
import type { CollectionEntry } from "@fisgou/shared";

/** Card de espécie desbloqueada na grade Fisgados. */
export function SpeciesCard({ entry }: { entry: CollectionEntry }) {
  const { species, status } = entry;

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div
          className="aspect-square w-full"
          style={{ backgroundColor: species.cor }}
          role="img"
          aria-label={species.nome}
        />
        {/* Selo de status no canto (verde / âmbar relógio / nada). */}
        {status !== "nao_verificado" && (
          <VerificationSeal
            status={status}
            className="absolute right-1.5 top-1.5"
          />
        )}
      </div>
      <div className="flex items-center gap-1.5 px-2 py-2">
        <RarityDot rarity={species.raridade} />
        <span className="truncate text-xs font-medium">{species.nome}</span>
      </div>
    </Card>
  );
}
