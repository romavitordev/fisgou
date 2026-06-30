"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowLeft, Camera, Crown, Loader2, Check } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { ACCENTS, ACCENT_KEYS, DEFAULT_ACCENT, type AccentKey } from "@/lib/accent";
import type { User } from "@fisgou/shared";

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/upload", { method: "POST", body: fd });
  const d = await r.json();
  if (!r.ok) throw new Error(d?.error ?? "Falha no upload.");
  return d.url as string;
}

export function EditProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState(user.nome);
  const [bio, setBio] = useState(user.bio ?? "");
  const [cidade, setCidade] = useState(user.cidade ?? "");
  const [accent, setAccent] = useState<AccentKey>(
    (user.accent as AccentKey) ?? DEFAULT_ACCENT,
  );
  const [criador, setCriador] = useState(!!user.criador);
  const [imagemUrl, setImagemUrl] = useState<string | null>(user.imagemUrl ?? null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(user.bannerUrl ?? null);

  const [salvando, setSalvando] = useState(false);
  const [subindo, setSubindo] = useState<"avatar" | "banner" | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function onFile(
    e: ChangeEvent<HTMLInputElement>,
    tipo: "avatar" | "banner",
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    setErro(null);
    setSubindo(tipo);
    try {
      const url = await uploadFile(file);
      if (tipo === "avatar") setImagemUrl(url);
      else setBannerUrl(url);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setSubindo(null);
    }
  }

  async function salvar() {
    if (salvando) return;
    if (nome.trim().length < 2) {
      setErro("Informe um nome válido.");
      return;
    }
    setErro(null);
    setSalvando(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          bio,
          cidade,
          accent,
          criador,
          imagemUrl,
          bannerUrl,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? "Não foi possível salvar.");
      }
      await refreshUser();
      router.push("/perfil");
      router.refresh();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível salvar.");
      setSalvando(false);
    }
  }

  const bannerColor = ACCENTS[accent][dark ? "dark" : "light"];

  return (
    <div className="pb-10">
      <input
        ref={avatarRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e, "avatar")}
      />
      <input
        ref={bannerRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e, "banner")}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/85 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="text-base font-semibold">Editar perfil</h1>
        <Button size="sm" className="rounded-full" onClick={salvar} disabled={salvando}>
          {salvando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Salvar
        </Button>
      </header>

      {/* Banner + avatar */}
      <div className="relative">
        <button
          type="button"
          onClick={() => bannerRef.current?.click()}
          className="relative block h-36 w-full overflow-hidden sm:h-44"
          style={bannerUrl ? undefined : { backgroundColor: bannerColor }}
          aria-label="Trocar foto de capa"
        >
          {bannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerUrl} alt="Capa" className="h-full w-full object-cover" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white opacity-0 transition-opacity hover:opacity-100">
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              {subindo === "banner" ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Camera className="h-5 w-5" aria-hidden="true" />
              )}
              Trocar capa
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => avatarRef.current?.click()}
          className="group absolute -bottom-10 left-4"
          aria-label="Trocar foto de perfil"
        >
          <span className="relative block rounded-full ring-4 ring-bg">
            <Avatar
              iniciais={user.iniciais}
              cor={user.cor}
              src={imagemUrl ?? undefined}
              size="xl"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 text-white opacity-0 transition-opacity group-hover:opacity-100">
              {subindo === "avatar" ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Camera className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
          </span>
        </button>
      </div>

      <div className="mx-auto max-w-xl space-y-6 px-4 pt-14">
        {erro && (
          <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {erro}
          </p>
        )}

        <Campo label="Nome">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="campo"
            placeholder="Seu nome"
          />
        </Campo>

        <Campo label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="campo resize-none"
            placeholder="Conte um pouco sobre você e sua pesca…"
          />
        </Campo>

        <Campo label="Cidade">
          <input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="campo"
            placeholder="Cidade, UF"
          />
        </Campo>

        {/* Cor de destaque */}
        <div>
          <p className="mb-2 text-sm font-medium">Cor de destaque</p>
          <div className="flex flex-wrap gap-3">
            {ACCENT_KEYS.map((key) => {
              const cor = ACCENTS[key][dark ? "dark" : "light"];
              const ativo = accent === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAccent(key)}
                  title={ACCENTS[key].nome}
                  aria-pressed={ativo}
                  aria-label={`Cor ${ACCENTS[key].nome}`}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-bg transition-transform hover:scale-110",
                    ativo ? "ring-text" : "ring-transparent",
                  )}
                  style={{ backgroundColor: cor }}
                >
                  {ativo && <Check className="h-4 w-4 text-white" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-text-2">
            Personaliza os botões e destaques do app só pra você.
          </p>
        </div>

        {/* Tornar-se criador */}
        <button
          type="button"
          onClick={() => setCriador((v) => !v)}
          aria-pressed={criador}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-2"
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-soft text-amber">
            <Crown className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Perfil de criador</span>
            <span className="block text-xs text-text-2">
              Vira perfil profissional, com selo Criador e seguidores no lugar de
              amigos.
            </span>
          </span>
          <span
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              criador ? "bg-brand" : "bg-surface-2 border border-border",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                criador ? "left-[22px]" : "left-0.5",
              )}
            />
          </span>
        </button>

        <div className="flex justify-end">
          <Button size="lg" onClick={salvar} disabled={salvando}>
            {salvando && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
            Salvar alterações
          </Button>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
