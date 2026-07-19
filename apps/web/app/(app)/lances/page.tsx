import { LancesView } from "@/components/lances/LancesView";
import { lancesMock } from "@/data/lances-mock";

/** Lances — vídeos curtos (E1), mock visual até existir upload real. */
export default function LancesPage() {
  return <LancesView lances={lancesMock} />;
}
