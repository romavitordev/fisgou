import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { EditProfileForm } from "@/components/perfil/EditProfileForm";
import { getViewer } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditarPerfilPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");

  return (
    <PageContainer width="full">
      <EditProfileForm user={viewer} />
    </PageContainer>
  );
}
