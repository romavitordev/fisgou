import { Fish } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Marca Fisgou.
 * - withWordmark: renderiza o wordmark oficial (FISGOU com o anzol no G),
 *   via CSS mask sobre `bg-brand` — fica oliva no tema claro e creme no
 *   escuro, sem precisar de dois arquivos.
 * - compacto (withWordmark=false): quadrado brand com o peixe.
 */
const MASK: React.CSSProperties = {
  WebkitMaskImage: "url(/brand/fisgou-wordmark.png)",
  maskImage: "url(/brand/fisgou-wordmark.png)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskPosition: "left center",
  maskPosition: "left center",
};

export function Logo({
  withWordmark = true,
  className,
}: {
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {withWordmark ? (
        // 805×183 → ~4.4:1; h-[22px] ⇒ ~97px de largura.
        <span
          role="img"
          aria-label="Fisgou"
          className="h-[22px] w-[97px] bg-brand"
          style={MASK}
        />
      ) : (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-fg">
          <Fish className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
    </span>
  );
}
