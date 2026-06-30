import { redirect } from "next/navigation";
import { FisgadosView } from "@/components/fisgados/FisgadosView";
import { getCollectionData, getViewer } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function FisgadosPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");

  const { entries, locked, capturadas, total } = await getCollectionData(
    viewer.id,
  );

  return (
    <FisgadosView
      entries={entries}
      locked={locked}
      capturadas={capturadas}
      total={total}
    />
  );
}
