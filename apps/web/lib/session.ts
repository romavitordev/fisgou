import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

// Sessão por cookie httpOnly assinado (JWT via jose). Só servidor.
const COOKIE = "fisgou_token";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-fisgou-secret-troque-em-producao-please",
);

export async function createSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function destroySession() {
  cookies().delete(COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return (payload.uid as string) ?? null;
  } catch {
    return null;
  }
}

/** Usuário logado (registro do Prisma) ou null. */
export async function getCurrentDbUser() {
  const uid = await getSessionUserId();
  if (!uid) return null;
  return prisma.user.findUnique({ where: { id: uid } });
}
