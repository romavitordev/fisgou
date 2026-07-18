import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PainelView } from "@/components/painel/PainelView";
import { getViewer, getPainelData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  // Só vendedores têm painel; pescador vai pro feed.
  if (viewer.role !== "vendedor") redirect("/feed");

  const pesqueiros = await getPainelData(viewer.id);

  return (
    <PageContainer width="wide">
      <PainelView pesqueiros={pesqueiros} nomeNegocio={viewer.nomeNegocio} />
    </PageContainer>
  );
}
