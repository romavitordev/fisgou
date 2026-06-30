"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Fish, Store, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import type { UserRole } from "@fisgou/shared";

type Mode = "login" | "signup";

const copy = {
  login: {
    titulo: "Entrar no Fisgou",
    sub: "Bom te ver de volta. Continue de onde parou.",
    acao: "Entrar",
    alt: "Não tem conta?",
    altLink: "/cadastro",
    altLabel: "Criar conta",
  },
  signup: {
    titulo: "Criar sua conta",
    sub: "Junte-se à comunidade e comece sua coleção Fisgados.",
    acao: "Criar conta",
    alt: "Já tem conta?",
    altLink: "/login",
    altLabel: "Entrar",
  },
} as const;

/** Tela de login/cadastro. No cadastro, primeiro passo escolhe o papel. */
export function AuthScreen({ mode }: { mode: Mode }) {
  const t = copy[mode];
  const router = useRouter();
  const { login, signup } = useAuth();

  // No login não há escolha de papel; já "pula" a etapa.
  const [role, setRole] = useState<UserRole | null>(mode === "login" ? "pescador" : null);
  const [nome, setNome] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (mode === "signup" && nome.trim().length < 2) {
      return setErro("Informe seu nome.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setErro("Digite um e-mail válido.");
    }
    if (senha.length < 6) {
      return setErro("A senha precisa ter ao menos 6 caracteres.");
    }

    setEnviando(true);
    try {
      if (mode === "signup") {
        await signup(nome, email, senha, role ?? "pescador", nomeNegocio);
      } else {
        await login(email, senha);
      }
      router.replace("/feed");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível continuar.");
      setEnviando(false);
    }
  }

  // Passo 1 do cadastro: escolher o papel.
  const mostrarEscolhaPapel = mode === "signup" && role === null;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg">
      <header className="flex items-center justify-between p-4">
        <Link href="/" aria-label="Voltar para a página inicial">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {mostrarEscolhaPapel ? (
            <RoleStep onChoose={setRole} />
          ) : (
            <>
              <div className="flex items-center gap-2">
                {mode === "signup" && (
                  <button
                    type="button"
                    onClick={() => setRole(null)}
                    aria-label="Voltar"
                    className="-ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <h1 className="text-2xl font-bold">{t.titulo}</h1>
              </div>
              <p className="mt-1 text-sm text-text-2">{t.sub}</p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                {mode === "signup" && (
                  <Field
                    label="Nome"
                    type="text"
                    value={nome}
                    onChange={setNome}
                    placeholder="Seu nome"
                    autoComplete="name"
                  />
                )}
                {mode === "signup" && role === "vendedor" && (
                  <Field
                    label="Nome do negócio / pesqueiro"
                    type="text"
                    value={nomeNegocio}
                    onChange={setNomeNegocio}
                    placeholder="Ex.: Pesque-pague Bom Retiro"
                    autoComplete="organization"
                  />
                )}
                <Field
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                />
                <Field
                  label="Senha"
                  type="password"
                  value={senha}
                  onChange={setSenha}
                  placeholder="Pelo menos 6 caracteres"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />

                {erro && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {erro}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={enviando}>
                  {enviando && (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  )}
                  {t.acao}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-text-2">
                {t.alt}{" "}
                <Link
                  href={t.altLink}
                  className="font-semibold text-brand hover:underline"
                >
                  {t.altLabel}
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function RoleStep({ onChoose }: { onChoose: (r: UserRole) => void }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Como você usa o Fisgou?</h1>
      <p className="mt-1 text-sm text-text-2">
        Isso ajusta sua experiência — você pode mudar isso depois no perfil.
      </p>

      <div className="mt-6 space-y-3">
        <RoleOption
          icon={Fish}
          titulo="Sou Pescador"
          texto="Quero registrar fisgadas, montar minha coleção e seguir a comunidade."
          onClick={() => onChoose("pescador")}
        />
        <RoleOption
          icon={Store}
          titulo="Sou Vendedor"
          texto="Tenho um pesqueiro ou negócio e quero divulgar pra comunidade."
          onClick={() => onChoose("vendedor")}
        />
      </div>
    </div>
  );
}

function RoleOption({
  icon: Icon,
  titulo,
  texto,
  onClick,
}: {
  icon: typeof Fish;
  titulo: string;
  texto: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-left transition-colors hover:border-brand hover:bg-brand-soft",
      )}
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm font-semibold">{titulo}</span>
        <span className="mt-0.5 block text-xs text-text-2">{texto}</span>
      </span>
    </button>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="campo"
      />
    </label>
  );
}
