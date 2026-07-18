"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Fish, User, Plus, Store } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";

const inicio = { href: "/feed", label: "Início", icon: Home } as const;
const pesqueiros = { href: "/pesqueiros", label: "Pesqueiros", icon: MapPin } as const;
const fisgados = { href: "/fisgados", label: "FISGADOS", icon: Fish } as const;
const painel = { href: "/painel", label: "Painel", icon: Store } as const;
const perfil = { href: "/perfil", label: "Perfil", icon: User } as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Navegação inferior fixa dentro da coluna do app, com o botão "+"
 * central elevado (atalho para /criar).
 */
export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // 2 itens + [+] central + 2 itens. Vendedor troca "Fisgados" por "Painel".
  const left = [inicio, pesqueiros];
  const right = user?.role === "vendedor" ? [painel, perfil] : [fisgados, perfil];

  return (
    <nav
      aria-label="Navegação principal"
      className="relative z-30 grid grid-cols-5 items-center border-t border-border bg-surface px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
    >
      {left.map((item) => (
        <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />
      ))}

      {/* Botão "+" central elevado */}
      <div className="flex justify-center">
        <Link
          href="/criar"
          aria-label="Nova publicação"
          className="-mt-7 inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-surface bg-brand text-brand-fg shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-6 w-6" aria-hidden="true" />
        </Link>
      </div>

      {right.map((item) => (
        <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />
      ))}
    </nav>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg py-1 text-[11px] font-medium transition-colors",
        active ? "text-brand" : "text-text-2 hover:text-text",
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={active ? 2.4 : 2} />
      <span>{label}</span>
    </Link>
  );
}
