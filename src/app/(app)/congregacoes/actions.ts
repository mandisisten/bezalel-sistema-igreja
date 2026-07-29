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
import { toTimestamp } from "@/lib/firestore-utils";

export type CongregacaoInput = {
  nome: string;
  matriz: boolean;
  endereco?: string;
  cidade?: string;
  uf?: string;
  telefone?: string;
  pastorResponsavel?: string;
  dataFundacao?: string;
};

function parseForm(formData: FormData): CongregacaoInput {
  return {
    nome: String(formData.get("nome") ?? ""),
    matriz: formData.get("matriz") === "on",
    endereco: String(formData.get("endereco") ?? "") || undefined,
    cidade: String(formData.get("cidade") ?? "") || undefined,
    uf: String(formData.get("uf") ?? "") || undefined,
    telefone: String(formData.get("telefone") ?? "") || undefined,
    pastorResponsavel: String(formData.get("pastorResponsavel") ?? "") || undefined,
    dataFundacao: String(formData.get("dataFundacao") ?? "") || undefined,
  };
}

export async function createCongregacao(formData: FormData) {
  const input = parseForm(formData);
  if (!input.nome || input.nome.length < 2) {
    throw new Error("Informe o nome da congregação.");
  }

  const docRef = await addDoc(collection(db, "congregacoes"), {
    nome: input.nome,
    matriz: input.matriz,
    endereco: input.endereco ?? null,
    cidade: input.cidade ?? null,
    uf: input.uf ?? null,
    telefone: input.telefone ?? null,
    pastorResponsavel: input.pastorResponsavel ?? null,
    dataFundacao: toTimestamp(input.dataFundacao),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCongregacao(id: string, formData: FormData) {
  const input = parseForm(formData);
  if (!input.nome || input.nome.length < 2) {
    throw new Error("Informe o nome da congregação.");
  }

  await updateDoc(doc(db, "congregacoes", id), {
    nome: input.nome,
    matriz: input.matriz,
    endereco: input.endereco ?? null,
    cidade: input.cidade ?? null,
    uf: input.uf ?? null,
    telefone: input.telefone ?? null,
    pastorResponsavel: input.pastorResponsavel ?? null,
    dataFundacao: toTimestamp(input.dataFundacao),
  });
}

export async function deleteCongregacao(id: string) {
  const vinculados = await getDocs(
    query(collection(db, "membros"), where("congregacaoId", "==", id), limit(1)),
  );
  if (!vinculados.empty) {
    throw new Error(
      "Não é possível excluir esta congregação: existem membros vinculados a ela.",
    );
  }

  await deleteDoc(doc(db, "congregacoes", id));
}
