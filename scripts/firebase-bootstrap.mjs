import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const keyPath = process.argv[2];
if (!keyPath) {
  console.error("Uso: node scripts/firebase-bootstrap.mjs <caminho-da-chave.json>");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const auth = getAuth();

const CARGOS_PADRAO = [
  { nome: "Membro", ordem: 1 },
  { nome: "Cooperador", ordem: 2 },
  { nome: "Diácono", ordem: 3 },
  { nome: "Presbítero", ordem: 4 },
  { nome: "Evangelista", ordem: 5 },
  { nome: "Pastor", ordem: 6 },
];

const ADMIN_EMAIL = "admin@igreja.local";
const ADMIN_SENHA = "admin123";

async function main() {
  console.log("Criando congregação sede...");
  const congregacoesSnap = await db
    .collection("congregacoes")
    .where("matriz", "==", true)
    .limit(1)
    .get();

  let matrizId;
  if (!congregacoesSnap.empty) {
    matrizId = congregacoesSnap.docs[0].id;
    console.log("  já existia:", matrizId);
  } else {
    const ref = await db.collection("congregacoes").add({
      nome: "Congregação Sede",
      matriz: true,
      endereco: null,
      cidade: null,
      uf: null,
      telefone: null,
      pastorResponsavel: null,
      dataFundacao: null,
      createdAt: FieldValue.serverTimestamp(),
    });
    matrizId = ref.id;
    console.log("  criada:", matrizId);
  }

  console.log("Criando cargos padrão...");
  for (const cargo of CARGOS_PADRAO) {
    const existente = await db
      .collection("cargos")
      .where("nome", "==", cargo.nome)
      .limit(1)
      .get();
    if (!existente.empty) {
      console.log(`  já existia: ${cargo.nome}`);
      continue;
    }
    await db.collection("cargos").add({
      nome: cargo.nome,
      ordem: cargo.ordem,
      ativo: true,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`  criado: ${cargo.nome}`);
  }

  console.log("Configuração geral...");
  await db.doc("configuracao/geral").set(
    {
      nomeIgreja: "Minha Igreja",
      cnpj: null,
      logoUrl: null,
      enderecoSede: null,
      telefoneSede: null,
      nomePresidente: null,
      cargoPresidente: "Pastor Presidente",
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log("Criando usuário administrador...");
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
    console.log("  usuário Auth já existia:", userRecord.uid);
  } catch {
    userRecord = await auth.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_SENHA,
      displayName: "Administrador",
    });
    console.log("  usuário Auth criado:", userRecord.uid);
  }

  await db.doc(`usuarios/${userRecord.uid}`).set(
    {
      nome: "Administrador",
      email: ADMIN_EMAIL,
      role: "ADMIN",
      congregacaoId: matrizId,
      ativo: true,
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  console.log("  perfil Firestore criado/atualizado.");

  console.log("\nPronto! Login inicial:");
  console.log(`  E-mail: ${ADMIN_EMAIL}`);
  console.log(`  Senha:  ${ADMIN_SENHA}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
