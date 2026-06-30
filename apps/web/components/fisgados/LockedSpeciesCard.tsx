import { Lock } from "lucide-react";

/** Card de espécie ainda não capturada (bloqueada) na grade Fisgados. */
export function LockedSpeciesCard() {
  return (
    <div className="flex flex-col">
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-2/40 text-text-2">
        <Lock className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="px-2 py-2">
        <span className="text-xs font-medium text-text-2">???</span>
      </div>
    </div>
  );
}
