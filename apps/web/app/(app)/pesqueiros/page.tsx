import { PesqueirosView } from "@/components/pesqueiros/PesqueirosView";
import { getPesqueiros } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PesqueirosPage() {
  const pesqueiros = await getPesqueiros();
  return <PesqueirosView pesqueiros={pesqueiros} />;
}
