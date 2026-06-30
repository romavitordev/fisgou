import { MessageCircle } from "lucide-react";
import { TopBar, TopBarTitle } from "@/components/layout/TopBar";
import { PageContainer } from "@/components/layout/PageContainer";

export default function MensagensPage() {
  return (
    <PageContainer>
      <TopBar>
        <TopBarTitle title="Mensagens" />
      </TopBar>

      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <MessageCircle className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-lg font-semibold">Mensagens em breve</h2>
        <p className="mt-2 max-w-xs text-sm text-text-2">
          Logo você vai poder conversar com a galera e combinar pescarias por
          aqui.
        </p>
      </div>
    </PageContainer>
  );
}
