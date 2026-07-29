import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toTimestamp } from "@/lib/firestore-utils";

export type ApresentacaoInput = {
  nomeCrianca: string;
  dataNascimento: Timestamp | null;
  nomePai: string | null;
  nomeMae: string | null;
  data: Timestamp;
  oficiante: string | null;
  congregacaoId: string | null;
  congregacaoNome?: string | null;
  responsavelId: string | null;
  responsavelNome?: string | null;
  observacoes: string | null;
};

async function parseForm(formData: FormData): Promise<ApresentacaoInput> {
  const nomeCrianca = String(formData.get("nomeCrianca") ?? "");
  if (!nomeCrianca || nomeCrianca.length < 2) throw new Error("Informe o nome da criança.");
  const data = String(formData.get("data") ?? "");
  if (!data) throw new Error("Informe a data.");
  const congregacaoId = String(formData.get("congregacaoId") ?? "") || null;
  const responsavelId = String(formData.get("responsavelId") ?? "") || null;

  const [congregacaoSnap, responsavelSnap] = await Promise.all([
    congregacaoId ? getDoc(doc(db, "congregacoes", congregacaoId)) : Promise.resolve(null),
    responsavelId ? getDoc(doc(db, "membros", responsavelId)) : Promise.resolve(null),
  ]);

  return {
    nomeCrianca,
    dataNascimento: toTimestamp(String(formData.get("dataNascimento") ?? "") || null),
    nomePai: String(formData.get("nomePai") ?? "") || null,
    nomeMae: String(formData.get("nomeMae") ?? "") || null,
    data: toTimestamp(data)!,
    oficiante: String(formData.get("oficiante") ?? "") || null,
    congregacaoId,
    congregacaoNome: congregacaoSnap?.exists() ? (congregacaoSnap.data().nome as string) : null,
    responsavelId,
    responsavelNome: responsavelSnap?.exists() ? (responsavelSnap.data().nomeCompleto as string) : null,
    observacoes: String(formData.get("observacoes") ?? "") || null,
  };
}

export async function createApresentacao(formData: FormData) {
  const input = await parseForm(formData);
  await addDoc(collection(db, "apresentacoes"), { ...input, createdAt: serverTimestamp() });
}

export async function updateApresentacao(id: string, formData: FormData) {
  const input = await parseForm(formData);
  await updateDoc(doc(db, "apresentacoes", id), { ...input });
}

export async function deleteApresentacao(id: string) {
  await deleteDoc(doc(db, "apresentacoes", id));
}
