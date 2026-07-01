"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Camera,
  Fish,
  MapPin,
  Crosshair,
  Waves,
  Lock,
  Check,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { RarityDot } from "@/components/ui/RarityDot";
import { PageContainer } from "@/components/layout/PageContainer";
import { SpeciesPicker } from "@/components/feed/SpeciesPicker";
import { PesqueiroPicker } from "@/components/feed/PesqueiroPicker";
import { FriendsPicker } from "@/components/feed/FriendsPicker";
import { cn } from "@/lib/cn";
import { privacyLabel, privacyHint } from "@/lib/rarity";
import type { LocationPrivacy, Species, Pesqueiro, User } from "@fisgou/shared";

const opcoesPrivacidade: {
  id: LocationPrivacy;
  icon: typeof Crosshair;
}[] = [
  { id: "exato", icon: Crosshair },
  { id: "aproximado", icon: Waves },
  { id: "oculto", icon: Lock },
];

export default function CriarPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [legenda, setLegenda] = useState("");
  const [privacidade, setPrivacidade] =
    useState<LocationPrivacy>("aproximado");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [especie, setEspecie] = useState<Species | null>(null);
  const [pesqueiro, setPesqueiro] = useState<Pesqueiro | null>(null);
  const [amigos, setAmigos] = useState<User[]>([]);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [mostrarPesqueiroPicker, setMostrarPesqueiroPicker] = useState(false);
  const [mostrarAmigosPicker, setMostrarAmigosPicker] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function escolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setArquivo(f);
    setPreview(URL.createObjectURL(f));
  }

  async function publicar() {
    if (publicando) return;
    if (!legenda.trim()) {
      setErro("Escreva uma legenda para publicar.");
      return;
    }
    setErro(null);
    setPublicando(true);
    try {
      // 1) Sobe a foto (se houver) → URL local.
      let imagemUrl: string | undefined;
      if (arquivo) {
        const fd = new FormData();
        fd.append("file", arquivo);
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        const upData = await up.json();
        if (!up.ok) throw new Error(upData?.error);
        imagemUrl = upData.url;
      }

      // 2) Cria o post.
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legenda,
          localPrivacidade: privacidade,
          imagemUrl,
          speciesId: especie?.id,
          pesqueiroId: pesqueiro?.id,
          amigosIds: amigos.map((a) => a.id),
        }),
      });
      if (!res.ok) throw new Error();
      router.push("/feed");
      router.refresh();
    } catch (e) {
      setErro(
        e instanceof Error && e.message
          ? e.message
          : "Não foi possível publicar. Tente novamente.",
      );
      setPublicando(false);
    }
  }

  return (
    <PageContainer>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/85 px-4 py-3 backdrop-blur">
        <Link
          href="/feed"
          aria-label="Fechar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </Link>
        <h1 className="text-base font-semibold">Nova publicação</h1>
        <Button
          size="sm"
          className="rounded-full"
          onClick={publicar}
          disabled={publicando}
        >
          Publicar
        </Button>
      </header>

      <div className="space-y-5 p-4 pb-28">
        {/* Adicionar foto */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={escolherFoto}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative flex h-56 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-brand/40 bg-brand-soft/50 text-brand transition-colors hover:bg-brand-soft"
        >
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Pré-visualização"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
                Trocar foto
              </span>
            </>
          ) : (
            <>
              <Camera className="h-8 w-8" aria-hidden="true" />
              <span className="text-sm font-semibold">Adicionar foto</span>
              <span className="text-xs text-text-2">
                toque para escolher da galeria ou câmera
              </span>
            </>
          )}
        </button>

        {/* Legenda */}
        <textarea
          value={legenda}
          onChange={(e) => setLegenda(e.target.value)}
          placeholder="Escreva uma legenda…"
          rows={3}
          className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-text-2 focus:border-brand focus:outline-none"
        />

        {/* Marcações opcionais */}
        <div className="flex gap-3">
          {especie ? (
            <Chip
              tone="brand"
              active
              className="flex-1 justify-center py-2.5"
              onClick={() => setEspecie(null)}
            >
              <RarityDot rarity={especie.raridade} />
              {especie.nome}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </Chip>
          ) : (
            <Chip
              tone="neutral"
              className="flex-1 justify-center py-2.5"
              onClick={() => setMostrarPicker(true)}
            >
              <Fish className="h-4 w-4 text-brand" aria-hidden="true" />
              Marcar espécie
            </Chip>
          )}
          {pesqueiro ? (
            <Chip
              tone="brand"
              active
              className="flex-1 justify-center py-2.5"
              onClick={() => setPesqueiro(null)}
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span className="truncate">{pesqueiro.nome}</span>
              <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </Chip>
          ) : (
            <Chip
              tone="neutral"
              className="flex-1 justify-center py-2.5"
              onClick={() => setMostrarPesqueiroPicker(true)}
            >
              <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
              Marcar pesqueiro
            </Chip>
          )}
        </div>
        {/* Marcar amigos */}
        {amigos.length > 0 ? (
          <Chip
            tone="brand"
            active
            className="w-full justify-center py-2.5"
            onClick={() => setMostrarAmigosPicker(true)}
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            <span className="truncate">
              {amigos.length === 1
                ? amigos[0].nome
                : `${amigos[0].nome} e mais ${amigos.length - 1}`}
            </span>
          </Chip>
        ) : (
          <Chip
            tone="neutral"
            className="w-full justify-center py-2.5"
            onClick={() => setMostrarAmigosPicker(true)}
          >
            <Users className="h-4 w-4 text-brand" aria-hidden="true" />
            Marcar amigos
          </Chip>
        )}

        {especie && (
          <p className="text-xs text-text-2">
            Capturas com espécie marcada entram em análise para verificação.
          </p>
        )}

        {mostrarPicker && (
          <SpeciesPicker
            onSelect={(s) => {
              setEspecie(s);
              setMostrarPicker(false);
            }}
            onClose={() => setMostrarPicker(false)}
          />
        )}

        {mostrarPesqueiroPicker && (
          <PesqueiroPicker
            onSelect={(p) => {
              setPesqueiro(p);
              setMostrarPesqueiroPicker(false);
            }}
            onClose={() => setMostrarPesqueiroPicker(false)}
          />
        )}

        {mostrarAmigosPicker && (
          <FriendsPicker
            jaSelecionados={amigos}
            onConfirm={(users) => {
              setAmigos(users);
              setMostrarAmigosPicker(false);
            }}
            onClose={() => setMostrarAmigosPicker(false)}
          />
        )}

        {/* Privacidade da localização */}
        <fieldset>
          <legend className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-2">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Privacidade da localização
          </legend>
          <div className="space-y-2">
            {opcoesPrivacidade.map(({ id, icon: Icon }) => {
              const ativo = privacidade === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPrivacidade(id)}
                  aria-pressed={ativo}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                    ativo
                      ? "border-brand bg-brand-soft"
                      : "border-border bg-surface hover:bg-surface-2",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      ativo ? "text-brand" : "text-text-2",
                    )}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {privacyLabel[id]}
                    </span>
                    <span className="block text-xs text-text-2">
                      {privacyHint[id]}
                    </span>
                  </span>
                  {ativo && (
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Publicar fixo embaixo */}
      <div className="sticky bottom-0 border-t border-border bg-surface p-4">
        {erro && (
          <p role="alert" className="mb-2 text-center text-sm text-red-500">
            {erro}
          </p>
        )}
        <Button
          size="lg"
          className="w-full"
          onClick={publicar}
          disabled={publicando}
        >
          {publicando && (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          )}
          Publicar
        </Button>
      </div>
    </PageContainer>
  );
}
