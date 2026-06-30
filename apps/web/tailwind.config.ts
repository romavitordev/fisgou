import type { Config } from "tailwindcss";

/**
 * Tokens vêm de CSS vars (globals.css) para suportar troca de tema
 * via next-themes (darkMode: "class"). Cores de raridade são FIXAS
 * (não mudam por tema) e ficam aqui como valores literais.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        text: "var(--text)",
        "text-2": "var(--text-2)",
        border: "var(--border)",
        brand: "var(--brand)",
        "brand-fg": "var(--brand-fg)",
        "brand-soft": "var(--brand-soft)",
        amber: "var(--amber)",
        "amber-soft": "var(--amber-soft)",
        // Raridade — fixa em ambos os temas.
        rarity: {
          comum: "#9AA0A6",
          incomum: "#2D7DD2",
          raro: "#7C5CD6",
          // lendário usa a cor âmbar do tema.
        },
      },
      maxWidth: {
        app: "480px",
      },
      borderRadius: {
        DEFAULT: "12px",
        lg: "14px",
        xl: "16px",
        "2xl": "18px",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
