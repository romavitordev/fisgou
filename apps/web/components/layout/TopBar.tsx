import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TopBarProps {
  /** Conteúdo principal à esquerda (logo, título ou título+subtítulo). */
  children: ReactNode;
  /** Ações à direita (busca, mensagens, toggle…). */
  actions?: ReactNode;
  className?: string;
}

/** Cabeçalho fixo da coluna do app (sticky dentro do AppShell). */
export function TopBar({ children, actions, className }: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-bg/85 px-4 py-3 backdrop-blur",
        className,
      )}
    >
      <div className="min-w-0">{children}</div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </header>
  );
}

/** Título + subtítulo padrão de topbar (ex.: "Fisgados / sua coleção"). */
export function TopBarTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="min-w-0">
      <h1 className="truncate text-lg font-semibold leading-tight">{title}</h1>
      {subtitle && (
        <p className="truncate text-sm text-text-2">{subtitle}</p>
      )}
    </div>
  );
}
