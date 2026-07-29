import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toDateTimeTimestamp } from "@/lib/firestore-utils";

export type EventoInput = {
  titulo: string;
  descricao: string | null;
  inicio: Timestamp;
  fim: Timestamp;
  local: string | null;
  tipo: string | null;
  congregacaoId: string | null;
  congregacaoNome?: string | null;
  responsavelId: string | null;
  responsavelNome?: string | null;
  recorrencia: string | null;
};

async function parseForm(formData: FormData): Promise<EventoInput> {
  const titulo = String(formData.get("titulo") ?? "");
  if (!titulo || titulo.length < 2) throw new Error("Informe o título do evento.");
  const inicioStr = String(formData.get("inicio") ?? "");
  const fimStr = String(formData.get("fim") ?? "");
  if (!inicioStr) throw new Error("Informe o início.");
  if (!fimStr) throw new Error("Informe o fim.");

  const inicio = toDateTimeTimestamp(inicioStr)!;
  const fim = toDateTimeTimestamp(fimStr)!;
  if (fim.toMillis() < inicio.toMillis()) {
    throw new Error("A data de término não pode ser anterior ao início.");
  }

  const congregacaoId = String(formData.get("congregacaoId") ?? "") || null;
  const responsavelId = String(formData.get("responsavelId") ?? "") || null;

  const [congregacaoSnap, responsavelSnap] = await Promise.all([
    congregacaoId ? getDoc(doc(db, "congregacoes", congregacaoId)) : Promise.resolve(null),
    responsavelId ? getDoc(doc(db, "membros", responsavelId)) : Promise.resolve(null),
  ]);

  return {
    titulo,
    descricao: String(formData.get("descricao") ?? "") || null,
    inicio,
    fim,
    local: String(formData.get("local") ?? "") || null,
    tipo: String(formData.get("tipo") ?? "") || null,
    congregacaoId,
    congregacaoNome: congregacaoSnap?.exists() ? (congregacaoSnap.data().nome as string) : null,
    responsavelId,
    responsavelNome: responsavelSnap?.exists() ? (responsavelSnap.data().nomeCompleto as string) : null,
    recorrencia: String(formData.get("recorrencia") ?? "") || "NENHUMA",
  };
}

export async function createEvento(formData: FormData) {
  const input = await parseForm(formData);
  await addDoc(collection(db, "eventos"), { ...input, createdAt: serverTimestamp() });
}

export async function updateEvento(id: string, formData: FormData) {
  const input = await parseForm(formData);
  await updateDoc(doc(db, "eventos", id), { ...input });
}

export async function deleteEvento(id: string) {
  await deleteDoc(doc(db, "eventos", id));
}
