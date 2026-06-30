import Link from "next/link";
import { Image as ImageIcon, Fish, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import type { User } from "@fisgou/shared";

/**
 * Composer enxuto do feed. É só um atalho visual: tudo leva a /criar
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

      <div className="mt-3 flex items-center justify-around border-t border-border pt-2">
        <Atalho icon={ImageIcon} label="Foto" />
        <Atalho icon={Fish} label="Espécie" />
        <Atalho icon={MapPin} label="Local" />
      </div>
    </Card>
  );
}

function Atalho({
  icon: Icon,
  label,
}: {
  icon: typeof MapPin;
  label: string;
}) {
  return (
    <Link
      href="/criar"
      className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
    >
      <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
      {label}
    </Link>
  );
}
