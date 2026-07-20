import Link from "next/link";
import { Search, Bell, MessageCircle, ShoppingBag, Clapperboard } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Logo } from "@/components/layout/Logo";
import { PageContainer } from "@/components/layout/PageContainer";
import { NotificationsBadge } from "@/components/layout/NotificationsBadge";
import { ChatNavBadge } from "@/components/layout/ChatNavBadge";
import { Composer } from "@/components/feed/Composer";
import { FeedTimeline } from "@/components/feed/FeedTimeline";
import { StoriesBar } from "@/components/feed/StoriesBar";
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
            <IconButton label="Pesquisa" href="/buscar">
              <Search className="h-5 w-5" aria-hidden="true" />
            </IconButton>
            <span className="md:hidden">
              <IconButton label="Shorts" href="/lances">
                <Clapperboard className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </span>
            <span className="md:hidden">
              <IconButton label="Marketplace" href="/lojas">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </span>
            <span className="relative md:hidden">
              <IconButton label="Chat" href="/mensagens">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </IconButton>
              <ChatNavBadge />
            </span>
            <span className="relative md:hidden">
              <IconButton label="Notificação" href="/notificacoes">
                <Bell className="h-5 w-5" aria-hidden="true" />
              </IconButton>
              <NotificationsBadge />
            </span>
          </>
        }
      >
        <Logo className="md:hidden" />
        <h1 className="hidden text-lg font-semibold md:block">Início</h1>
      </TopBar>

      <div className="space-y-3 p-3">
        <StoriesBar />
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
