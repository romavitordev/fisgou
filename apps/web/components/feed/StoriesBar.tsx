"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";

/** Story mock (G1). Vira model + upload real quando sair do mockup. */
interface StoryMock {
  id: string;
  nome: string;
  iniciais: string;
  cor: string;
  /** Gradiente do "conteúdo" do story (placeholder da mídia). */
  gradiente: string;
  cena: string;
  visto?: boolean;
}

const STORIES: StoryMock[] = [
  {
    id: "s1",
    nome: "Marina",
    iniciais: "MT",
    cor: "#14916B",
    gradiente: "linear-gradient(160deg,#0b3d33,#14916B 60%,#7fd0b2)",
    cena: "🎣",
  },
  {
    id: "s2",
    nome: "Rafael",
    iniciais: "RL",
    cor: "#2563EB",
    gradiente: "linear-gradient(160deg,#0c2d5e,#2563EB 60%,#93c5fd)",
    cena: "🌅",
  },
  {
    id: "s3",
    nome: "Bia",
    iniciais: "BN",
    cor: "#7C3AED",
    gradiente: "linear-gradient(160deg,#3b1470,#7C3AED 60%,#d8b4fe)",
    cena: "🐟",
  },
  {
    id: "s4",
    nome: "Caio",
    iniciais: "CM",
    cor: "#EA580C",
    gradiente: "linear-gradient(160deg,#7c2d12,#EA580C 60%,#fcd34d)",
    cena: "🛶",
  },
  {
    id: "s5",
    nome: "Zé",
    iniciais: "ZP",
    cor: "#0891B2",
    gradiente: "linear-gradient(160deg,#083344,#0891B2 60%,#a5f3fc)",
    cena: "🌊",
    visto: true,
  },
];

const DURACAO_MS = 5000;

/**
 * Barra de stories do feed (G1, mock visual): carrossel horizontal com
 * "Seu story +" na frente, anel de novo/visto, e visualizador em tela
 * cheia com barras de progresso, pausa ao segurar e navegação.
 */
export function StoriesBar() {
  const { user } = useAuth();
  const [abertoEm, setAbertoEm] = useState<number | null>(null);
  const [progresso, setProgresso] = useState(0);
  const [pausado, setPausado] = useState(false);

  const rafRef = useRef<number | null>(null);
  // O progresso vive no ref durante a animação e o state só espelha pra
  // pintar — assim o loop nunca lê um valor obsoleto (stale closure).
  const progressoRef = useRef(0);

  const fechar = useCallback(() => setAbertoEm(null), []);

  const avancar = useCallback(() => {
    setAbertoEm((i) =>
      i === null ? null : i + 1 >= STORIES.length ? null : i + 1,
    );
  }, []);

  const voltar = useCallback(() => {
    setAbertoEm((i) => (i === null ? null : Math.max(0, i - 1)));
  }, []);

  // Um ciclo de progresso por story aberto; pausar congela o relógio.
  useEffect(() => {
    if (abertoEm === null) return;

    progressoRef.current = 0;
    setProgresso(0);
    let ultimo = performance.now();

    const tick = (agora: number) => {
      const delta = agora - ultimo;
      ultimo = agora;

      if (!pausado) {
        progressoRef.current = Math.min(
          100,
          progressoRef.current + (delta / DURACAO_MS) * 100,
        );
        setProgresso(progressoRef.current);
        if (progressoRef.current >= 100) {
          avancar();
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [abertoEm, pausado, avancar]);

  // Teclado: setas navegam, Esc fecha.
  useEffect(() => {
    if (abertoEm === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowRight") avancar();
      if (e.key === "ArrowLeft") voltar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abertoEm, fechar, avancar, voltar]);

  const story = abertoEm === null ? null : STORIES[abertoEm];

  return (
    <>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 no-scrollbar">
        {/* Seu story (adicionar) */}
        <button
          type="button"
          className="flex w-16 shrink-0 flex-col items-center gap-1"
          aria-label="Adicionar seu story"
        >
          <span className="relative inline-flex">
            <Avatar
              iniciais={user?.iniciais ?? "?"}
              cor={user?.cor ?? "#14916B"}
              src={user?.imagemUrl}
              size="lg"
              className="ring-2 ring-border"
            />
            <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-brand-fg ring-2 ring-bg">
              <Plus className="h-3 w-3" aria-hidden="true" />
            </span>
          </span>
          <span className="w-full truncate text-center text-[11px] text-text-2">
            Seu story
          </span>
        </button>

        {STORIES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setAbertoEm(i)}
            className="flex w-16 shrink-0 flex-col items-center gap-1"
            aria-label={`Abrir story de ${s.nome}`}
          >
            {/* Anel gradiente = story novo; cinza = já visto. */}
            <span
              className={cn(
                "inline-flex rounded-full p-[2px] transition-transform hover:scale-105",
                s.visto ? "bg-border" : "bg-gradient-to-tr from-brand to-amber",
              )}
            >
              <span className="inline-flex rounded-full bg-bg p-[2px]">
                <Avatar iniciais={s.iniciais} cor={s.cor} size="lg" />
              </span>
            </span>
            <span className="w-full truncate text-center text-[11px] text-text-2">
              {s.nome}
            </span>
          </button>
        ))}
      </div>

      {/* Visualizador em tela cheia */}
      {story && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 sm:p-6"
          onClick={fechar}
        >
          <div
            className="relative flex h-full w-full max-w-sm flex-col overflow-hidden bg-black sm:h-[80vh] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={() => setPausado(true)}
            onPointerUp={() => setPausado(false)}
            onPointerLeave={() => setPausado(false)}
          >
            {/* Barras de progresso (uma por story) */}
            <div className="absolute inset-x-0 top-0 z-20 flex gap-1 p-2">
              {STORIES.map((s, i) => (
                <span
                  key={s.id}
                  className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
                >
                  <span
                    className="block h-full bg-white"
                    style={{
                      width:
                        i < (abertoEm ?? 0)
                          ? "100%"
                          : i === abertoEm
                            ? `${progresso}%`
                            : "0%",
                    }}
                  />
                </span>
              ))}
            </div>

            {/* Cabeçalho */}
            <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent px-3 pb-8 pt-6 text-white">
              <Avatar iniciais={story.iniciais} cor={story.cor} size="sm" ring />
              <span className="flex-1 truncate text-sm font-semibold">
                {story.nome}
              </span>
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar story"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Conteúdo (placeholder da mídia) */}
            <div
              className="flex flex-1 items-center justify-center"
              style={{ background: story.gradiente }}
            >
              <span className="text-[6rem] drop-shadow-lg" aria-hidden="true">
                {story.cena}
              </span>
            </div>

            {/* Zonas de toque: terço esquerdo volta, direito avança. */}
            <button
              type="button"
              onClick={voltar}
              aria-label="Story anterior"
              className="absolute inset-y-0 left-0 z-10 w-1/3"
            />
            <button
              type="button"
              onClick={avancar}
              aria-label="Próximo story"
              className="absolute inset-y-0 right-0 z-10 w-1/3"
            />

            {/* Setas (desktop) */}
            <button
              type="button"
              onClick={voltar}
              aria-label="Story anterior"
              className="absolute left-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 sm:flex"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={avancar}
              aria-label="Próximo story"
              className="absolute right-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 sm:flex"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
