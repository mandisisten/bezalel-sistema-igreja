import "server-only";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

async function saveUpload(file: File, subfolder: string): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads", subfolder);
  await mkdir(dir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${subfolder}/${filename}`;
}

async function deleteUpload(url: string | null, subfolder: string) {
  if (!url || !url.startsWith(`/uploads/${subfolder}/`)) return;

  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // arquivo já pode não existir; ignora
  }
}

export function saveMemberPhoto(file: File) {
  return saveUpload(file, "membros");
}

export function deleteMemberPhoto(fotoUrl: string | null) {
  return deleteUpload(fotoUrl, "membros");
}

export function saveChurchLogo(file: File) {
  return saveUpload(file, "igreja");
}

export function deleteChurchLogo(logoUrl: string | null) {
  return deleteUpload(logoUrl, "igreja");
}

export function resolveUploadPath(url: string | null): string | null {
  if (!url) return null;
  return path.join(process.cwd(), "public", url);
}
