import { collection, addDoc, doc, runTransaction, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const DOCUMENTO_PREFIXOS: Record<string, string> = {
  CARTEIRINHA: "CART",
  CERTIFICADO_BATISMO: "CBAT",
  CERTIFICADO_APRESENTACAO: "CAPR",
  CERTIFICADO_CURSO: "CCUR",
  CARTA_RECOMENDACAO: "CREC",
  CARTA_MUDANCA: "CMUD",
};

export const DOCUMENTO_LABELS: Record<string, string> = {
  CARTEIRINHA: "Carteirinha de membro",
  CERTIFICADO_BATISMO: "Certificado de batismo",
  CERTIFICADO_APRESENTACAO: "Certificado de apresentação de criança",
  CERTIFICADO_CURSO: "Certificado de conclusão de curso",
  CARTA_RECOMENDACAO: "Carta de recomendação",
  CARTA_MUDANCA: "Carta de mudança",
};

async function nextNumero(tipo: string): Promise<string> {
  const ano = new Date().getFullYear();
  const prefixo = DOCUMENTO_PREFIXOS[tipo] ?? "DOC";
  const counterRef = doc(db, "counters", `documentos-${tipo}-${ano}`);

  const seq = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const next = (snap.exists() ? (snap.data().seq as number) : 0) + 1;
    tx.set(counterRef, { seq: next }, { merge: true });
    return next;
  });

  return `${prefixo}-${ano}-${String(seq).padStart(4, "0")}`;
}

export async function emitDocumento(params: {
  tipo: string;
  membroId?: string | null;
  membroNome?: string | null;
  referenciaId?: string | null;
  validade?: Date | null;
  emitidoPorUid: string;
  emitidoPorNome: string;
}): Promise<string> {
  const numero = await nextNumero(params.tipo);

  await addDoc(collection(db, "documentos"), {
    tipo: params.tipo,
    numero,
    dataEmissao: serverTimestamp(),
    status: "EMITIDO",
    membroId: params.membroId ?? null,
    membroNome: params.membroNome ?? null,
    referenciaId: params.referenciaId ?? null,
    validade: params.validade ? Timestamp.fromDate(params.validade) : null,
    emitidoPorUid: params.emitidoPorUid,
    emitidoPorNome: params.emitidoPorNome,
  });

  return numero;
}

export type DocumentoInput = {
  tipo: string;
  numero: string;
  dataEmissao: Timestamp;
  status: string;
  membroId: string | null;
  membroNome: string | null;
  referenciaId: string | null;
  validade: Timestamp | null;
  emitidoPorUid: string;
  emitidoPorNome: string;
};
