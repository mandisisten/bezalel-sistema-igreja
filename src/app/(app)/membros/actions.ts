import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toTimestamp } from "@/lib/firestore-utils";

export type MembroInput = {
  nomeCompleto: string;
  apelido?: string | null;
  fotoUrl?: string | null;
  dataNascimento?: Timestamp | null;
  sexo?: string | null;
  estadoCivil?: string | null;
  naturalidade?: string | null;
  nacionalidade?: string | null;
  rg?: string | null;
  cpf?: string | null;
  cep?: string | null;
  endereco?: string | null;
  numeroCasa?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  telefone?: string | null;
  celular?: string | null;
  email?: string | null;
  profissao?: string | null;
  escolaridade?: string | null;
  nomeConjuge?: string | null;
  nomePai?: string | null;
  nomeMae?: string | null;
  dataConversao?: Timestamp | null;
  dataAdmissao?: Timestamp | null;
  formaAdmissao?: string | null;
  congregacaoId: string;
  congregacaoNome?: string | null;
  cargoId?: string | null;
  cargoNome?: string | null;
  status: string;
  dataSaida?: Timestamp | null;
  motivoSaida?: string | null;
  observacoes?: string | null;
};

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return value ? String(value) : null;
}

async function uploadFoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `membros/${crypto.randomUUID()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

async function deleteFoto(fotoUrl: string | null | undefined) {
  if (!fotoUrl) return;
  try {
    await deleteObject(ref(storage, fotoUrl));
  } catch {
    // arquivo pode já não existir; ignora
  }
}

async function parseForm(formData: FormData): Promise<{ data: MembroInput; cargoId: string | null }> {
  const nomeCompleto = str(formData, "nomeCompleto");
  if (!nomeCompleto || nomeCompleto.length < 2) {
    throw new Error("Informe o nome completo.");
  }
  const congregacaoId = str(formData, "congregacaoId");
  if (!congregacaoId) {
    throw new Error("Selecione a congregação.");
  }

  const congregacaoSnap = await getDoc(doc(db, "congregacoes", congregacaoId));
  const congregacaoNome = congregacaoSnap.exists() ? (congregacaoSnap.data().nome as string) : null;

  const cargoId = str(formData, "cargoId");
  let cargoNome: string | null = null;
  if (cargoId) {
    const cargoSnap = await getDoc(doc(db, "cargos", cargoId));
    cargoNome = cargoSnap.exists() ? (cargoSnap.data().nome as string) : null;
  }

  const data: MembroInput = {
    nomeCompleto,
    apelido: str(formData, "apelido"),
    dataNascimento: toTimestamp(str(formData, "dataNascimento")),
    sexo: str(formData, "sexo"),
    estadoCivil: str(formData, "estadoCivil"),
    naturalidade: str(formData, "naturalidade"),
    nacionalidade: str(formData, "nacionalidade") ?? "Brasileira",
    rg: str(formData, "rg"),
    cpf: str(formData, "cpf"),
    cep: str(formData, "cep"),
    endereco: str(formData, "endereco"),
    numeroCasa: str(formData, "numeroCasa"),
    bairro: str(formData, "bairro"),
    cidade: str(formData, "cidade"),
    uf: str(formData, "uf"),
    telefone: str(formData, "telefone"),
    celular: str(formData, "celular"),
    email: str(formData, "email"),
    profissao: str(formData, "profissao"),
    escolaridade: str(formData, "escolaridade"),
    nomeConjuge: str(formData, "nomeConjuge"),
    nomePai: str(formData, "nomePai"),
    nomeMae: str(formData, "nomeMae"),
    dataConversao: toTimestamp(str(formData, "dataConversao")),
    dataAdmissao: toTimestamp(str(formData, "dataAdmissao")),
    formaAdmissao: str(formData, "formaAdmissao"),
    congregacaoId,
    congregacaoNome,
    cargoId,
    cargoNome,
    status: str(formData, "status") ?? "ATIVO",
    dataSaida: toTimestamp(str(formData, "dataSaida")),
    motivoSaida: str(formData, "motivoSaida"),
    observacoes: str(formData, "observacoes"),
  };

  return { data, cargoId };
}

export async function createMembro(formData: FormData): Promise<string> {
  const { data, cargoId } = await parseForm(formData);

  const foto = formData.get("foto");
  let fotoUrl: string | null = null;
  if (foto instanceof File && foto.size > 0) {
    fotoUrl = await uploadFoto(foto);
  }

  const docRef = await addDoc(collection(db, "membros"), {
    ...data,
    fotoUrl,
    createdAt: serverTimestamp(),
  });

  if (cargoId) {
    await addDoc(collection(db, "membros", docRef.id, "cargoHistorico"), {
      cargoId,
      cargoNome: data.cargoNome,
      congregacaoId: data.congregacaoId,
      congregacaoNome: data.congregacaoNome,
      dataInicio: data.dataAdmissao ?? Timestamp.now(),
      dataFim: null,
      observacao: null,
    });
  }

  return docRef.id;
}

export async function updateMembro(id: string, formData: FormData) {
  const { data, cargoId } = await parseForm(formData);

  const existingSnap = await getDoc(doc(db, "membros", id));
  const existing = existingSnap.data() as MembroInput | undefined;

  const foto = formData.get("foto");
  let fotoUrl: string | null | undefined;
  if (foto instanceof File && foto.size > 0) {
    fotoUrl = await uploadFoto(foto);
    await deleteFoto(existing?.fotoUrl);
  }

  await updateDoc(doc(db, "membros", id), {
    ...data,
    ...(fotoUrl ? { fotoUrl } : {}),
  });

  if (existing && cargoId !== (existing.cargoId ?? null)) {
    const historicoSnap = await getDocs(collection(db, "membros", id, "cargoHistorico"));
    const abertos = historicoSnap.docs
      .filter((d) => d.data().dataFim === null)
      .sort(
        (a, b) =>
          (b.data().dataInicio as Timestamp).toMillis() -
          (a.data().dataInicio as Timestamp).toMillis(),
      );
    for (const historicoDoc of abertos) {
      await updateDoc(historicoDoc.ref, { dataFim: Timestamp.now() });
    }

    if (cargoId) {
      await addDoc(collection(db, "membros", id, "cargoHistorico"), {
        cargoId,
        cargoNome: data.cargoNome,
        congregacaoId: data.congregacaoId,
        congregacaoNome: data.congregacaoNome,
        dataInicio: Timestamp.now(),
        dataFim: null,
        observacao: null,
      });
    }
  }
}

export async function deleteMembro(id: string) {
  const membroSnap = await getDoc(doc(db, "membros", id));
  const membro = membroSnap.data() as MembroInput | undefined;

  const historico = await getDocs(collection(db, "membros", id, "cargoHistorico"));
  await Promise.all(historico.docs.map((d) => deleteDoc(d.ref)));

  await deleteDoc(doc(db, "membros", id));

  if (membro?.fotoUrl) {
    await deleteFoto(membro.fotoUrl);
  }
}
