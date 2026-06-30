import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Width = "default" | "wide" | "full";

const widths: Record<Width, string> = {
  // Coluna única estilo Twitter/Threads.
  default: "max-w-2xl",
  // Listas/grades que aproveitam o desktop (Fisgados, Pesqueiros).
  wide: "max-w-4xl",
  // Largura cheia da área de conteúdo (Perfil: banner full-bleed).
  full: "max-w-none",
};

/**
 * Centraliza o conteúdo de uma página (topbar + corpo) numa coluna de
 * largura adequada. Envolve a página INTEIRA para que a TopBar sticky e
 * eventuais barras sticky fiquem alinhadas à coluna.
 */
export function PageContainer({
  children,
  width = "default",
  className,
}: {
  children: ReactNode;
  width?: Width;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full", widths[width], className)}>
      {children}
    </div>
  );
}
