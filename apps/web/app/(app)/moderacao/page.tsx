import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CapturasPendentes } from "@/components/moderacao/CapturasPendentes";
import { PostsModeracao } from "@/components/moderacao/PostsModeracao";
import {
  getViewer,
  getCapturasPendentes,
  getPostsParaModeracao,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Painel de moderação — exclusivo da equipe Fisgou (role "moderador"). */
export default async function ModeracaoPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.role !== "moderador") redirect("/feed");

  const [capturas, posts] = await Promise.all([
    getCapturasPendentes(),
    getPostsParaModeracao(),
  ]);

  return (
    <PageContainer width="wide">
      <div className="px-4 py-5">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-brand">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Moderação Fisgou
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Painel de moderação
          </h1>
          <p className="mt-1 text-sm text-text-2">
            Verifique capturas (foto real? espécie correta? existe nessa
            região?) e remova conteúdo mal-intencionado.
          </p>
        </header>

        <div className="space-y-6">
          <CapturasPendentes capturas={capturas} />
          <PostsModeracao posts={posts} />
        </div>
      </div>
    </PageContainer>
  );
}
