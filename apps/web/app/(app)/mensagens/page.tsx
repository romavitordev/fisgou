import { redirect } from "next/navigation";
import { MensagensView } from "@/components/chat/MensagensView";
import { getViewer } from "@/lib/queries";
import { getConversations } from "@/lib/chat";

export const dynamic = "force-dynamic";

export default async function MensagensPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");

  const conversas = await getConversations(viewer.id);
  return <MensagensView conversasIniciais={conversas} />;
}
