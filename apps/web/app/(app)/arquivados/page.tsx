import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopBar, TopBarTitle } from "@/components/layout/TopBar";

const archivedItems = [
  { id: "1", title: "Histórico de conjuntos antigos", author: "Caio" },
  { id: "2", title: "Guia de molinetes", author: "Rafael" },
  { id: "3", title: "Review de iscas", author: "Bia" },
];

export default function ArchivedPage() {
  return (
    <PageContainer className="pb-10">
      <TopBar>
        <TopBarTitle title="Arquivados" subtitle="Itens guardados como históricos ou não ativos." />
      </TopBar>

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
        <p className="rounded-3xl border border-border bg-surface p-4 text-sm text-text-2">
          Página mock de conteúdo arquivado, que inclui posts, guias ou conjuntos organizados como histórico.
        </p>

        <div className="space-y-3">
          {archivedItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar iniciais={item.author.slice(0, 2)} cor="#AFC4D2" size="md" />
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
