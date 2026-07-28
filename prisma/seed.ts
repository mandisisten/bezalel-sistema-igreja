import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const CARGOS_PADRAO = [
  { nome: "Membro", ordem: 1 },
  { nome: "Cooperador", ordem: 2 },
  { nome: "Diácono", ordem: 3 },
  { nome: "Presbítero", ordem: 4 },
  { nome: "Evangelista", ordem: 5 },
  { nome: "Pastor", ordem: 6 },
];

async function main() {
  for (const cargo of CARGOS_PADRAO) {
    await prisma.cargo.upsert({
      where: { nome: cargo.nome },
      update: {},
      create: cargo,
    });
  }

  const matriz = await prisma.congregacao.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "Congregação Sede",
      matriz: true,
    },
  });

  const senhaHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@igreja.local" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@igreja.local",
      senhaHash,
      role: "ADMIN",
      congregacaoId: matriz.id,
    },
  });

  await prisma.configuracao.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nomeIgreja: "Minha Igreja",
    },
  });

  console.log("Seed concluído. Login inicial: admin@igreja.local / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
