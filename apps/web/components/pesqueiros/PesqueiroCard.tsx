import Link from "next/link";
import { Star, MapPin, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { pesqueiroTipoLabel } from "@/lib/rarity";
import { formatNota } from "@/lib/format";
import type { Pesqueiro } from "@fisgou/shared";

export function PesqueiroCard({ pesqueiro }: { pesqueiro: Pesqueiro }) {
  return (
    <Link href={`/pesqueiros/${pesqueiro.id}`} className="block">
      <Card className="flex items-center gap-3 p-3 transition-colors hover:bg-surface-2">
        {/* Thumb placeholder */}
        <div
          className="h-16 w-16 shrink-0 rounded-xl"
          style={{ backgroundColor: pesqueiro.cor }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">
            {pesqueiro.nome}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-sm">
            {/* Estrela DOURADA = nota do Google. */}
            <Star
              className="h-3.5 w-3.5 fill-[#F5B301] text-[#F5B301]"
              aria-hidden="true"
            />
            <span className="font-medium">{formatNota(pesqueiro.nota)}</span>
            <span className="text-text-2">({pesqueiro.avaliacoes})</span>
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <Chip as="span" tone="brand" className="px-2 py-0.5 text-xs">
              {pesqueiroTipoLabel[pesqueiro.tipo]}
            </Chip>
            <span className="inline-flex items-center gap-0.5 text-xs text-text-2">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {pesqueiro.distanciaKm} km
            </span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-text-2" aria-hidden="true" />
      </Card>
    </Link>
  );
}
