import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { getViewer } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPerfilPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");

  return (
    <PageContainer width="full">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-2">
                Configurações
              </p>
              <h1 className="mt-2 text-3xl font-bold text-text">Sua conta e preferências</h1>
              <p className="mt-2 max-w-2xl text-sm text-text-2">
                Ajuste visibilidade, notificações e detalhes do perfil para manter seu
                Fisgou do jeito certo.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-text">Conta</h2>
            <p className="mt-2 text-sm text-text-2">
              Gerencie seu nome, handle, cidade e informações públicas.
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-border bg-bg p-4">
                <p className="text-sm font-semibold text-text">Nome</p>
                <p className="mt-1 text-sm text-text-2">{viewer.nome}</p>
              </div>
              <div className="rounded-2xl border border-border bg-bg p-4">
                <p className="text-sm font-semibold text-text">Handle</p>
                <p className="mt-1 text-sm text-text-2">@{viewer.handle}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-text">Notificações</h2>
            <p className="mt-2 text-sm text-text-2">
              Ajuste preferências para mensagens, menções e novidades das comunidades que você segue.
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-border bg-bg p-4">
                <p className="text-sm font-semibold text-text">Mensagens</p>
                <p className="mt-1 text-sm text-text-2">Ativas</p>
              </div>
              <div className="rounded-2xl border border-border bg-bg p-4">
                <p className="text-sm font-semibold text-text">Notificações de feed</p>
                <p className="mt-1 text-sm text-text-2">Ativas</p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text">Privacidade</h2>
              <p className="mt-2 text-sm text-text-2">
                Controle quem vê suas publicações, sua coleção e seu perfil.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-border bg-bg p-4">
              <p className="text-sm font-semibold text-text">Perfil público</p>
              <p className="mt-1 text-sm text-text-2">Seu perfil pode ser encontrado por outros pescadores.</p>
            </div>
            <div className="rounded-2xl border border-border bg-bg p-4">
              <p className="text-sm font-semibold text-text">Coleção</p>
              <p className="mt-1 text-sm text-text-2">A coleção Fisgados fica visível a todos.</p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
