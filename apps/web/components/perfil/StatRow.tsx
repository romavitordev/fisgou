import { Card } from "@/components/ui/Card";
import type { UserStats } from "@fisgou/shared";

/**
 * Linha de estatísticas do perfil. A terceira coluna é "Seguidores"
 * para criadores (stats.seguidores definido) e "Amigos" para usuários
 * comuns — modelo de rede social diferente por papel.
 */
export function StatRow({ stats }: { stats: UserStats }) {
  const social =
    stats.seguidores != null
      ? { label: "Seguidores", valor: stats.seguidores }
      : { label: "Amigos", valor: stats.amigos ?? 0 };

  const cols = [
    { label: "Peixes", valor: stats.peixes },
    { label: "Espécies", valor: stats.especies },
    social,
  ];

  return (
    <Card className="grid grid-cols-3 divide-x divide-border">
      {cols.map(({ label, valor }) => (
        <div key={label} className="px-2 py-3 text-center">
          <div className="text-xl font-bold leading-none">
            {valor.toLocaleString("pt-BR")}
          </div>
          <div className="mt-1 text-xs text-text-2">{label}</div>
        </div>
      ))}
    </Card>
  );
}
