/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;
