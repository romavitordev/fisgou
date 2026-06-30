/**
 * Paletas de cor de destaque escolhíveis pelo usuário. Cada uma define a
 * cor da marca (--brand) para tema claro e escuro; brand-fg fica branco e
 * brand-soft é derivado via color-mix. "teal" é o padrão do globals.css.
 *
 * ATENÇÃO à regra do âmbar: nenhuma paleta usa tom âmbar/dourado, que fica
 * reservado a lendário/Criador/Recordista.
 */
export const ACCENTS = {
  teal: { nome: "Teal", light: "#14916B", dark: "#2DB98B" },
  oceano: { nome: "Oceano", light: "#2D7DD2", dark: "#4F9FE0" },
  ametista: { nome: "Ametista", light: "#7C5CD6", dark: "#9B82E0" },
  coral: { nome: "Coral", light: "#E0556E", dark: "#F07A90" },
  floresta: { nome: "Floresta", light: "#2F8F4E", dark: "#46B36A" },
  grafite: { nome: "Grafite", light: "#4B5A66", dark: "#7E909C" },
} as const;

export type AccentKey = keyof typeof ACCENTS;

export const ACCENT_KEYS = Object.keys(ACCENTS) as AccentKey[];
export const DEFAULT_ACCENT: AccentKey = "teal";

export function isAccentKey(v: unknown): v is AccentKey {
  return typeof v === "string" && v in ACCENTS;
}
