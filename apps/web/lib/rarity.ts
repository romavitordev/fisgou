import type {
  Rarity,
  CatchStatus,
  PesqueiroTipo,
  WaterType,
  LocationPrivacy,
} from "@fisgou/shared";

// ── Raridade ────────────────────────────────────────────────────────
export const rarityLabel: Record<Rarity, string> = {
  comum: "comum",
  incomum: "incomum",
  raro: "raro",
  lendario: "lendário",
};

/**
 * Cor (hex) do ponto/realce de cada raridade.
 * "lendario" usa a cor âmbar do tema — única raridade que muda por tema,
 * por isso resolvemos via CSS var. As demais são fixas.
 *
 * REGRA DO ÂMBAR: âmbar só aparece em lendário, selo "Criador" e
 * insígnia "Recordista". Nada mais.
 */
export const rarityColor: Record<Rarity, string> = {
  comum: "#9AA0A6",
  incomum: "#2D7DD2",
  raro: "#7C5CD6",
  lendario: "var(--amber)",
};

// ── Status de verificação da captura ────────────────────────────────
export const statusLabel: Record<CatchStatus, string> = {
  nao_verificado: "não verificado",
  em_analise: "em análise",
  verificado: "verificado",
};

// ── Tipo de pesqueiro ───────────────────────────────────────────────
export const pesqueiroTipoLabel: Record<PesqueiroTipo, string> = {
  "pesque-pague": "pesque-pague",
  represa: "represa",
  rio: "rio",
  lago: "lago",
  praia: "praia",
};

// ── Tipo de água ────────────────────────────────────────────────────
export const waterLabel: Record<WaterType, string> = {
  doce: "água doce",
  salgada: "água salgada",
};

// ── Privacidade da localização ──────────────────────────────────────
export const privacyLabel: Record<LocationPrivacy, string> = {
  exato: "Exato",
  aproximado: "Aproximado",
  oculto: "Oculto",
};

export const privacyHint: Record<LocationPrivacy, string> = {
  exato: "Mostra o ponto exato no mapa",
  aproximado: "Raio de ~2 km, sem o ponto",
  oculto: "Não compartilha localização",
};
