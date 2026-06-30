import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PageContainer } from "@/components/layout/PageContainer";
import { NotificationsBadge } from "@/components/layout/NotificationsBadge";
import { Composer } from "@/components/feed/Composer";
import { FeedTimeline } from "@/components/feed/FeedTimeline";
import { getFeed, getViewer } from "@/lib/queries";

// Lê do banco/sessão a cada requisição.
export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const viewer = await getViewer();
  const posts = await getFeed(viewer?.id ?? null);

  return (
    <PageContainer>
      <TopBar
        actions={
          <>
            <IconButton label="Buscar" href="/buscar">
              <Search className="h-5 w-5" aria-hidden="true" />
            </IconButton>
            {/* Entrada de notificações no mobile (no desktop fica na Sidebar). */}
            <span className="relative md:hidden">
              <IconButton label="Notificações" href="/notificacoes">
                <Bell className="h-5 w-5" aria-hidden="true" />
              </IconButton>
              <NotificationsBadge />
            </span>
            {/* No desktop o toggle vive na Sidebar; evita duplicar. */}
            <ThemeToggle className="md:hidden" />
          </>
        }
      >
        <Logo className="md:hidden" />
        <h1 className="hidden text-lg font-semibold md:block">Início</h1>
      </TopBar>

      <div className="space-y-3 p-3">
        <Composer user={viewer} />
        <FeedTimeline initialPosts={posts} />
      </div>
    </PageContainer>
  );
}

function IconButton({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
    >
      {children}
    </Link>
  );
}
