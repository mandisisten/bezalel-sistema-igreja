import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, limit, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type CursoInput = {
  nome: string;
  cargaHoraria: number | null;
  descricao: string | null;
  ativo: boolean;
};

function parseForm(formData: FormData): CursoInput {
  const nome = String(formData.get("nome") ?? "");
  if (!nome || nome.length < 2) {
    throw new Error("Informe o nome do curso.");
  }
  const cargaHoraria = formData.get("cargaHoraria");
  return {
    nome,
    cargaHoraria: cargaHoraria ? Number(cargaHoraria) : null,
    descricao: String(formData.get("descricao") ?? "") || null,
    ativo: formData.get("ativo") === "on",
  };
}

export async function createCurso(formData: FormData) {
  const input = parseForm(formData);
  await addDoc(collection(db, "cursos"), { ...input, createdAt: serverTimestamp() });
}

export async function updateCurso(id: string, formData: FormData) {
  const input = parseForm(formData);
  await updateDoc(doc(db, "cursos", id), { ...input });
}

export async function deleteCurso(id: string) {
  const vinculadas = await getDocs(
    query(collection(db, "cursoConclusoes"), where("cursoId", "==", id), limit(1)),
  );
  if (!vinculadas.empty) {
    throw new Error("Não é possível excluir: existem conclusões vinculadas a este curso.");
  }

  await deleteDoc(doc(db, "cursos", id));
}
