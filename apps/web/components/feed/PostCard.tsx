import Link from "next/link";
import { MessageCircle, Share2, Plus, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { RarityDot } from "@/components/ui/RarityDot";
import { VerificationSeal } from "@/components/ui/VerificationSeal";
import { LikeButton } from "./LikeButton";
import { PostMenu } from "./PostMenu";
import { rarityLabel } from "@/lib/rarity";
import { tempoRelativo } from "@/lib/format";
import type { Post } from "@fisgou/shared";

export function PostCard({
  post,
  onDeleted,
  redirectOnDelete,
}: {
  post: Post;
  onDeleted?: (id: string) => void;
  redirectOnDelete?: string;
}) {
  const { autor, especie, status, pesqueiro } = post;

  return (
    <Card className="overflow-hidden">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 p-3">
        <Link href={`/u/${autor.handle}`} className="shrink-0">
          <Avatar iniciais={autor.iniciais} cor={autor.cor} size="md" src={autor.imagemUrl} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/u/${autor.handle}`} className="hover:underline">
            <p className="truncate text-sm font-semibold leading-tight">
              {autor.nome}
            </p>
          </Link>
          <p className="truncate text-xs text-text-2">
            @{autor.handle} · {tempoRelativo(post.criadoEm)}
          </p>
          {pesqueiro && (
            <Link
              href={`/pesqueiros/${pesqueiro.id}`}
              className="mt-0.5 inline-flex max-w-full items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{pesqueiro.nome}</span>
            </Link>
          )}
        </div>
        <PostMenu
          postId={post.id}
          autorId={autor.id}
          onDeleted={onDeleted}
          redirectOnDelete={redirectOnDelete}
        />
      </div>

      {/* Imagem (placeholder colorido até existir upload). Altura limitada
          pra não criar sensação de "vazio" ao rolar o feed. */}
      <Link href={`/post/${post.id}`} className="block">
        {post.imagemUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imagemUrl}
            alt={especie ? `Foto de ${especie.nome}` : `Foto de ${autor.nome}`}
            className="max-h-[520px] w-full object-cover"
          />
        ) : (
          <div
            className="aspect-video max-h-[420px] w-full"
            style={{ backgroundColor: post.imagemCor }}
            role="img"
            aria-label={
              especie
                ? `Foto de ${especie.nome}`
                : `Foto da publicação de ${autor.nome}`
            }
          />
        )}
      </Link>

      {/* Faixa de espécie (só quando há espécie marcada) */}
      {especie && (
        <div className="flex items-center gap-2 px-3 pt-3">
          <RarityDot rarity={especie.raridade} />
          <span className="text-sm font-medium">
            {especie.nome}
            <span className="text-text-2">
              {" · "}
              {rarityLabel[especie.raridade]}
            </span>
          </span>
          {status && status !== "nao_verificado" && (
            <VerificationSeal status={status} className="h-5 w-5" />
          )}
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-fg active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Fisgados
          </button>
        </div>
      )}

      {/* Legenda */}
      <p className="px-3 py-3 text-sm leading-relaxed">{post.legenda}</p>

      {/* Rodapé de ações */}
      <div className="flex items-center gap-5 border-t border-border px-3 py-2.5 text-text-2">
        <LikeButton postId={post.id} curtidas={post.curtidas} liked={post.liked} />
        <Link
          href={`/post/${post.id}`}
          aria-label="Comentar"
          className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-text"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span>{post.comentarios}</span>
        </Link>
        <button
          type="button"
          aria-label="Compartilhar"
          className="ml-auto inline-flex items-center gap-1.5 text-sm transition-colors hover:text-text"
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </Card>
  );
}
