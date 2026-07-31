"use client";

import { useRouter } from "next/navigation";
import {
  X,
  SlidersHorizontal,
  Bookmark,
  Heart,
  Archive,
  Bell,
  UserCog,
  Users,
  Ban,
  EyeOff,
  MessageSquare,
  Tag,
  HelpCircle,
  ShieldCheck,
  Info,
  Trash2,
  UserX,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Menu "3 barras" do perfil (item 9) — drawer lateral estilo Instagram.
 * Mockup de navegação: os itens sem página ainda mostram "Em breve".
 * Substitui o antigo card "Acessos rápidos" que poluía o corpo do perfil.
 */

type Item = {
  label: string;
  icon: typeof Bookmark;
  href?: string;
  hint?: string;
  danger?: boolean;
};

const GRUPOS: { titulo: string; itens: Item[] }[] = [
  {
    titulo: "Preferências do aplicativo",
    itens: [
      {
        label: "Preferências",
        icon: SlidersHorizontal,
        href: "/perfil/preferences",
        hint: "Tema, acessibilidade e mais",
      },
    ],
  },
  {
    titulo: "Sua atividade",
    itens: [
      { label: "Salvos", icon: Bookmark, href: "/salvos" },
      { label: "Curtidos", icon: Heart, href: "/curtidas" },
      { label: "Arquivados", icon: Archive, href: "/arquivados" },
      { label: "Notificações", icon: Bell, href: "/notificacoes" },
    ],
  },
  {
    titulo: "Conta",
    itens: [
      {
        label: "Configuração da conta",
        icon: UserCog,
        href: "/perfil/configuracoes",
        hint: "Privado · Público · Vendedor · Influencer",
      },
      { label: "Parceiros (Close friends)", icon: Users },
      { label: "Bloqueados", icon: Ban },
      { label: "Ocultados", icon: EyeOff, hint: "Ocultar stories e/ou posts" },
      {
        label: "Comentários",
        icon: MessageSquare,
        hint: "Quem pode responder e comentar",
      },
      { label: "Marcações", icon: Tag, hint: "Quem pode te marcar" },
    ],
  },
  {
    titulo: "Ajuda e informações",
    itens: [
      { label: "Ajuda", icon: HelpCircle },
      { label: "Central de privacidade", icon: ShieldCheck },
      { label: "Sobre", icon: Info, hint: "Direitos e documentos" },
    ],
  },
  {
    titulo: "Conta e sessão",
    itens: [
      { label: "Lixeira", icon: Trash2 },
      { label: "Desativar conta", icon: UserX, danger: true },
    ],
  },
];

export function ProfileMenu({
  open,
  onClose,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const router = useRouter();
  if (!open) return null;

  function abrir(href?: string) {
    if (!href) return;
    onClose();
    router.push(href);
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/40"
      />
      <aside className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm animate-[slidein_0.2s_ease] flex-col bg-bg shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold">Menu</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          {GRUPOS.map((grupo) => (
            <div key={grupo.titulo} className="mb-4">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-text-2">
                {grupo.titulo}
              </p>
              <ul>
                {grupo.itens.map((item) => {
                  const Icon = item.icon;
                  const clicavel = !!item.href;
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => abrir(item.href)}
                        disabled={!clicavel}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                          clicavel
                            ? "hover:bg-surface-2"
                            : "cursor-default opacity-70",
                          item.danger ? "text-red-600 dark:text-red-400" : "text-text",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            item.danger ? "" : "text-text-2",
                          )}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">
                            {item.label}
                          </span>
                          {item.hint && (
                            <span className="block truncate text-xs text-text-2">
                              {item.hint}
                            </span>
                          )}
                        </span>
                        {clicavel ? (
                          <ChevronRight
                            className="h-4 w-4 shrink-0 text-text-2"
                            aria-hidden="true"
                          />
                        ) : (
                          <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-text-2">
                            Em breve
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Sair */}
          <div className="border-t border-border pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text transition-colors hover:bg-surface-2"
            >
              <LogOut className="h-5 w-5 shrink-0 text-text-2" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
