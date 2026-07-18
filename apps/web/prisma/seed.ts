/**
 * Seed com dois modos:
 * - demo: cria conteúdo de exemplo para explorar o app
 * - empty: deixa o banco limpo para mostrar apenas conteúdo criado pelo usuário
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  users,
  currentUser,
  species,
  collection,
  posts,
  comments,
  notifications,
  pesqueiros,
  badges,
  followingHandles,
} from "../data/mock";

const prisma = new PrismaClient();
const mode = process.argv[2] === "demo" ? "demo" : "empty";
const email = (handle: string) => `${handle}@fisgou.app`;

async function main() {
  console.log(`Limpando tabelas (${mode})…`);
  // Ordem respeita as FKs.
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.collectionEntry.deleteMany();
  await prisma.post.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.pesqueiro.deleteMany();
  await prisma.species.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = bcrypt.hashSync(mode === "demo" ? "fisgou123" : "admin123", 10);

  if (mode !== "demo") {
    console.log("Criando usuário padrão para login fácil…");
    await prisma.user.create({
      data: {
        id: "admin-user",
        nome: "Admin Fisgou",
        handle: "admin",
        email: "admin@gmail.com",
        passwordHash,
        cidade: "Local",
        bio: "Usuário administrativo de acesso rápido.",
        cor: "#2C7A7B",
        iniciais: "AD",
        criador: false,
        peixes: 0,
        especies: 0,
        seguidores: null,
        seguindo: null,
        amigos: null,
      },
    });
    console.log("✅ Banco resetado sem dados de exemplo.");
    return;
  }

  console.log("Criando usuários de exemplo…");
  for (const u of users) {
    await prisma.user.create({
      data: {
        id: u.id,
        nome: u.nome,
        handle: u.handle,
        email: email(u.handle),
        passwordHash,
        cidade: u.cidade,
        bio: u.bio,
        cor: u.cor,
        iniciais: u.iniciais,
        criador: !!u.criador,
        peixes: u.stats.peixes,
        especies: u.stats.especies,
        seguidores: u.stats.seguidores ?? null,
        seguindo: u.stats.seguindo ?? null,
        amigos: u.stats.amigos ?? null,
      },
    });
  }

  console.log("Criando espécies de exemplo…");
  for (const s of species) {
    await prisma.species.create({
      data: {
        id: s.id,
        nome: s.nome,
        nomeCientifico: s.nomeCientifico,
        raridade: s.raridade,
        agua: s.agua,
        cor: s.cor,
      },
    });
  }

  console.log("Criando pesqueiros de exemplo…");
  for (const p of pesqueiros) {
    await prisma.pesqueiro.create({
      data: {
        id: p.id,
        nome: p.nome,
        tipo: p.tipo,
        nota: p.nota,
        avaliacoes: p.avaliacoes,
        distanciaKm: p.distanciaKm,
        cidade: p.cidade ?? null,
        endereco: p.endereco,
        cor: p.cor,
        lat: p.lat ?? null,
        lng: p.lng ?? null,
      },
    });
  }

  console.log("Criando insígnias…");
  await Promise.all(
    badges.map((b, i) =>
      prisma.badge.create({
        data: { id: b.id, nome: b.nome, icon: b.icon, tier: b.tier, ordem: i },
      }),
    ),
  );

  console.log("Criando posts de exemplo…");
  for (const p of posts) {
    await prisma.post.create({
      data: {
        id: p.id,
        autorId: p.autor.id,
        criadoEm: new Date(p.criadoEm),
        imagemCor: p.imagemCor,
        legenda: p.legenda,
        speciesId: p.especie?.id ?? null,
        status: p.status ?? null,
        localPrivacidade: p.localPrivacidade ?? null,
        curtidas: p.curtidas,
        comentarios: p.comentarios,
      },
    });
  }

  console.log("Criando comentários…");
  for (const c of comments) {
    await prisma.comment.create({
      data: {
        id: c.id,
        postId: c.postId,
        autorId: c.autor.id,
        texto: c.texto,
        criadoEm: new Date(c.criadoEm),
      },
    });
  }

  console.log("Criando coleção do usuário demo…");
  for (const e of collection) {
    await prisma.collectionEntry.create({
      data: {
        userId: currentUser.id,
        speciesId: e.species.id,
        status: e.status,
        capturadoEm: e.capturadoEm ? new Date(e.capturadoEm) : null,
      },
    });
  }

  console.log("Criando follows…");
  for (const handle of followingHandles) {
    const alvo = users.find((u) => u.handle === handle);
    if (alvo) {
      await prisma.follow.create({
        data: { followerId: currentUser.id, followingId: alvo.id },
      });
    }
  }

  console.log("Criando notificações…");
  for (const n of notifications) {
    await prisma.notification.create({
      data: {
        id: n.id,
        recipientId: currentUser.id,
        tipo: n.tipo,
        actorId: n.ator?.id ?? null,
        postId: n.postId ?? null,
        speciesId: n.especie?.id ?? null,
        criadoEm: new Date(n.criadoEm),
        lida: n.lida,
      },
    });
  }

  console.log("✅ Seed de exemplo concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
