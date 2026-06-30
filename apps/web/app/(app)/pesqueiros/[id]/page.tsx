import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Star,
  MapPin,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Avatar } from "@/components/ui/Avatar";
import { RarityDot } from "@/components/ui/RarityDot";
import { PageContainer } from "@/components/layout/PageContainer";
import { pesqueiroTipoLabel } from "@/lib/rarity";
import { formatNota } from "@/lib/format";
import { getPesqueiroDetail } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PesqueiroDetalhe({
  params,
}: {
  params: { id: string };
}) {
  const data = await getPesqueiroDetail(params.id);
  if (!data) notFound();
  const { pesqueiro, especies, amigos } = data;

  return (
    <PageContainer className="pb-6">
      {/* Capa + ações sobrepostas */}
      <div className="relative">
        <div
          className="h-40 w-full"
          style={{ backgroundColor: pesqueiro.cor }}
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Link
            href="/pesqueiros"
            aria-label="Voltar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur transition-colors hover:bg-black/30"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            aria-label="Compartilhar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur transition-colors hover:bg-black/30"
          >
            <Share2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold">{pesqueiro.nome}</h1>
        <p className="mt-1 flex items-center gap-1 text-sm">
          {/* Estrela DOURADA = nota do Google. */}
          <Star
            className="h-4 w-4 fill-[#F5B301] text-[#F5B301]"
            aria-hidden="true"
          />
          <span className="font-medium">{formatNota(pesqueiro.nota)}</span>
          <span className="text-text-2">
            · {pesqueiro.avaliacoes} avaliações no Google
          </span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-text-2">
          <Chip as="span" tone="brand">
            {pesqueiroTipoLabel[pesqueiro.tipo]}
          </Chip>
          {pesqueiro.endereco && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {pesqueiro.endereco}
            </span>
          )}
          <span>· {pesqueiro.distanciaKm} km</span>
        </div>

        {/* Ações */}
        <div className="mt-4 flex gap-3">
          <Button className="flex-1">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Falar com Pesqueiro
          </Button>
          <Button variant="secondary" className="flex-1">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Check-in
          </Button>
        </div>
      </div>

      {/* Espécies comuns aqui */}
      <section className="px-4 pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-2">
          Espécies comuns aqui
        </h2>
        <div className="flex flex-wrap gap-2">
          {especies.map((s) => (
            <Chip key={s.id} as="span" tone="neutral">
              <RarityDot rarity={s.raridade} />
              {s.nome}
            </Chip>
          ))}
        </div>
      </section>

      {/* Amigos que pescaram aqui */}
      <section className="px-4 pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-2">
          Amigos que pescaram aqui
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {amigos.map((a) => (
              <Avatar
                key={a.id}
                iniciais={a.iniciais}
                cor={a.cor}
                size="md"
                ring
              />
            ))}
          </div>
          <button
            type="button"
            className="text-sm font-medium text-brand hover:underline"
          >
            Ver todos
          </button>
        </div>
        {/* Nota de privacidade: respeita LocationPrivacy "oculto". */}
        <p className="mt-3 text-xs text-text-2">
          2 amigos ocultaram a localização e não aparecem aqui.
        </p>
      </section>
    </PageContainer>
  );
}
