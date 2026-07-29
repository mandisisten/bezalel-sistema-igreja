import { createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, secondaryAuth, auth } from "@/lib/firebase";
import { ROLES, type Role } from "@/lib/roles";

export type UsuarioInput = {
  nome: string;
  email: string;
  role: Role;
  congregacaoId: string | null;
  congregacaoNome?: string | null;
  ativo: boolean;
};

function parseRole(formData: FormData): Role {
  const role = String(formData.get("role") ?? "");
  if (!ROLES.includes(role as Role)) throw new Error("Papel inválido.");
  return role as Role;
}

export async function createUsuario(formData: FormData): Promise<string> {
  const nome = String(formData.get("nome") ?? "");
  if (!nome || nome.length < 2) throw new Error("Informe o nome.");
  const email = String(formData.get("email") ?? "");
  if (!email) throw new Error("Informe o e-mail.");
  const senha = String(formData.get("senha") ?? "");
  if (!senha || senha.length < 6) throw new Error("A senha deve ter ao menos 6 caracteres.");
  const role = parseRole(formData);
  const congregacaoId = String(formData.get("congregacaoId") ?? "") || null;

  const congregacaoSnap = congregacaoId ? await getDoc(doc(db, "congregacoes", congregacaoId)) : null;

  // Cria a conta num app Firebase secundário para não deslogar o admin atual
  // (createUserWithEmailAndPassword autentica automaticamente no app usado).
  let uid: string;
  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, senha);
    uid = credential.user.uid;
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "auth/email-already-in-use") {
      throw new Error("Já existe um usuário com este e-mail.");
    }
    throw err;
  } finally {
    await signOut(secondaryAuth);
  }

  await setDoc(doc(db, "usuarios", uid), {
    nome,
    email,
    role,
    congregacaoId,
    congregacaoNome: congregacaoSnap?.exists() ? (congregacaoSnap.data().nome as string) : null,
    ativo: true,
    createdAt: serverTimestamp(),
  });

  return uid;
}

export async function updateUsuario(uid: string, formData: FormData) {
  const nome = String(formData.get("nome") ?? "");
  if (!nome || nome.length < 2) throw new Error("Informe o nome.");
  const role = parseRole(formData);
  const congregacaoId = String(formData.get("congregacaoId") ?? "") || null;
  const ativo = formData.get("ativo") === "on";

  const congregacaoSnap = congregacaoId ? await getDoc(doc(db, "congregacoes", congregacaoId)) : null;

  await updateDoc(doc(db, "usuarios", uid), {
    nome,
    role,
    congregacaoId,
    congregacaoNome: congregacaoSnap?.exists() ? (congregacaoSnap.data().nome as string) : null,
    ativo,
  });
}

export async function enviarRedefinicaoSenha(email: string) {
  await sendPasswordResetEmail(auth, email);
}
