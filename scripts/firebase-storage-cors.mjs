import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const keyPath = process.argv[2];
if (!keyPath) {
  console.error("Uso: node scripts/firebase-storage-cors.mjs <caminho-da-chave.json>");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
});

const bucket = getStorage().bucket();

await bucket.setCorsConfiguration([
  {
    origin: ["http://localhost:3000", "https://mandisisten.github.io"],
    method: ["GET", "HEAD"],
    responseHeader: ["Content-Type", "Access-Control-Allow-Origin"],
    maxAgeSeconds: 3600,
  },
]);

console.log("CORS configurado com sucesso no bucket:", bucket.name);
const [metadata] = await bucket.getMetadata();
console.log(JSON.stringify(metadata.cors, null, 2));
