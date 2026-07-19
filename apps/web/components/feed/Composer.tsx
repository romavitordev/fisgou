import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import type { User } from "@fisgou/shared";

/**
 * Composer enxuto do feed. É só um atalho visual: leva a /criar
 * (a publicação real acontece lá).
 */
export function Composer({ user }: { user: User | null }) {
  return (
    <Card className="p-3">
      <Link
        href="/criar"
        className="flex items-center gap-3 rounded-xl"
        aria-label="Criar nova publicação"
      >
        <Avatar
          iniciais={user?.iniciais ?? "?"}
          cor={user?.cor ?? "#14916B"}
          size="md"
          src={user?.imagemUrl}
        />
        <span className="flex-1 rounded-full bg-surface-2 px-4 py-2.5 text-sm text-text-2">
          No que você fisgou hoje?
        </span>
      </Link>
    </Card>
  );
}
