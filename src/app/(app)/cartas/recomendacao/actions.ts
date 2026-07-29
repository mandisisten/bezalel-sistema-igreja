import { collection, addDoc, deleteDoc, doc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type CartaRecomendacaoInput = {
  membroId: string;
  membroNome?: string | null;
  tipo: string;
  destinatario: string | null;
  finalidade: string | null;
  data: Timestamp;
  observacoes: string | null;
};

async function parseForm(formData: FormData): Promise<CartaRecomendacaoInput> {
  const membroId = String(formData.get("membroId") ?? "");
  if (!membroId) throw new Error("Selecione o membro.");
  const tipo = String(formData.get("tipo") ?? "MEMBRO");

  const membroSnap = await getDoc(doc(db, "membros", membroId));

  return {
    membroId,
    membroNome: membroSnap.exists() ? (membroSnap.data().nomeCompleto as string) : null,
    tipo,
    destinatario: String(formData.get("destinatario") ?? "") || null,
    finalidade: String(formData.get("finalidade") ?? "") || null,
    data: Timestamp.now(),
    observacoes: String(formData.get("observacoes") ?? "") || null,
  };
}

export async function createCartaRecomendacao(formData: FormData): Promise<string> {
  const input = await parseForm(formData);
  const docRef = await addDoc(collection(db, "cartasRecomendacao"), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteCartaRecomendacao(id: string) {
  await deleteDoc(doc(db, "cartasRecomendacao", id));
}
