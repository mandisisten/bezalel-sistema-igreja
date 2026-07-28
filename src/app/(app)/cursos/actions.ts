"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const cursoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do curso."),
  cargaHoraria: z.coerce.number().int().optional(),
  descricao: z.string().optional(),
  ativo: z.boolean(),
});

export type CursoFormState = { error?: string };

function parseForm(formData: FormData) {
  return cursoSchema.safeParse({
    nome: formData.get("nome"),
    cargaHoraria: formData.get("cargaHoraria") || undefined,
    descricao: formData.get("descricao") || undefined,
    ativo: formData.get("ativo") === "on",
  });
}

export async function createCurso(
  _prevState: CursoFormState,
  formData: FormData,
): Promise<CursoFormState> {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.curso.create({ data: parsed.data });

  revalidatePath("/cursos");
  redirect("/cursos");
}

export async function updateCurso(
  id: number,
  _prevState: CursoFormState,
  formData: FormData,
): Promise<CursoFormState> {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.curso.update({ where: { id }, data: parsed.data });

  revalidatePath("/cursos");
  redirect("/cursos");
}

export async function deleteCurso(id: number) {
  await requireRole(["ADMIN"]);

  try {
    await prisma.curso.delete({ where: { id } });
  } catch {
    throw new Error("Não é possível excluir: existem conclusões vinculadas a este curso.");
  }

  revalidatePath("/cursos");
}
