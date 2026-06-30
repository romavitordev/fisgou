"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { FishLoader } from "@/components/ui/FishLoader";
import type { ReactNode } from "react";

/**
 * Protege as rotas do app. Sem sessão → manda pro /login.
 * Client-side de propósito (compatível com export estático). Mostra um
 * estado de carregamento enquanto resolve a sessão pra evitar flicker.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <FishLoader />;
  }

  return <>{children}</>;
}
