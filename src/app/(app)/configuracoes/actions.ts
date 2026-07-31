import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

async function uploadLogo(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `igreja/${crypto.randomUUID()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

async function deleteLogo(logoUrl: string | null | undefined) {
  if (!logoUrl) return;
  try {
    await deleteObject(ref(storage, logoUrl));
  } catch {
    // arquivo pode já não existir; ignora
  }
}

export async function updateConfiguracao(formData: FormData, logoAtual: string | null) {
  const nomeIgreja = String(formData.get("nomeIgreja") ?? "");
  if (!nomeIgreja || nomeIgreja.length < 2) {
    throw new Error("Informe o nome da igreja.");
  }

  const logo = formData.get("logo");
  let logoUrl: string | undefined;
  if (logo instanceof File && logo.size > 0) {
    logoUrl = await uploadLogo(logo);
    await deleteLogo(logoAtual);
  }

  await setDoc(
    doc(db, "configuracao", "geral"),
    {
      nomeIgreja,
      cnpj: String(formData.get("cnpj") ?? "") || null,
      enderecoSede: String(formData.get("enderecoSede") ?? "") || null,
      telefoneSede: String(formData.get("telefoneSede") ?? "") || null,
      nomePresidente: String(formData.get("nomePresidente") ?? "") || null,
      cargoPresidente: String(formData.get("cargoPresidente") ?? "") || null,
      nomeSecretario: String(formData.get("nomeSecretario") ?? "") || null,
      cargoSecretario: String(formData.get("cargoSecretario") ?? "") || null,
      ...(logoUrl ? { logoUrl } : {}),
      updatedAt: new Date(),
    },
    { merge: true },
  );
}
