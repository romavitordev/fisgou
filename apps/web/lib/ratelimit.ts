/**
 * Rate limit em memória para rotas de autenticação:
 * 5 tentativas por IP a cada 15 minutos (por escopo: login/signup).
 *
 * Mesmo padrão do Buganza — suficiente para instância única (em
 * serverless a memória reinicia com frequência, mas ainda barra
 * força bruta simples). Para escala horizontal, trocar por Redis.
 */

const JANELA_MS = 15 * 60 * 1000;
const MAX_TENTATIVAS = 5;

interface Registro {
  tentativas: number;
  inicioJanela: number;
}

const registros = new Map<string, Registro>();

export interface RateLimitResult {
  permitido: boolean;
  restantes: number;
  liberaEmSegundos: number;
}

/** `escopo` separa contadores (ex.: "login" e "signup" não se somam). */
export function verificarRateLimit(escopo: string, ip: string): RateLimitResult {
  const chave = `${escopo}:${ip}`;
  const agora = Date.now();
  const registro = registros.get(chave);

  // Limpeza oportunista de registros expirados
  if (registros.size > 1000) {
    Array.from(registros.entries()).forEach(([k, v]) => {
      if (agora - v.inicioJanela > JANELA_MS) registros.delete(k);
    });
  }

  if (!registro || agora - registro.inicioJanela > JANELA_MS) {
    registros.set(chave, { tentativas: 1, inicioJanela: agora });
    return { permitido: true, restantes: MAX_TENTATIVAS - 1, liberaEmSegundos: 0 };
  }

  registro.tentativas++;

  if (registro.tentativas > MAX_TENTATIVAS) {
    const liberaEm = Math.ceil((registro.inicioJanela + JANELA_MS - agora) / 1000);
    return { permitido: false, restantes: 0, liberaEmSegundos: liberaEm };
  }

  return {
    permitido: true,
    restantes: MAX_TENTATIVAS - registro.tentativas,
    liberaEmSegundos: 0,
  };
}

/** Zera o contador de um IP após sucesso (não pune quem errou e acertou). */
export function limparRateLimit(escopo: string, ip: string): void {
  registros.delete(`${escopo}:${ip}`);
}

export function ipDaRequisicao(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "ip-desconhecido";
}
