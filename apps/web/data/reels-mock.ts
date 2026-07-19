/**
 * Mock dos vídeos curtos (Reels) — E1 da rodada 2. Enquanto não há
 * upload/streaming de vídeo real, cada reel é um "player" visual com
 * gradiente + dados de autor/legenda/som. Trocar por model Prisma
 * (Reel + mídia real) quando o pipeline de vídeo existir.
 */

export interface ReelMock {
  id: string;
  autor: { nome: string; handle: string; cor: string; iniciais: string };
  legenda: string;
  /** Nome do áudio exibido no rodapé (estilo TikTok). */
  som: string;
  /** Gradiente de fundo do player fake. */
  gradiente: string;
  /** Emoji-cena central (placeholder do vídeo). */
  cena: string;
  duracaoS: number;
  curtidas: number;
  comentarios: number;
  compartilhamentos: number;
}

export const reelsMock: ReelMock[] = [
  {
    id: "r1",
    autor: { nome: "Marina Tavares", handle: "marina.pesca", cor: "#14916B", iniciais: "MT" },
    legenda: "POV: o tucunaré bateu na primeira arremessada 🎣🔥 #pescaesportiva",
    som: "som original — marina.pesca",
    gradiente: "linear-gradient(160deg, #0b3d33 0%, #14916B 55%, #7fd0b2 120%)",
    cena: "🎣",
    duracaoS: 14,
    curtidas: 12400,
    comentarios: 318,
    compartilhamentos: 96,
  },
  {
    id: "r2",
    autor: { nome: "Rafael Lima", handle: "rafa.fisgou", cor: "#2563EB", iniciais: "RL" },
    legenda: "Amanhecer na represa. Nenhum peixe, zero arrependimento. 🌅",
    som: "Sons da natureza — Represa ao vivo",
    gradiente: "linear-gradient(165deg, #0c2d5e 0%, #2563EB 50%, #f6b46b 115%)",
    cena: "🌅",
    duracaoS: 21,
    curtidas: 8900,
    comentarios: 154,
    compartilhamentos: 61,
  },
  {
    id: "r3",
    autor: { nome: "Bia Nogueira", handle: "bia.iscaviva", cor: "#7C3AED", iniciais: "BN" },
    legenda: "3 nós que todo pescador PRECISA saber (o último salva sua vara) 🪢",
    som: "tutorial rápido — bia.iscaviva",
    gradiente: "linear-gradient(150deg, #3b1470 0%, #7C3AED 55%, #d8b4fe 120%)",
    cena: "🪢",
    duracaoS: 32,
    curtidas: 23100,
    comentarios: 742,
    compartilhamentos: 401,
  },
  {
    id: "r4",
    autor: { nome: "Caio Mendes", handle: "caio.varadura", cor: "#EA580C", iniciais: "CM" },
    legenda: "Testei a isca de R$ 4 contra a de R$ 90. Resultado me surpreendeu…",
    som: "som original — caio.varadura",
    gradiente: "linear-gradient(155deg, #7c2d12 0%, #EA580C 55%, #fcd34d 120%)",
    cena: "🐟",
    duracaoS: 27,
    curtidas: 15700,
    comentarios: 989,
    compartilhamentos: 233,
  },
  {
    id: "r5",
    autor: { nome: "Zé da Pesca", handle: "zedapesca", cor: "#0891B2", iniciais: "ZP" },
    legenda: "Pesqueiro novo em São Carlos — olha o tamanho dessa represa! 😱",
    som: "trending — Baião de Dois (remix)",
    gradiente: "linear-gradient(170deg, #083344 0%, #0891B2 50%, #a5f3fc 118%)",
    cena: "🚤",
    duracaoS: 18,
    curtidas: 5400,
    comentarios: 87,
    compartilhamentos: 45,
  },
  {
    id: "r6",
    autor: { nome: "Marina Tavares", handle: "marina.pesca", cor: "#14916B", iniciais: "MT" },
    legenda: "Solta o peixe certo do jeito certo 🌿 pesca com soltura é o futuro",
    som: "voz — como soltar sem machucar",
    gradiente: "linear-gradient(160deg, #052e1c 0%, #166534 55%, #86efac 120%)",
    cena: "🌿",
    duracaoS: 24,
    curtidas: 31800,
    comentarios: 1204,
    compartilhamentos: 890,
  },
];
