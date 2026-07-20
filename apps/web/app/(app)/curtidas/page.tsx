import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/layout/PageContainer";
import { TopBar, TopBarTitle } from "@/components/layout/TopBar";

const likedItems = [
  { id: "1", title: "Melhor pesqueiro da serra", author: "Zé" },
  { id: "2", title: "Captura lendária de tilápia", author: "Bia" },
  { id: "3", title: "Checklist de equipamentos", author: "Rafael" },
];

export default function LikedPage() {
  return (
    <PageContainer className="pb-10">
      <TopBar>
        <TopBarTitle title="Curtidas" subtitle="Publicações que você marcou com coração." />
      </TopBar>

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
        <p className="rounded-3xl border border-border bg-surface p-4 text-sm text-text-2">
          Página mock de posts curtidos, exibindo conteúdo em destaque que você gostou recentemente.
        </p>

        <div className="space-y-3">
          {likedItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar iniciais={item.author.slice(0, 2)} cor="#BBC79A" size="md" />
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
