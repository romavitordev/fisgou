import { ReelsView } from "@/components/reels/ReelsView";
import { reelsMock } from "@/data/reels-mock";

/** Vídeos curtos (E1) — mock visual até existir upload de vídeo real. */
export default function ReelsPage() {
  return <ReelsView reels={reelsMock} />;
}
