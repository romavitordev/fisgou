/** Tempo relativo curto em pt-BR (ex.: "há 2 h", "há 3 d"). */
export function tempoRelativo(iso: string, agora: Date = new Date()): string {
  const data = new Date(iso);
  const diffMs = agora.getTime() - data.getTime();
  const min = Math.round(diffMs / 60000);

  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;

  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;

  const d = Math.round(h / 24);
  if (d < 7) return `há ${d} d`;

  const sem = Math.round(d / 7);
  if (sem < 5) return `há ${sem} sem`;

  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

/** Formata nota com 1 casa em pt-BR (4.7 -> "4,7"). */
export function formatNota(nota: number): string {
  return nota.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
