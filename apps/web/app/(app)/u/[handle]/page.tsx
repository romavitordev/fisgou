import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProfileView } from "@/components/perfil/ProfileView";
import { TopBar } from "@/components/layout/TopBar";
import { getProfile, getViewer } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PerfilPublicoPage({
  params,
}: {
  params: { handle: string };
}) {
  const viewer = await getViewer();
  const data = await getProfile(params.handle, viewer?.id ?? null);
  if (!data) notFound();

  return (
    <PageContainer width="full">
      <TopBar className="border-b-0 bg-transparent backdrop-blur-none" actions={null}>
        <Link
          href="/feed"
          aria-label="Voltar"
          className="-ml-1 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-text transition-colors hover:bg-surface-2"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          <span className="truncate">{data.user.nome}</span>
        </Link>
      </TopBar>

      <ProfileView
        user={data.user}
        isMe={data.isMe}
        isFollowing={data.isFollowing}
        posts={data.posts}
        entries={data.collection.entries}
        locked={data.collection.locked}
        capturadas={data.collection.capturadas}
        total={data.collection.total}
        badges={data.badges}
      />
    </PageContainer>
  );
}
