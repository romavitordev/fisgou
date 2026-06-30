"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";

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

/** Tela de login/cadastro (FASE 1: auth mock via useAuth). */
export function AuthScreen({ mode }: { mode: Mode }) {
  const t = copy[mode];
  const router = useRouter();
  const { login, signup } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    // Validação simples (estados de erro fazem parte do produto).
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
      if (mode === "signup") await signup(nome, email, senha);
      else await login(email, senha);
      router.replace("/feed");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível continuar.");
      setEnviando(false);
    }
  }

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
          <h1 className="text-2xl font-bold">{t.titulo}</h1>
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
        </div>
      </main>
    </div>
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
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm placeholder:text-text-2 focus:border-brand focus:outline-none"
      />
    </label>
  );
}
