"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const conclusaoSchema = z.object({
  cursoId: z.coerce.number().int("Selecione o curso."),
  membroId: z.coerce.number().int("Selecione o membro."),
  dataConclusao: z.string().min(1, "Informe a data de conclusão."),
  instrutor: z.string().optional(),
  nota: z.string().optional(),
  observacoes: z.string().optional(),
});

export type ConclusaoFormState = { error?: string };

function parseForm(formData: FormData) {
  return conclusaoSchema.safeParse({
    cursoId: formData.get("cursoId"),
    membroId: formData.get("membroId"),
    dataConclusao: formData.get("dataConclusao"),
    instrutor: formData.get("instrutor") || undefined,
    nota: formData.get("nota") || undefined,
    observacoes: formData.get("observacoes") || undefined,
  });
}

export async function createConclusao(
  _prevState: ConclusaoFormState,
  formData: FormData,
): Promise<ConclusaoFormState> {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.cursoConclusao.create({
    data: { ...parsed.data, dataConclusao: new Date(parsed.data.dataConclusao) },
  });

  revalidatePath("/cursos/conclusoes");
  redirect("/cursos/conclusoes");
}

export async function updateConclusao(
  id: number,
  _prevState: ConclusaoFormState,
  formData: FormData,
): Promise<ConclusaoFormState> {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.cursoConclusao.update({
    where: { id },
    data: { ...parsed.data, dataConclusao: new Date(parsed.data.dataConclusao) },
  });

  revalidatePath("/cursos/conclusoes");
  redirect("/cursos/conclusoes");
}

export async function deleteConclusao(id: number) {
  await requireRole(["ADMIN"]);

  try {
    await prisma.cursoConclusao.delete({ where: { id } });
  } catch {
    throw new Error("Não é possível excluir: existem documentos vinculados a este registro.");
  }

  revalidatePath("/cursos/conclusoes");
}
