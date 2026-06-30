"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Search,
  Bell,
  MapPin,
  Fish,
  User,
  Plus,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth";
import { NotificationsBadge } from "./NotificationsBadge";

const items = [
  { href: "/feed", label: "Início", icon: Home },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/notificacoes", label: "Notificações", icon: Bell },
  { href: "/pesqueiros", label: "Pesqueiros", icon: MapPin },
  { href: "/fisgados", label: "Fisgados", icon: Fish },
  { href: "/perfil", label: "Perfil", icon: User },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Navegação lateral — só no desktop (md+). No mobile a navegação fica
 * na BottomNav. Largura compacta (ícones) no md e completa (com rótulos)
 * a partir do xl, como apps sociais no desktop.
 */
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function sair() {
    await logout();
    router.replace("/");
  }

  return (
    <aside className="hidden shrink-0 flex-col border-r border-border bg-surface px-3 py-4 md:flex md:w-[76px] xl:w-64">
      {/* Marca */}
      <div className="mb-6 px-1 xl:px-2">
        <Link href="/feed" aria-label="Fisgou — início">
          <Logo withWordmark={false} className="xl:hidden" />
          <Logo className="hidden xl:inline-flex" />
        </Link>
      </div>

      {/* Navegação */}
      <nav aria-label="Navegação principal" className="flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              title={label}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                "justify-center xl:justify-start",
                active
                  ? "bg-brand-soft text-brand"
                  : "text-text-2 hover:bg-surface-2 hover:text-text",
              )}
            >
              <Icon
                className="h-6 w-6 shrink-0"
                aria-hidden="true"
                strokeWidth={active ? 2.4 : 2}
              />
              <span className="hidden xl:inline">{label}</span>

              {href === "/notificacoes" && (
                <NotificationsBadge />
              )}
            </Link>
          );
        })}

        {/* Criar */}
        <Link
          href="/criar"
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-brand-fg transition-opacity hover:opacity-90 xl:justify-start"
          title="Nova publicação"
        >
          <Plus className="h-6 w-6 shrink-0" aria-hidden="true" />
          <span className="hidden xl:inline">Nova publicação</span>
        </Link>
      </nav>

      {/* Rodapé: tema + usuário + logout */}
      <div className="mt-auto flex flex-col gap-1 pt-4">
        <div className="flex justify-center xl:justify-start">
          <ThemeToggle />
        </div>
        <Link
          href="/perfil"
          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-2 max-xl:justify-center"
          title={user?.nome ?? "Perfil"}
        >
          <Avatar
            iniciais={user?.iniciais ?? "?"}
            cor={user?.cor ?? "#14916B"}
            size="sm"
            src={user?.imagemUrl}
          />
          <span className="hidden min-w-0 xl:block">
            <span className="block truncate text-sm font-semibold leading-tight">
              {user?.nome ?? "Você"}
            </span>
            <span className="block truncate text-xs text-text-2">
              @{user?.handle ?? "..."}
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={sair}
          title="Sair"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-2 transition-colors hover:bg-surface-2 hover:text-text max-xl:justify-center xl:justify-start"
        >
          <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
          <span className="hidden xl:inline">Sair</span>
        </button>
      </div>
    </aside>
  );
}
