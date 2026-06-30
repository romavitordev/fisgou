import { Check, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { statusLabel } from "@/lib/rarity";
import type { CatchStatus } from "@fisgou/shared";

interface VerificationSealProps {
  /** "locked" = espécie ainda não capturada (cadeado). */
  status: CatchStatus | "locked";
  className?: string;
}

/**
 * Selo de status de captura.
 * - verificado: check verde (brand)
 * - em análise: relógio âmbar — exceção permitida da regra do âmbar,
 *   pois é status especial em badge PREENCHIDO (não confunde com nota).
 * - não verificado: não renderiza nada (retorna null).
 * - locked: cadeado neutro.
 */
export function VerificationSeal({ status, className }: VerificationSealProps) {
  if (status === "nao_verificado") return null;

  if (status === "locked") {
    return (
      <span
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-text-2",
          className,
        )}
        title="Espécie ainda não capturada"
      >
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">Bloqueado</span>
      </span>
    );
  }

  if (status === "em_analise") {
    return (
      <span
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber text-white",
          className,
        )}
        title={statusLabel.em_analise}
      >
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">{statusLabel.em_analise}</span>
      </span>
    );
  }

  // verificado
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand text-brand-fg",
        className,
      )}
      title={statusLabel.verificado}
    >
      <Check className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">{statusLabel.verificado}</span>
    </span>
  );
}
