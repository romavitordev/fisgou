/**
 * Seed do banco a partir do mock (data/mock.ts) — assim o app já nasce
 * com conteúdo realista. Senha padrão de todos os usuários: "fisgou123".
 * Login demo: marina.pesca@fisgou.app / fisgou123
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

const email = (handle: string) => `${handle}@fisgou.app`;

async function main() {
  console.log("Limpando tabelas…");
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

  const passwordHash = bcrypt.hashSync("fisgou123", 10);

  console.log("Usuários…");
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

  console.log("Espécies…");
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

  console.log("Pesqueiros…");
  for (const p of pesqueiros) {
    await prisma.pesqueiro.create({
      data: {
        id: p.id,
        nome: p.nome,
        tipo: p.tipo,
        nota: p.nota,
        avaliacoes: p.avaliacoes,
        distanciaKm: p.distanciaKm,
        endereco: p.endereco,
        cor: p.cor,
        lat: p.lat ?? null,
        lng: p.lng ?? null,
      },
    });
  }

  console.log("Insígnias…");
  await Promise.all(
    badges.map((b, i) =>
      prisma.badge.create({
        data: { id: b.id, nome: b.nome, icon: b.icon, tier: b.tier, ordem: i },
      }),
    ),
  );

  console.log("Posts…");
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

  console.log("Comentários…");
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

  console.log("Coleção (Fisgados) do usuário atual…");
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

  console.log("Follows…");
  for (const handle of followingHandles) {
    const alvo = users.find((u) => u.handle === handle);
    if (alvo) {
      await prisma.follow.create({
        data: { followerId: currentUser.id, followingId: alvo.id },
      });
    }
  }

  console.log("Notificações…");
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

  console.log("✅ Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
