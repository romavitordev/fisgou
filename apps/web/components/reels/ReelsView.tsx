"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clapperboard,
  Heart,
  MessageCircle,
  Share2,
  Music,
  Play,
  Volume2,
  VolumeX,
  ChevronUp,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import type { ReelMock } from "@/data/reels-mock";

/** 12400 → "12,4 mil"; 1200000 → "1,2 mi". */
function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} mi`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(".", ",")} mil`;
  return String(n);
}

/**
 * Reels (E1, mock visual): player vertical em tela cheia com scroll-snap —
 * um vídeo por vez, ações na lateral, autor/legenda/som sobrepostos.
 * O "vídeo" é um placeholder (gradiente + cena) até existir upload real.
 */
export function ReelsView({ reels }: { reels: ReelMock[] }) {
  return (
    // Ancorado na viewport do <main> (relative) — mesma técnica do chat.
    <div className="absolute inset-0 snap-y snap-mandatory overflow-y-auto bg-black">
      {reels.map((reel, i) => (
        <ReelCard key={reel.id} reel={reel} primeiro={i === 0} />
      ))}
    </div>
  );
}

function ReelCard({ reel, primeiro }: { reel: ReelMock; primeiro: boolean }) {
  const [tocando, setTocando] = useState(true);
  const [mudo, setMudo] = useState(true);
  const [curtido, setCurtido] = useState(false);

  const curtidas = reel.curtidas + (curtido ? 1 : 0);

  return (
    <section className="relative h-full w-full snap-start snap-always overflow-hidden">
      {/* "Vídeo" (placeholder): gradiente + cena flutuando */}
      <button
        type="button"
        aria-label={tocando ? "Pausar" : "Reproduzir"}
        onClick={() => setTocando((v) => !v)}
        className="absolute inset-0 h-full w-full cursor-pointer"
        style={{ background: reel.gradiente }}
      >
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[7rem] opacity-90 drop-shadow-[0_12px_32px_rgba(0,0,0,0.35)] sm:text-[9rem]"
          style={{
            animation: "reel-float 5s ease-in-out infinite",
            animationPlayState: tocando ? "running" : "paused",
          }}
        >
          {reel.cena}
        </span>

        {/* Vinhetas p/ legibilidade dos overlays */}
        <span className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Play grande quando pausado */}
        {!tocando && (
          <span className="absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
            <Play className="ml-1 h-10 w-10 fill-white" aria-hidden="true" />
          </span>
        )}
      </button>

      {/* Topo: marca + volume */}
      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-white">
        <span className="inline-flex items-center gap-2 text-lg font-bold">
          <Clapperboard className="h-5 w-5" aria-hidden="true" />
          Reels
        </span>
        <button
          type="button"
          onClick={() => setMudo((v) => !v)}
          aria-label={mudo ? "Ativar som" : "Silenciar"}
          className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition-colors hover:bg-black/50"
        >
          {mudo ? (
            <VolumeX className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </header>

      {/* Ações (lateral direita) */}
      <aside className="absolute bottom-20 right-3 flex flex-col items-center gap-5 text-white">
        <Acao
          icon={
            <Heart
              className={cn("h-7 w-7", curtido && "fill-red-500 text-red-500")}
              aria-hidden="true"
            />
          }
          label={compact(curtidas)}
          ariaLabel={curtido ? "Descurtir" : "Curtir"}
          onClick={() => setCurtido((v) => !v)}
        />
        <Acao
          icon={<MessageCircle className="h-7 w-7" aria-hidden="true" />}
          label={compact(reel.comentarios)}
          ariaLabel="Comentários"
        />
        <Acao
          icon={<Share2 className="h-7 w-7" aria-hidden="true" />}
          label={compact(reel.compartilhamentos)}
          ariaLabel="Compartilhar"
        />
        {/* "Disco" do som girando */}
        <span
          className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white/70 text-xl"
          style={{
            background: reel.autor.cor,
            animation: "spin 6s linear infinite",
            animationPlayState: tocando ? "running" : "paused",
          }}
          aria-hidden="true"
        >
          {reel.cena}
        </span>
      </aside>

      {/* Autor + legenda + som (rodapé esquerdo) */}
      <footer className="pointer-events-none absolute bottom-4 left-0 right-16 flex flex-col gap-2 p-4 text-white">
        <div className="pointer-events-auto flex items-center gap-2">
          <Link href={`/u/${reel.autor.handle}`} className="shrink-0">
            <Avatar
              iniciais={reel.autor.iniciais}
              cor={reel.autor.cor}
              size="sm"
              ring
            />
          </Link>
          <Link
            href={`/u/${reel.autor.handle}`}
            className="truncate text-sm font-semibold hover:underline"
          >
            {reel.autor.nome}
          </Link>
          <button
            type="button"
            className="ml-1 shrink-0 rounded-full border border-white/70 px-3 py-0.5 text-xs font-semibold transition-colors hover:bg-white hover:text-black"
          >
            Seguir
          </button>
        </div>
        <p className="line-clamp-2 text-sm leading-snug drop-shadow">
          {reel.legenda}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-white/85">
          <Music className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{reel.som}</span>
        </p>
      </footer>

      {/* Dica no primeiro reel */}
      {primeiro && (
        <div
          className="pointer-events-none absolute bottom-32 left-1/2 -translate-x-1/2 text-white/90"
          style={{ animation: "reel-hint 1.6s ease-in-out infinite" }}
        >
          <ChevronUp className="mx-auto h-5 w-5" aria-hidden="true" />
          <p className="text-xs font-medium">Arraste pra cima</p>
        </div>
      )}

      {/* Progresso do "vídeo" */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20">
        <div
          className="h-full bg-white/90"
          style={{
            animation: `reel-progress ${reel.duracaoS}s linear infinite`,
            animationPlayState: tocando ? "running" : "paused",
          }}
        />
      </div>
    </section>
  );
}

function Acao({
  icon,
  label,
  ariaLabel,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex flex-col items-center gap-1 drop-shadow transition-transform active:scale-90"
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}
