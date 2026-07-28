"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const batismoSchema = z.object({
  membroId: z.coerce.number().int("Selecione o membro."),
  data: z.string().min(1, "Informe a data."),
  local: z.string().optional(),
  oficiante: z.string().optional(),
  testemunhas: z.string().optional(),
  congregacaoId: z.coerce.number().int().optional(),
});

export type BatismoFormState = { error?: string };

function parseForm(formData: FormData) {
  return batismoSchema.safeParse({
    membroId: formData.get("membroId"),
    data: formData.get("data"),
    local: formData.get("local") || undefined,
    oficiante: formData.get("oficiante") || undefined,
    testemunhas: formData.get("testemunhas") || undefined,
    congregacaoId: formData.get("congregacaoId") || undefined,
  });
}

export async function createBatismo(
  _prevState: BatismoFormState,
  formData: FormData,
): Promise<BatismoFormState> {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.batismo.create({
    data: { ...parsed.data, data: new Date(parsed.data.data) },
  });

  revalidatePath("/batismos");
  redirect("/batismos");
}

export async function updateBatismo(
  id: number,
  _prevState: BatismoFormState,
  formData: FormData,
): Promise<BatismoFormState> {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.batismo.update({
    where: { id },
    data: { ...parsed.data, data: new Date(parsed.data.data) },
  });

  revalidatePath("/batismos");
  redirect("/batismos");
}

export async function deleteBatismo(id: number) {
  await requireRole(["ADMIN"]);

  try {
    await prisma.batismo.delete({ where: { id } });
  } catch {
    throw new Error("Não é possível excluir: existem documentos vinculados a este registro.");
  }

  revalidatePath("/batismos");
}
