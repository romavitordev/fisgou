import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopBar, TopBarTitle } from "@/components/layout/TopBar";

const mockItems = [
  { id: "1", title: "Post guardado sobre pesca no rio", author: "Rafael" },
  { id: "2", title: "Dica de isca para bagre", author: "Bia" },
  { id: "3", title: "Manual do conjunto ideal", author: "Caio" },
];

export default function SavedPage() {
  return (
    <PageContainer className="pb-10">
      <TopBar>
        <TopBarTitle title="Salvos" subtitle="Conteúdos que você salvou para ver depois." />
      </TopBar>

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
        <p className="rounded-3xl border border-border bg-surface p-4 text-sm text-text-2">
          Página mock de conteúdo salvo — exibe publicações e dicas que o usuário pode resgatar mais tarde.
        </p>

        <div className="space-y-3">
          {mockItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar iniciais={item.author.slice(0, 2)} cor="#9DBFAE" size="md" />
                <div className="min-w-0">
                  <p className="font-semibold text-text">{item.title}</p>
                  <p className="mt-1 text-sm text-text-2">{item.author}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
