/** @type {import('next').NextConfig} */

const ehDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy — a defesa mais forte contra XSS: diz ao
 * navegador de onde ele PODE carregar cada tipo de recurso.
 *
 * Notas do que o app usa:
 *  - script/style inline: Next injeta scripts de hidratação → 'unsafe-inline'.
 *    Em dev, o HMR usa eval → 'unsafe-eval' só fora de produção.
 *  - Google Maps JS API (pesqueiros): script + XHR de maps.googleapis.com /
 *    maps.gstatic.com; tiles/ícones em img https:; a lib injeta a fonte
 *    Roboto via fonts.googleapis.com (css) + fonts.gstatic.com.
 *  - imagens: uploads locais (same-origin), preview de foto em blob:
 *    (URL.createObjectURL no Criar), avatares data:.
 *  - fontes: next/font self-hospeda a Manrope → font-src 'self' (+ gstatic
 *    p/ o Maps).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${ehDev ? " 'unsafe-eval'" : ""} https://maps.googleapis.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Clickjacking: frame-ancestors (acima) é o moderno; X-Frame-Options
  // cobre navegadores antigos.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desliga APIs sensíveis que o app não usa. geolocation fica em (self)
  // porque o filtro de pesqueiros por raio (TODO) vai precisar dela.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  // HSTS: força HTTPS. Navegadores ignoram em http/localhost, então é
  // seguro deixar ligado sempre; vale de verdade em produção.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Importa @fisgou/shared direto como TS (sem build no pacote).
  transpilePackages: ["@fisgou/shared"],
  experimental: {
    // Node 24 + Next 14: o worker de geração estática crasha com
    // "Zone Allocation failed". Rodar em processo único evita o crash.
    workerThreads: false,
    cpus: 1,
    // Não empacotar Prisma/bcrypt no bundle dos server components.
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  async headers() {
    return [
      {
        // Aplica a todas as rotas.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
