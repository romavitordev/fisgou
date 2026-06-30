"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Fade sutil a cada troca de rota (key = pathname remonta o conteúdo).
 * Só opacidade — não interfere em elementos sticky.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-fade">
      {children}
    </div>
  );
}
