import { Fish, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

/** Barra de progresso da coleção Fisgados (X/total + %). */
export function ProgressoColecao({
  capturadas,
  total,
}: {
  capturadas: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((capturadas / total) * 100) : 0;
  const faltam = Math.max(0, total - capturadas);
  return (
    <Card className="mt-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Fish className="h-4 w-4 text-brand" aria-hidden="true" />
          Coleção Fisgados
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
          {capturadas}/{total}
          <ChevronRight className="h-4 w-4 text-text-2" aria-hidden="true" />
        </span>
      </div>
      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso da coleção Fisgados"
      >
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-text-2">
        {pct}% da coleção completa · faltam {faltam} espécies
      </p>
    </Card>
  );
}
