"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth";
import { ACCENTS, isAccentKey, DEFAULT_ACCENT } from "@/lib/accent";

/**
 * Aplica a cor de destaque escolhida pelo usuário sobrescrevendo as CSS
 * vars --brand/--brand-soft/--brand-fg no <html>, conforme o tema atual.
 * "teal" (padrão) remove as overrides e usa o globals.css.
 */
export function AccentApplier() {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const accent = user?.accent;

  useEffect(() => {
    const root = document.documentElement;
    const reset = () => {
      root.style.removeProperty("--brand");
      root.style.removeProperty("--brand-soft");
      root.style.removeProperty("--brand-fg");
    };

    if (!isAccentKey(accent) || accent === DEFAULT_ACCENT) {
      reset();
      return;
    }

    const brand = ACCENTS[accent][resolvedTheme === "dark" ? "dark" : "light"];
    root.style.setProperty("--brand", brand);
    root.style.setProperty("--brand-fg", "#ffffff");
    root.style.setProperty(
      "--brand-soft",
      `color-mix(in srgb, ${brand} 16%, var(--surface))`,
    );

    return reset;
  }, [accent, resolvedTheme]);

  return null;
}
