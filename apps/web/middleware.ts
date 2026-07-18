import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Anti-CSRF nas mutações da API (defesa em profundidade — o cookie de
 * sessão já é SameSite=Lax): navegador manda `Origin` em POST/PUT/
 * PATCH/DELETE; se vier de outro site, bloqueia. Requisições sem Origin
 * (curl, apps nativos) passam — elas não carregam o cookie sozinhas.
 */
const MUTANTES = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function middleware(req: NextRequest) {
  if (!MUTANTES.has(req.method)) return NextResponse.next();

  const origin = req.headers.get("origin");
  if (!origin) return NextResponse.next();

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    if (new URL(origin).host === host) return NextResponse.next();
  } catch {
    // Origin malformado cai no bloqueio abaixo.
  }
  return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
}

export const config = { matcher: "/api/:path*" };
