import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toTimestamp } from "@/lib/firestore-utils";

export type BatismoInput = {
  membroId: string;
  membroNome?: string | null;
  data: Timestamp;
  local: string | null;
  oficiante: string | null;
  testemunhas: string | null;
  congregacaoId: string | null;
  congregacaoNome?: string | null;
};

async function parseForm(formData: FormData): Promise<BatismoInput> {
  const membroId = String(formData.get("membroId") ?? "");
  if (!membroId) throw new Error("Selecione o membro.");
  const data = String(formData.get("data") ?? "");
  if (!data) throw new Error("Informe a data.");
  const congregacaoId = String(formData.get("congregacaoId") ?? "") || null;

  const [membroSnap, congregacaoSnap] = await Promise.all([
    getDoc(doc(db, "membros", membroId)),
    congregacaoId ? getDoc(doc(db, "congregacoes", congregacaoId)) : Promise.resolve(null),
  ]);

  return {
    membroId,
    membroNome: membroSnap.exists() ? (membroSnap.data().nomeCompleto as string) : null,
    data: toTimestamp(data)!,
    local: String(formData.get("local") ?? "") || null,
    oficiante: String(formData.get("oficiante") ?? "") || null,
    testemunhas: String(formData.get("testemunhas") ?? "") || null,
    congregacaoId,
    congregacaoNome: congregacaoSnap?.exists() ? (congregacaoSnap.data().nome as string) : null,
  };
}

export async function createBatismo(formData: FormData) {
  const input = await parseForm(formData);
  await addDoc(collection(db, "batismos"), { ...input, createdAt: serverTimestamp() });
}

export async function updateBatismo(id: string, formData: FormData) {
  const input = await parseForm(formData);
  await updateDoc(doc(db, "batismos", id), { ...input });
}

export async function deleteBatismo(id: string) {
  await deleteDoc(doc(db, "batismos", id));
}
