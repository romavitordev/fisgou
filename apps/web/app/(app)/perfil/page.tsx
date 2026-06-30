import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProfileView } from "@/components/perfil/ProfileView";
import { getProfile, getViewer } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");

  const data = await getProfile(viewer.handle, viewer.id);
  if (!data) redirect("/login");

  return (
    <PageContainer width="full">
      <ProfileView
        user={data.user}
        isMe
        isFollowing={false}
        posts={data.posts}
        entries={data.collection.entries}
        locked={data.collection.locked}
        capturadas={data.collection.capturadas}
        total={data.collection.total}
        badges={data.badges}
      />
    </PageContainer>
  );
}
