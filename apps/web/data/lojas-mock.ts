/**
 * Mock do marketplace de lojas parceiras (E2 da rodada 2). Tudo estático
 * por enquanto: sem checkout, sem estoque, sem chat real com a loja.
 * Trocar por models Prisma (Loja + Produto + vínculo com User vendedor)
 * quando o marketplace virar funcionalidade real.
 */

export interface ProdutoMock {
  id: string;
  nome: string;
  preco: number;
  /** Preço antigo (riscado) quando em promoção. */
  precoAntigo?: number;
  cor: string;
  emoji: string;
  destaque?: boolean;
}

export interface LojaMock {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  cor: string;
  iniciais: string;
  cidade: string;
  nota: number;
  avaliacoes: number;
  produtos: ProdutoMock[];
}

export const lojasMock: LojaMock[] = [
  {
    id: "iscaviva",
    nome: "Isca Viva Pesca",
    categoria: "Iscas",
    descricao:
      "Iscas vivas e artificiais selecionadas. Entrega na porta do pesqueiro na região de São Carlos.",
    cor: "#14916B",
    iniciais: "IV",
    cidade: "São Carlos, SP",
    nota: 4.8,
    avaliacoes: 312,
    produtos: [
      { id: "p1", nome: "Kit 50 minhocuçu", preco: 24.9, cor: "#7a4a21", emoji: "🪱", destaque: true },
      { id: "p2", nome: "Isca artificial Popper 9cm", preco: 39.9, precoAntigo: 54.9, cor: "#c2410c", emoji: "🐠", destaque: true },
      { id: "p3", nome: "Massa pronta tilápia 500g", preco: 12.5, cor: "#a16207", emoji: "🥣" },
      { id: "p4", nome: "Lambari vivo (dúzia)", preco: 18.0, cor: "#0e7490", emoji: "🐟" },
    ],
  },
  {
    id: "varadura",
    nome: "Vara Dura Equipamentos",
    categoria: "Varas e molinetes",
    descricao:
      "Varas, molinetes e carretilhas das melhores marcas, com manutenção autorizada.",
    cor: "#2563EB",
    iniciais: "VD",
    cidade: "Itirapina, SP",
    nota: 4.6,
    avaliacoes: 189,
    produtos: [
      { id: "p1", nome: "Vara telescópica 2,7m", preco: 159.9, precoAntigo: 199.9, cor: "#1e3a8a", emoji: "🎣", destaque: true },
      { id: "p2", nome: "Carretilha perfil baixo", preco: 289.0, cor: "#334155", emoji: "⚙️" },
      { id: "p3", nome: "Molinete 4 rolamentos", preco: 129.9, cor: "#0f766e", emoji: "🌀", destaque: true },
      { id: "p4", nome: "Kit linha monofilamento", preco: 34.9, cor: "#4d7c0f", emoji: "🧵" },
    ],
  },
  {
    id: "nautica-ze",
    nome: "Náutica do Zé",
    categoria: "Náutica",
    descricao:
      "Caiaques, coletes e acessórios náuticos para pesca embarcada. Test-drive no lago aos sábados.",
    cor: "#0891B2",
    iniciais: "NZ",
    cidade: "Brotas, SP",
    nota: 4.9,
    avaliacoes: 97,
    produtos: [
      { id: "p1", nome: "Caiaque de pesca c/ pedal", preco: 4890.0, cor: "#155e75", emoji: "🛶", destaque: true },
      { id: "p2", nome: "Colete salva-vidas GG", preco: 119.9, cor: "#ca8a04", emoji: "🦺" },
      { id: "p3", nome: "Âncora dobrável 1,5kg", preco: 79.9, cor: "#475569", emoji: "⚓" },
      { id: "p4", nome: "Suporte de vara p/ caiaque", preco: 59.9, precoAntigo: 74.9, cor: "#065f46", emoji: "🔩" },
    ],
  },
  {
    id: "camping-carpa",
    nome: "Camping da Carpa",
    categoria: "Camping e outdoor",
    descricao:
      "Tudo para acampar na beira do rio: barracas, cadeiras, geladeiras térmicas e iluminação.",
    cor: "#EA580C",
    iniciais: "CC",
    cidade: "Analândia, SP",
    nota: 4.5,
    avaliacoes: 143,
    produtos: [
      { id: "p1", nome: "Cadeira de pesca reclinável", preco: 189.9, cor: "#7c2d12", emoji: "🪑", destaque: true },
      { id: "p2", nome: "Cooler térmico 32L", preco: 249.9, precoAntigo: 299.9, cor: "#0369a1", emoji: "🧊" },
      { id: "p3", nome: "Lanterna de cabeça LED", preco: 45.0, cor: "#3f3f46", emoji: "🔦" },
      { id: "p4", nome: "Barraca 3 pessoas", preco: 399.0, cor: "#166534", emoji: "⛺", destaque: true },
    ],
  },
  {
    id: "emporio-pescador",
    nome: "Empório do Pescador",
    categoria: "Acessórios",
    descricao:
      "Anzóis, chumbadas, alicates, boias e miudezas que salvam qualquer pescaria.",
    cor: "#7C3AED",
    iniciais: "EP",
    cidade: "São Carlos, SP",
    nota: 4.7,
    avaliacoes: 256,
    produtos: [
      { id: "p1", nome: "Caixa organizadora 20 divisórias", preco: 49.9, cor: "#5b21b6", emoji: "🧰", destaque: true },
      { id: "p2", nome: "Alicate multifunção inox", preco: 69.9, cor: "#52525b", emoji: "🛠️" },
      { id: "p3", nome: "Kit 100 anzóis sortidos", preco: 29.9, precoAntigo: 39.9, cor: "#9f1239", emoji: "🪝" },
      { id: "p4", nome: "Boia luminosa (par)", preco: 19.9, cor: "#0e7490", emoji: "🎈" },
    ],
  },
];

/** Categorias distintas (para os chips de filtro na vitrine). */
export const lojaCategorias = Array.from(
  new Set(lojasMock.map((l) => l.categoria)),
);

/** Produtos em destaque de todas as lojas (carrossel "Ofertas"). */
export const produtosDestaque = lojasMock.flatMap((loja) =>
  loja.produtos
    .filter((p) => p.destaque)
    .map((p) => ({ ...p, lojaId: loja.id, lojaNome: loja.nome, lojaCor: loja.cor })),
);

export function getLoja(id: string): LojaMock | undefined {
  return lojasMock.find((l) => l.id === id);
}

/** Formata em BRL: 39.9 → "R$ 39,90". */
export function precoBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
