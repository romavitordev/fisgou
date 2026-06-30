import Link from "next/link";
import {
  Fish,
  MapPin,
  Trophy,
  BadgeCheck,
  ArrowRight,
  Camera,
  Search,
  Users,
  Heart,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { Parallax } from "@/components/landing/Parallax";

/**
 * Landing pública (/) — apresentação da plataforma. Sem chrome do app.
 * Conteúdo amplo + elementos que se movem com o scroll (parallax/reveal).
 */
export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="sm">Criar conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* Blobs e peixes decorativos com parallax (movem no scroll) */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <Parallax speed={-0.15}>
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
          </Parallax>
          <Parallax speed={0.12}>
            <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-brand/15 blur-3xl" />
          </Parallax>
          <Parallax speed={0.25} className="absolute left-[8%] top-[30%]">
            <Fish className="h-10 w-10 -scale-x-100 text-brand/30 animate-float" />
          </Parallax>
          <Parallax speed={0.4} className="absolute right-[12%] top-[55%]">
            <Fish className="h-14 w-14 text-brand/20 animate-float [animation-delay:1.5s]" />
          </Parallax>
          <Parallax speed={0.18} className="absolute right-[28%] top-[18%]">
            <Fish className="h-7 w-7 text-brand/25 animate-float [animation-delay:3s]" />
          </Parallax>
        </div>

        <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-sm font-medium text-brand">
              <Fish className="h-4 w-4" aria-hidden="true" />
              A comunidade dos pescadores
            </span>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Registre suas fisgadas, complete sua coleção e descubra{" "}
              <span className="text-brand">onde pescar.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-text-2 sm:text-xl">
              O Fisgou junta um feed social, uma coleção gamificada de espécies —
              os seus <strong className="text-text">Fisgados</strong> — e um mapa
              de pesqueiros perto de você. Cada peixe conta uma história.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/cadastro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Criar conta grátis
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/feed" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Explorar o feed
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400} className="mt-16">
            <ChevronDown
              className="mx-auto h-6 w-6 animate-bounce text-text-2"
              aria-hidden="true"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-surface-2/40">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 px-4 py-10 text-center">
          {[
            { n: "12k+", l: "fisgadas registradas" },
            { n: "180+", l: "espécies no catálogo" },
            { n: "500+", l: "pesqueiros mapeados" },
          ].map((s, i) => (
            <ScrollReveal key={s.l} delay={i * 100}>
              <div className="text-3xl font-bold text-brand sm:text-4xl">{s.n}</div>
              <div className="mt-1 text-sm text-text-2">{s.l}</div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Tudo que a pescaria pede, num lugar só
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-text-2">
            Social, gamificado e útil de verdade pra quem vive a pesca.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <ScrollReveal key={f.titulo} delay={i * 90}>
              <Feature {...f} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SHOWCASE (preview do feed) */}
      <section className="border-y border-border bg-surface-2/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          <ScrollReveal>
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-brand">
                Feed social
              </span>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Compartilhe a fisgada e veja a comunidade reagir
              </h2>
              <p className="mt-4 text-text-2">
                Poste foto, marque a espécie e o pesqueiro, escolha a privacidade
                da localização e receba curtidas e comentários em tempo real.
                Capturas podem ser <strong className="text-text">verificadas</strong>{" "}
                e entram na sua coleção Fisgados.
              </p>
              <Link href="/cadastro" className="mt-6 inline-block">
                <Button>
                  Começar agora
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <Parallax speed={-0.05}>
              <FakePost />
            </Parallax>
          </ScrollReveal>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Como funciona
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {passos.map((p, i) => (
            <ScrollReveal key={p.titulo} delay={i * 120}>
              <Passo {...p} n={i + 1} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <Parallax speed={0.2} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Fish className="h-40 w-40 text-brand/10" />
          </Parallax>
        </div>
        <ScrollReveal className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Bora fisgar o primeiro?</h2>
          <p className="mx-auto mt-3 max-w-xl text-text-2">
            Crie sua conta grátis e comece a montar sua coleção hoje.
          </p>
          <Link href="/cadastro" className="mt-7 inline-block">
            <Button size="lg">
              Criar conta grátis
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-text-2 sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} Fisgou · feito para a comunidade da pesca.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Users,
    titulo: "Feed social",
    texto: "Compartilhe fisgadas, curta, comente e siga outros pescadores.",
  },
  {
    icon: Trophy,
    titulo: "Coleção Fisgados",
    texto: "Cada espécie capturada entra na sua coleção. Complete e suba de nível.",
  },
  {
    icon: BadgeCheck,
    titulo: "Capturas verificadas",
    texto: "Mande sua captura para verificação e ganhe o selo de confiança.",
  },
  {
    icon: MapPin,
    titulo: "Mapa de pesqueiros",
    texto: "Encontre represas, rios e pesque-pagues perto de você, com notas.",
  },
] as const;

const passos = [
  {
    icon: Camera,
    titulo: "Registre a fisgada",
    texto: "Foto, legenda, espécie e privacidade da localização. Em segundos.",
  },
  {
    icon: Fish,
    titulo: "Complete os Fisgados",
    texto: "Espécies novas entram na sua coleção com raridade e selo de status.",
  },
  {
    icon: Search,
    titulo: "Descubra e conecte",
    texto: "Ache pesqueiros, combine pescarias e siga a galera da comunidade.",
  },
] as const;

function Feature({
  icon: Icon,
  titulo,
  texto,
}: {
  icon: typeof Fish;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="h-full rounded-2xl border border-border bg-surface p-5 transition-transform hover:-translate-y-1">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-semibold">{titulo}</h3>
      <p className="mt-1 text-sm text-text-2">{texto}</p>
    </div>
  );
}

function Passo({
  n,
  icon: Icon,
  titulo,
  texto,
}: {
  n: number;
  icon: typeof Fish;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="text-center">
      <span className="relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-brand-fg">
        <Icon className="h-7 w-7" aria-hidden="true" />
        <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-bg bg-surface text-xs font-bold text-brand">
          {n}
        </span>
      </span>
      <h3 className="mt-4 font-semibold">{titulo}</h3>
      <p className="mx-auto mt-1 max-w-xs text-sm text-text-2">{texto}</p>
    </div>
  );
}

/** Mini-preview de um post (decorativo) para a seção de showcase. */
function FakePost() {
  return (
    <div className="mx-auto w-full max-w-sm rotate-1 rounded-2xl border border-border bg-surface shadow-xl">
      <div className="flex items-center gap-3 p-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2D7DD2] text-sm font-semibold text-white">
          RL
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight">Rafael Lima</p>
          <p className="text-xs text-text-2">@rafa.fisgou · há 2 h</p>
        </div>
      </div>
      <div className="aspect-video w-full bg-[#9DBFAE]" />
      <div className="flex items-center gap-2 px-3 pt-3">
        <span className="h-2 w-2 rounded-full bg-[#7C5CD6]" />
        <span className="text-sm font-medium">
          Tucunaré-açu <span className="text-text-2">· raro</span>
        </span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
          + Fisgados
        </span>
      </div>
      <p className="px-3 py-3 text-sm">
        Acordei 5h e valeu cada minuto. Represa espelhada, sem vento. 🎣
      </p>
      <div className="flex items-center gap-5 border-t border-border px-3 py-2.5 text-text-2">
        <span className="inline-flex items-center gap-1.5 text-sm text-red-500">
          <Heart className="h-5 w-5 fill-current" aria-hidden="true" /> 128
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm">
          <MessageCircle className="h-5 w-5" aria-hidden="true" /> 14
        </span>
      </div>
    </div>
  );
}
