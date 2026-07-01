import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopBar } from "@/components/layout/TopBar";
import { PostCard } from "@/components/feed/PostCard";
import { CommentsSection } from "@/components/feed/CommentsSection";
import { getPostDetail, getViewer } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: { id: string } }) {
  const viewer = await getViewer();
  const data = await getPostDetail(params.id, viewer?.id ?? null);
  if (!data) notFound();

  return (
    <PageContainer>
      <TopBar actions={null}>
        <Link
          href="/feed"
          aria-label="Voltar"
          className="-ml-1 inline-flex items-center gap-2 rounded-full px-2 py-1 text-base font-semibold text-text transition-colors hover:bg-surface-2"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Publicação
        </Link>
      </TopBar>

      <div className="p-3">
        <PostCard post={data.post} redirectOnDelete="/feed" />
      </div>

      <CommentsSection
        postId={data.post.id}
        iniciais={data.comentarios}
        viewer={viewer}
      />
    </PageContainer>
  );
}
