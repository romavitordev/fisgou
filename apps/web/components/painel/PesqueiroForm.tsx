"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { pesqueiroTipoLabel } from "@/lib/rarity";
import { PESQUEIRO_TIPOS } from "@/lib/pesqueiro-input";
import type { Pesqueiro, PesqueiroTipo } from "@fisgou/shared";

/** Paleta de cores da capa (thumb) do pesqueiro. */
const CORES = ["#14916B", "#2563EB", "#7C3AED", "#DB2777", "#EA580C", "#0891B2"];

export function PesqueiroForm({
  pesqueiro,
  onSaved,
  onCancel,
}: {
  pesqueiro?: Pesqueiro;
  onSaved: (p: Pesqueiro) => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const editando = !!pesqueiro;

  const [nome, setNome] = useState(pesqueiro?.nome ?? "");
  const [tipo, setTipo] = useState<PesqueiroTipo>(pesqueiro?.tipo ?? "pesque-pague");
  const [cidade, setCidade] = useState(pesqueiro?.cidade ?? "");
  const [endereco, setEndereco] = useState(pesqueiro?.endereco ?? "");
  const [descricao, setDescricao] = useState(pesqueiro?.descricao ?? "");
  const [cor, setCor] = useState(pesqueiro?.cor ?? CORES[0]);
  const [lat, setLat] = useState(pesqueiro?.lat != null ? String(pesqueiro.lat) : "");
  const [lng, setLng] = useState(pesqueiro?.lng != null ? String(pesqueiro.lng) : "");

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      setErro("Seu navegador não suporta geolocalização.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
      },
      () => setErro("Não foi possível obter sua localização."),
    );
  }

  async function salvar() {
    if (salvando) return;
    if (nome.trim().length < 2) {
      setErro("Informe o nome do pesqueiro.");
      return;
    }
    setErro(null);
    setSalvando(true);

    const payload = {
      nome,
      tipo,
      cidade,
      endereco,
      descricao,
      cor,
      lat: lat.trim() === "" ? null : Number(lat),
      lng: lng.trim() === "" ? null : Number(lng),
    };

    try {
      const res = await fetch(
        editando ? `/api/pesqueiros/${pesqueiro!.id}` : "/api/pesqueiros",
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Não foi possível salvar.");
      onSaved(data.pesqueiro as Pesqueiro);
      router.refresh();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível salvar.");
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-5">
      {erro && (
        <p
          role="alert"
          className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
        >
          {erro}
        </p>
      )}

      <Campo label="Nome do pesqueiro">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="campo"
          placeholder="Ex.: Pesqueiro Recanto do Lago"
          maxLength={80}
        />
      </Campo>

      {/* Tipo */}
      <div>
        <p className="mb-1.5 text-sm font-medium">Tipo</p>
        <div className="flex flex-wrap gap-2">
          {PESQUEIRO_TIPOS.map((t) => {
            const ativo = tipo === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                aria-pressed={ativo}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                  ativo
                    ? "bg-brand text-brand-fg"
                    : "border border-border bg-surface text-text-2 hover:bg-surface-2 hover:text-text",
                )}
              >
                {pesqueiroTipoLabel[t]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Cidade">
          <input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="campo"
            placeholder="Cidade, UF"
          />
        </Campo>
        <Campo label="Endereço">
          <input
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="campo"
            placeholder="Rua, nº, referência"
          />
        </Campo>
      </div>

      <Campo label="Descrição">
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          maxLength={600}
          className="campo resize-none"
          placeholder="Espécies disponíveis, estrutura, horários, valores…"
        />
      </Campo>

      {/* Cor da capa */}
      <div>
        <p className="mb-2 text-sm font-medium">Cor da capa</p>
        <div className="flex flex-wrap gap-3">
          {CORES.map((c) => {
            const ativo = cor.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCor(c)}
                aria-pressed={ativo}
                aria-label={`Cor ${c}`}
                className={cn(
                  "h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-bg transition-transform hover:scale-110",
                  ativo ? "ring-text" : "ring-transparent",
                )}
                style={{ backgroundColor: c }}
              />
            );
          })}
        </div>
      </div>

      {/* Localização no mapa */}
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="text-sm font-medium">Localização no mapa (opcional)</p>
          <button
            type="button"
            onClick={usarMinhaLocalizacao}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Usar minha localização
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="campo"
            placeholder="Latitude"
            inputMode="decimal"
          />
          <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="campo"
            placeholder="Longitude"
            inputMode="decimal"
          />
        </div>
        <p className="mt-1.5 text-xs text-text-2">
          Ajuda pescadores a te encontrarem pelo mapa e pelo filtro “perto de mim”.
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={salvando}>
            Cancelar
          </Button>
        )}
        <Button onClick={salvar} disabled={salvando}>
          {salvando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {editando ? "Salvar alterações" : "Cadastrar pesqueiro"}
        </Button>
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
