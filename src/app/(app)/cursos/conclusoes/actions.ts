import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toTimestamp } from "@/lib/firestore-utils";

export type ConclusaoInput = {
  cursoId: string;
  cursoNome?: string | null;
  membroId: string;
  membroNome?: string | null;
  dataConclusao: Timestamp;
  instrutor: string | null;
  nota: string | null;
  observacoes: string | null;
};

async function parseForm(formData: FormData): Promise<ConclusaoInput> {
  const cursoId = String(formData.get("cursoId") ?? "");
  if (!cursoId) throw new Error("Selecione o curso.");
  const membroId = String(formData.get("membroId") ?? "");
  if (!membroId) throw new Error("Selecione o membro.");
  const dataConclusao = String(formData.get("dataConclusao") ?? "");
  if (!dataConclusao) throw new Error("Informe a data de conclusão.");

  const [cursoSnap, membroSnap] = await Promise.all([
    getDoc(doc(db, "cursos", cursoId)),
    getDoc(doc(db, "membros", membroId)),
  ]);

  return {
    cursoId,
    cursoNome: cursoSnap.exists() ? (cursoSnap.data().nome as string) : null,
    membroId,
    membroNome: membroSnap.exists() ? (membroSnap.data().nomeCompleto as string) : null,
    dataConclusao: toTimestamp(dataConclusao)!,
    instrutor: String(formData.get("instrutor") ?? "") || null,
    nota: String(formData.get("nota") ?? "") || null,
    observacoes: String(formData.get("observacoes") ?? "") || null,
  };
}

export async function createConclusao(formData: FormData) {
  const input = await parseForm(formData);
  await addDoc(collection(db, "cursoConclusoes"), { ...input, createdAt: serverTimestamp() });
}

export async function updateConclusao(id: string, formData: FormData) {
  const input = await parseForm(formData);
  await updateDoc(doc(db, "cursoConclusoes", id), { ...input });
}

export async function deleteConclusao(id: string) {
  await deleteDoc(doc(db, "cursoConclusoes", id));
}
