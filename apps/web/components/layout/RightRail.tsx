import Link from "next/link";
import { Search, TrendingUp, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { RarityDot } from "@/components/ui/RarityDot";
import { FollowButton } from "@/components/ui/FollowButton";
import { getRailData, getViewer } from "@/lib/queries";

/**
 * Coluna lateral direita — só em telas largas (xl+). Aproveita o espaço
 * do desktop com busca, espécies em alta e sugestões de pescadores.
 * Dados reais do banco.
 */
export async function RightRail() {
  const viewer = await getViewer();
  const { emAlta, pescadores } = await getRailData(viewer?.id ?? null);

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-border px-4 py-4 xl:block">
      {/* Busca */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-2"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Buscar espécies, pesqueiros…"
          aria-label="Buscar"
          className="w-full rounded-full border border-border bg-surface-2 py-2.5 pl-9 pr-4 text-sm placeholder:text-text-2 focus:border-brand focus:bg-surface focus:outline-none"
        />
      </div>

      {/* Espécies em alta */}
      <Card className="mt-4 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 text-brand" aria-hidden="true" />
          Espécies em alta
        </h2>
        <ul className="space-y-3">
          {emAlta.map((s) => (
            <li key={s.id} className="flex items-center gap-3">
              <span
                className="h-9 w-9 shrink-0 rounded-lg"
                style={{ backgroundColor: s.cor }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {s.nome}
                </span>
                <RarityDot
                  rarity={s.raridade}
                  withLabel
                  className="text-xs"
                />
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Pescadores para seguir */}
      <Card className="mt-4 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <UserPlus className="h-4 w-4 text-brand" aria-hidden="true" />
          Pescadores para seguir
        </h2>
        <ul className="space-y-3">
          {pescadores.map(({ user: u, isFollowing }) => (
            <li key={u.id} className="flex items-center gap-3">
              <Link href={`/u/${u.handle}`} className="shrink-0">
                <Avatar iniciais={u.iniciais} cor={u.cor} size="sm" src={u.imagemUrl} />
              </Link>
              <Link href={`/u/${u.handle}`} className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium leading-tight hover:underline">
                  {u.nome}
                </span>
                <span className="block truncate text-xs text-text-2">
                  @{u.handle}
                </span>
              </Link>
              <FollowButton handle={u.handle} initialFollowing={isFollowing} />
            </li>
          ))}
          {pescadores.length === 0 && (
            <li className="text-sm text-text-2">Sem sugestões por enquanto.</li>
          )}
        </ul>
      </Card>
    </aside>
  );
}
