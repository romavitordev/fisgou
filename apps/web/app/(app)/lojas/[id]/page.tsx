import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { LojaDetailView } from "@/components/lojas/LojaDetailView";
import { getLoja, lojasMock } from "@/data/lojas-mock";

export function generateStaticParams() {
  return lojasMock.map((l) => ({ id: l.id }));
}

export default function LojaPage({ params }: { params: { id: string } }) {
  const loja = getLoja(params.id);
  if (!loja) notFound();
  return (
    <PageContainer>
      <LojaDetailView loja={loja} />
    </PageContainer>
  );
}
