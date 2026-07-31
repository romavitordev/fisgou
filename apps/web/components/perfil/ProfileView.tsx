"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  SlidersHorizontal,
  Crown,
  Menu,
  Trash2,
  Plus,
  UserPlus,
  UserCheck,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatRow } from "@/components/perfil/StatRow";
import { BadgeRow } from "@/components/perfil/BadgeRow";
import { ProfileMenu } from "@/components/perfil/ProfileMenu";
import { FisgadosTab } from "@/components/perfil/FisgadosTab";
import { ProgressoColecao } from "@/components/fisgados/ProgressoColecao";
import { PostCard } from "@/components/feed/PostCard";
import { useOpenConv } from "@/components/chat/StartChatButtons";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import type {
  User,
  Post,
  CollectionEntry,
  Species,
  Badge,
} from "@fisgou/shared";

type Tab = "publicacoes" | "fisgados" | "insignias" | "conjunto";

const STORAGE_KEY = "fisgou-profile-conjuntos";

export interface ProfileData {
  user: User;
  isMe: boolean;
  isFollowing: boolean;
  posts: Post[];
  entries: CollectionEntry[];
  locked: Species[];
  capturadas: number;
  total: number;
  badges: Badge[];
}

export function ProfileView({
  user,
  isMe,
  isFollowing,
  posts,
  entries,
  locked,
  capturadas,
  total,
  badges,
}: ProfileData) {
  const router = useRouter();
  const { logout } = useAuth();
  const abrirConversa = useOpenConv();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tab, setTab] = useState<Tab>("publicacoes");
  const [menuAberto, setMenuAberto] = useState(false);
  const [seguindo, setSeguindo] = useState(isFollowing);
  const [pendente, setPendente] = useState(false);
  const [dmPendente, setDmPendente] = useState(false);
  const [dmErro, setDmErro] = useState<string | null>(null);
  const [postsState, setPostsState] = useState(posts);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: "publicacoes", label: "Publicações" },
    { id: "fisgados", label: "Fisgados" },
    { id: "insignias", label: "Insígnias" },
    ...(isMe ? [{ id: "conjunto" as Tab, label: "Conjunto" }] : []),
  ];

  const equipamentoOptions = [
    "Isca pronta",
    "Vara",
    "Molinete",
    "Linha",
    "Boia",
    "Anzol",
    "Chumbada",
    "Alicate",
  ] as const;

  type Equipamento = (typeof equipamentoOptions)[number];
  interface Conjunto {
    id: string;
    nome: string;
    itens: Equipamento[];
  }

  const [conjuntos, setConjuntos] = useState<Conjunto[]>([]);
  const [editingConjunto, setEditingConjunto] = useState(false);
  const [novoNomeConjunto, setNovoNomeConjunto] = useState("");
  const [novoItens, setNovoItens] = useState<Equipamento[]>([]);
  const [conjuntoErro, setConjuntoErro] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Conjunto[];
      if (Array.isArray(saved)) setConjuntos(saved);
    } catch {
      // ignore malformed storage
    }
  }, [setConjuntos]);

  useEffect(() => {
    if (!isMe) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conjuntos));
  }, [conjuntos, isMe]);

  async function sair() {
    await logout();
    router.replace("/");
  }

  /** Botão "Mensagem" (C3): abre/cria a DM respeitando a privacidade do alvo. */
  async function abrirDM() {
    if (dmPendente) return;
    setDmPendente(true);
    setDmErro(null);
    try {
      const r = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error ?? "Não foi possível abrir a conversa.");
      abrirConversa(d.id as string);
    } catch (e) {
      setDmErro(e instanceof Error ? e.message : "Não foi possível abrir a conversa.");
    } finally {
      setDmPendente(false);
    }
  }

  async function toggleSeguir() {
    if (pendente) return;
    setPendente(true);
    setSeguindo((v) => !v); // otimista
    try {
      await fetch(`/api/users/${user.handle}/follow`, { method: "POST" });
      router.refresh(); // atualiza contadores no servidor
    } catch {
      setSeguindo((v) => !v); // reverte em erro
    } finally {
      setPendente(false);
    }
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    event.currentTarget.value = "";

    setUploadError(null);
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData?.error || "Falha no upload de imagem.");
      }

      const updateRes = await fetch("/api/users/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagemUrl: uploadData.url }),
      });
      
      const updateData = await updateRes.json();
      if (!updateRes.ok) {
        throw new Error(updateData?.error || "Falha ao salvar foto de perfil.");
      }

      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao fazer upload da foto.";
      setUploadError(msg);
      console.error("Avatar upload error:", error);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleAvatarRemove() {
    if (!user.imagemUrl) return;
    setRemovingAvatar(true);
    try {
      const res = await fetch("/api/users/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagemUrl: null }),
      });
      if (!res.ok) throw new Error("Falha ao remover foto de perfil.");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingAvatar(false);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  return (
    <div className="pb-6">
      {/* Banner full-bleed */}
      <div className="relative">
        {user.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.bannerUrl}
            alt={`Capa de ${user.nome}`}
            className="h-36 w-full object-cover sm:h-44"
          />
        ) : (
          <div className="h-36 w-full bg-brand sm:h-44" aria-hidden="true" />
        )}

        {isMe && (
          <div className="absolute right-3 top-3">
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur transition-colors hover:bg-black/30"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
        {isMe && (
          <ProfileMenu
            open={menuAberto}
            onClose={() => setMenuAberto(false)}
            onLogout={sair}
          />
        )}

        <div className="absolute -bottom-10 left-4">
          <div className="relative">
            <Avatar
              src={user.imagemUrl}
              alt={`Foto de perfil de ${user.nome}`}
              iniciais={user.iniciais}
              cor={user.cor}
              size="xl"
              className="ring-4 ring-bg"
            />
            {isMe && (
              <div className="absolute -right-1 -bottom-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={uploadingAvatar || removingAvatar}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/80"
                  aria-label="Trocar foto de perfil"
                >
                  <Camera className="h-5 w-5" aria-hidden="true" />
                </button>
                {user.imagemUrl && (
                  <button
                    type="button"
                    onClick={handleAvatarRemove}
                    disabled={uploadingAvatar || removingAvatar}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/80"
                    aria-label="Remover foto de perfil"
                  >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="px-4 pt-12">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold">{user.nome}</h1>
            {user.criador && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber px-2 py-0.5 text-xs font-semibold text-white">
                <Crown className="h-3 w-3" aria-hidden="true" />
                Criador
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-text-2">
            @{user.handle}
            {user.cidade && <> · {user.cidade}</>}
          </p>
          {user.bio && (
            <p className="mt-2 text-sm leading-relaxed">{user.bio}</p>
          )}
        </div>

        <div className="px-4 pt-4">
          <StatRow stats={user.stats} />
        </div>


        <div className="flex gap-3 px-4 pt-4">
          {isMe ? (
            <Button
              className="flex-1"
              onClick={() => router.push("/perfil/editar")}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Editar perfil
            </Button>
          ) : (
            <>
              <Button
                variant={seguindo ? "secondary" : "primary"}
                className="flex-1"
                onClick={toggleSeguir}
                disabled={pendente}
              >
                {seguindo ? (
                  <>
                    <UserCheck className="h-4 w-4" aria-hidden="true" />
                    Seguindo
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    Seguir
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                aria-label="Mensagem"
                onClick={abrirDM}
                disabled={dmPendente}
              >
                {dmPendente ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </>
          )}
        </div>
        {dmErro && (
          <p role="alert" className="px-4 pt-2 text-sm text-red-600 dark:text-red-400">
            {dmErro}
          </p>
        )}

        <div
          role="tablist"
          aria-label="Conteúdo do perfil"
          className="mt-5 flex border-b border-border px-2"
        >
          {tabs.map((t) => {
            const ativo = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={ativo}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex-1 px-3 py-3 text-sm font-medium transition-colors",
                  ativo ? "text-brand" : "text-text-2 hover:text-text",
                )}
              >
                {t.label}
                {ativo && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand" />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3">
          {tab === "publicacoes" && (
            <div className="space-y-3">
              {postsState.length > 0 ? (
                postsState.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    onDeleted={(id) =>
                      setPostsState((ps) => ps.filter((x) => x.id !== id))
                    }
                  />
                ))
              ) : (
                <EmptyState texto="Nenhuma publicação ainda." />
              )}
            </div>
          )}

          {/* FISGADOS (item 4): Maior/Mais Pesado/Último + 6 mais raros +
              Ver mais/Ver todos → catálogo. */}
          {tab === "fisgados" && (
            <FisgadosTab
              entries={entries}
              locked={locked}
              capturadas={capturadas}
              total={total}
              isMe={isMe}
            />
          )}

          {/* INSÍGNIAS (item 5): só conquistas + progresso da coleção. */}
          {tab === "insignias" && (
            <div className="space-y-4">
              <BadgeRow badges={badges} />
              <ProgressoColecao capturadas={capturadas} total={total} />
            </div>
          )}

          {tab === "conjunto" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Conjuntos de pesca</h2>
                  <p className="mt-1 text-sm text-text-2">
                    Organize até 6 conjuntos com os equipamentos usados nas suas saídas.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setEditingConjunto(true);
                    setConjuntoErro(null);
                    setNovoNomeConjunto("");
                    setNovoItens([]);
                  }}
                  disabled={conjuntos.length >= 6}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Adicionar conjunto
                </Button>
              </div>

              {editingConjunto && (
                <Card className="space-y-4 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Novo conjunto</p>
                      <p className="text-sm text-text-2">
                        Escolha o nome e selecione os equipamentos.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingConjunto(false)}
                      className="text-sm font-medium text-text-2 hover:text-text"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-text">
                      Nome do conjunto
                      <input
                        value={novoNomeConjunto}
                        onChange={(event) => setNovoNomeConjunto(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm text-text outline-none transition-colors focus:border-brand"
                        placeholder="Ex.: Tarde no lago"
                      />
                    </label>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-text">Equipamentos</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {equipamentoOptions.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setNovoItens((current) =>
                                current.includes(item)
                                  ? current.filter((i) => i !== item)
                                  : [...current, item],
                              );
                            }}
                            className={cn(
                              "rounded-2xl border px-3 py-2 text-left text-sm transition-colors",
                              novoItens.includes(item)
                                ? "border-brand bg-brand/10 text-text"
                                : "border-border bg-bg text-text-2 hover:border-brand",
                            )}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {conjuntoErro && (
                    <p className="text-sm text-red-600">{conjuntoErro}</p>
                  )}

                  <Button
                    onClick={() => {
                      if (!novoNomeConjunto.trim()) {
                        setConjuntoErro("Digite um nome para o conjunto.");
                        return;
                      }
                      if (novoItens.length === 0) {
                        setConjuntoErro("Selecione ao menos um equipamento.");
                        return;
                      }
                      setConjuntos((current) => [
                        ...current,
                        {
                          id: crypto.randomUUID(),
                          nome: novoNomeConjunto.trim(),
                          itens: novoItens,
                        },
                      ]);
                      setEditingConjunto(false);
                    }}
                  >
                    Salvar conjunto
                  </Button>
                </Card>
              )}

              {conjuntos.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {conjuntos.map((conjunto) => (
                    <Card key={conjunto.id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold">{conjunto.nome}</p>
                          <p className="text-sm text-text-2">
                            {conjunto.itens.length} itens
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setConjuntos((current) =>
                              current.filter((item) => item.id !== conjunto.id),
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-text-2 hover:bg-surface"
                          aria-label="Remover conjunto"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {conjunto.itens.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-surface-2 px-3 py-1 text-xs text-text-2"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState texto="Nenhum conjunto criado ainda. Use o botão acima para começar." />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ texto }: { texto: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-text-2">
      {texto}
    </div>
  );
}

