import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopBar, TopBarTitle } from "@/components/layout/TopBar";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

const STORIES = [
  { id: "s1", nome: "Rafael", iniciais: "RF", cor: "#9DBFAE" },
  { id: "s2", nome: "Bia", iniciais: "B", cor: "#BBC79A" },
  { id: "s3", nome: "Caio", iniciais: "C", cor: "#A9BBD0" },
  { id: "s4", nome: "Zé", iniciais: "Z", cor: "#AFC4D2" },
];

export function StoriesMockPage() {
  return (
    <PageContainer className="pb-10">
      <TopBar>
        <TopBarTitle title="Stories" subtitle="Mockup de barra e visualização full-screen." />
      </TopBar>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-sm text-text-2">
            Este mock demonstra o fluxo visual de Stories no app, com avatar, barra de progresso, abertura em overlay e controles de navegação.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STORIES.map((story) => (
              <div key={story.id} className="space-y-2 rounded-3xl border border-border bg-bg p-4 text-center">
                <Avatar
                  src={undefined}
                  alt={story.nome}
                  iniciais={story.iniciais}
                  cor={story.cor}
                  size="lg"
                />
                <p className="text-sm font-semibold text-text">{story.nome}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-bg p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text">Story em destaque</p>
                <p className="mt-1 text-sm text-text-2">
                  Ao tocar, o story abre em um overlay com progressão automática e controles de navegação.
                </p>
              </div>
              <Button variant="secondary">Visualizar</Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand to-emerald-400 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/80">Story</p>
                  <p className="text-lg font-semibold">Rafael — Pesca no lago</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  12s
                </span>
              </div>

              <div className="mt-4 rounded-3xl bg-white/20 p-4">
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/30">
                  <div className="h-full w-3/4 rounded-full bg-white transition-all" />
                </div>
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span>Rafael</span>
                  <span>3 / 4</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button variant="secondary">Anterior</Button>
                <Button>Próximo</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
