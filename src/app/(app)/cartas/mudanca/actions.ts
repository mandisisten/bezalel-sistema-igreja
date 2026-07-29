import { collection, addDoc, deleteDoc, doc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type CartaMudancaInput = {
  membroId: string;
  membroNome?: string | null;
  congregacaoDestinoId: string | null;
  congregacaoDestinoNome?: string | null;
  igrejaDestinoTexto: string | null;
  data: Timestamp;
  motivo: string | null;
  observacoes: string | null;
};

async function parseForm(formData: FormData): Promise<CartaMudancaInput> {
  const membroId = String(formData.get("membroId") ?? "");
  if (!membroId) throw new Error("Selecione o membro.");
  const congregacaoDestinoId = String(formData.get("congregacaoDestinoId") ?? "") || null;
  const igrejaDestinoTexto = String(formData.get("igrejaDestinoTexto") ?? "") || null;

  if (!congregacaoDestinoId && !igrejaDestinoTexto) {
    throw new Error("Informe a congregação de destino ou o nome da igreja de destino.");
  }

  const [membroSnap, congregacaoSnap] = await Promise.all([
    getDoc(doc(db, "membros", membroId)),
    congregacaoDestinoId ? getDoc(doc(db, "congregacoes", congregacaoDestinoId)) : Promise.resolve(null),
  ]);

  return {
    membroId,
    membroNome: membroSnap.exists() ? (membroSnap.data().nomeCompleto as string) : null,
    congregacaoDestinoId,
    congregacaoDestinoNome: congregacaoSnap?.exists() ? (congregacaoSnap.data().nome as string) : null,
    igrejaDestinoTexto,
    data: Timestamp.now(),
    motivo: String(formData.get("motivo") ?? "") || null,
    observacoes: String(formData.get("observacoes") ?? "") || null,
  };
}

export async function createCartaMudanca(formData: FormData): Promise<string> {
  const input = await parseForm(formData);
  const docRef = await addDoc(collection(db, "cartasMudanca"), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteCartaMudanca(id: string) {
  await deleteDoc(doc(db, "cartasMudanca", id));
}
