import { PageContainer } from "@/components/layout/PageContainer";
import { LojasView } from "@/components/lojas/LojasView";

/** Marketplace de lojas parceiras (E2) — mock por enquanto. */
export default function LojasPage() {
  return (
    <PageContainer width="wide">
      <LojasView />
    </PageContainer>
  );
}
