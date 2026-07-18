import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PainelView } from "@/components/painel/PainelView";
import { getViewer, getPainelData, getCapturasPendentes } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  // Só vendedores têm painel; pescador vai pro feed.
  if (viewer.role !== "vendedor") redirect("/feed");

  const [pesqueiros, capturas] = await Promise.all([
    getPainelData(viewer.id),
    getCapturasPendentes(viewer.id),
  ]);

  return (
    <PageContainer width="wide">
      <PainelView
        pesqueiros={pesqueiros}
        capturasPendentes={capturas}
        nomeNegocio={viewer.nomeNegocio}
      />
    </PageContainer>
  );
}
