import { redirect } from "next/navigation";
import { getViewer } from "@/lib/queries";
import { PreferencesPanel } from "@/components/perfil/PreferencesPanel";

export const dynamic = "force-dynamic";

export default async function PreferenciasPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");

  return <PreferencesPanel user={viewer} />;
}
