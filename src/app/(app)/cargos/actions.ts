import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type CargoInput = {
  nome: string;
  ordem: number;
  ativo: boolean;
};

function parseForm(formData: FormData): CargoInput {
  const nome = String(formData.get("nome") ?? "");
  const ordem = Number(formData.get("ordem") ?? 0);
  return {
    nome,
    ordem: Number.isFinite(ordem) ? ordem : 0,
    ativo: formData.get("ativo") === "on",
  };
}

export async function createCargo(formData: FormData) {
  const input = parseForm(formData);
  if (!input.nome || input.nome.length < 2) {
    throw new Error("Informe o nome do cargo.");
  }

  await addDoc(collection(db, "cargos"), {
    ...input,
    createdAt: serverTimestamp(),
  });
}

export async function updateCargo(id: string, formData: FormData) {
  const input = parseForm(formData);
  if (!input.nome || input.nome.length < 2) {
    throw new Error("Informe o nome do cargo.");
  }

  await updateDoc(doc(db, "cargos", id), { ...input });
}

export async function deleteCargo(id: string) {
  const vinculados = await getDocs(
    query(collection(db, "membros"), where("cargoId", "==", id), limit(1)),
  );
  if (!vinculados.empty) {
    throw new Error("Não é possível excluir este cargo: existem membros vinculados a ele.");
  }

  await deleteDoc(doc(db, "cargos", id));
}
