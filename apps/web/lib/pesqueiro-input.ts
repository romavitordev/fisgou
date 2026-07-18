import type { Prisma } from "@prisma/client";
import type { PesqueiroTipo } from "@fisgou/shared";

/** Tipos válidos de pesqueiro (espelha PesqueiroTipo de @fisgou/shared). */
export const PESQUEIRO_TIPOS: PesqueiroTipo[] = [
  "pesque-pague",
  "represa",
  "rio",
  "lago",
  "praia",
];

const HEX = /^#[0-9a-fA-F]{6}$/;
const COR_PADRAO = "#14916B";

export type PesqueiroParseResult =
  | { ok: true; data: Prisma.PesqueiroUncheckedCreateInput }
  | { ok: true; data: Prisma.PesqueiroUpdateInput; partial: true }
  | { ok: false; error: string };

/**
 * Valida/normaliza os campos editáveis de um pesqueiro pelo vendedor.
 * `partial=true` (PATCH) só toca nos campos presentes; caso contrário
 * (POST) exige nome e tipo e preenche os contadores iniciais.
 */
export function parsePesqueiroInput(
  body: Record<string, unknown>,
  { partial = false }: { partial?: boolean } = {},
): PesqueiroParseResult {
  const data: Record<string, unknown> = {};

  // Nome
  if (!partial || "nome" in body) {
    const nome = typeof body.nome === "string" ? body.nome.trim() : "";
    if (nome.length < 2)
      return { ok: false, error: "Informe o nome do pesqueiro (mín. 2 caracteres)." };
    if (nome.length > 80)
      return { ok: false, error: "Nome muito longo (máx. 80 caracteres)." };
    data.nome = nome;
  }

  // Tipo
  if (!partial || "tipo" in body) {
    const tipo = body.tipo;
    if (typeof tipo !== "string" || !PESQUEIRO_TIPOS.includes(tipo as PesqueiroTipo))
      return { ok: false, error: "Selecione um tipo de pesqueiro válido." };
    data.tipo = tipo;
  }

  // Cidade / endereço / descrição (opcionais)
  if ("cidade" in body) {
    const v = typeof body.cidade === "string" ? body.cidade.trim() : "";
    data.cidade = v || null;
  }
  if ("endereco" in body) {
    const v = typeof body.endereco === "string" ? body.endereco.trim() : "";
    data.endereco = v || null;
  }
  if ("descricao" in body) {
    const v = typeof body.descricao === "string" ? body.descricao.trim() : "";
    if (v.length > 600)
      return { ok: false, error: "Descrição muito longa (máx. 600 caracteres)." };
    data.descricao = v || null;
  }

  // Cor (hex #RRGGBB)
  if (!partial || "cor" in body) {
    const cor = typeof body.cor === "string" ? body.cor : "";
    if (cor && !HEX.test(cor))
      return { ok: false, error: "Cor inválida." };
    if (cor) data.cor = cor;
    else if (!partial) data.cor = COR_PADRAO;
  }

  // Coordenadas (opcionais; par válido)
  for (const key of ["lat", "lng"] as const) {
    if (key in body) {
      const raw = body[key];
      if (raw === null || raw === "") {
        data[key] = null;
        continue;
      }
      const n = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isFinite(n)) return { ok: false, error: "Coordenada inválida." };
      if (key === "lat" && (n < -90 || n > 90))
        return { ok: false, error: "Latitude fora do intervalo." };
      if (key === "lng" && (n < -180 || n > 180))
        return { ok: false, error: "Longitude fora do intervalo." };
      data[key] = n;
    }
  }

  if (partial) {
    if (Object.keys(data).length === 0)
      return { ok: false, error: "Nada para atualizar." };
    return { ok: true, data: data as Prisma.PesqueiroUpdateInput, partial: true };
  }

  // Contadores iniciais (um pesqueiro novo nasce sem avaliações/distância).
  return {
    ok: true,
    data: {
      ...(data as Prisma.PesqueiroUncheckedCreateInput),
      nota: 0,
      avaliacoes: 0,
      distanciaKm: 0,
    },
  };
}
