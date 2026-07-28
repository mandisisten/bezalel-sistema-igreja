"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const apresentacaoSchema = z.object({
  nomeCrianca: z.string().min(2, "Informe o nome da criança."),
  dataNascimento: z.string().optional(),
  nomePai: z.string().optional(),
  nomeMae: z.string().optional(),
  data: z.string().min(1, "Informe a data."),
  oficiante: z.string().optional(),
  congregacaoId: z.coerce.number().int().optional(),
  responsavelId: z.coerce.number().int().optional(),
  observacoes: z.string().optional(),
});

export type ApresentacaoFormState = { error?: string };

function parseForm(formData: FormData) {
  return apresentacaoSchema.safeParse({
    nomeCrianca: formData.get("nomeCrianca"),
    dataNascimento: formData.get("dataNascimento") || undefined,
    nomePai: formData.get("nomePai") || undefined,
    nomeMae: formData.get("nomeMae") || undefined,
    data: formData.get("data"),
    oficiante: formData.get("oficiante") || undefined,
    congregacaoId: formData.get("congregacaoId") || undefined,
    responsavelId: formData.get("responsavelId") || undefined,
    observacoes: formData.get("observacoes") || undefined,
  });
}

export async function createApresentacao(
  _prevState: ApresentacaoFormState,
  formData: FormData,
): Promise<ApresentacaoFormState> {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { dataNascimento, ...rest } = parsed.data;

  await prisma.apresentacaoCrianca.create({
    data: {
      ...rest,
      data: new Date(parsed.data.data),
      dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
    },
  });

  revalidatePath("/apresentacoes");
  redirect("/apresentacoes");
}

export async function updateApresentacao(
  id: number,
  _prevState: ApresentacaoFormState,
  formData: FormData,
): Promise<ApresentacaoFormState> {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { dataNascimento, ...rest } = parsed.data;

  await prisma.apresentacaoCrianca.update({
    where: { id },
    data: {
      ...rest,
      data: new Date(parsed.data.data),
      dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
    },
  });

  revalidatePath("/apresentacoes");
  redirect("/apresentacoes");
}

export async function deleteApresentacao(id: number) {
  await requireRole(["ADMIN"]);

  try {
    await prisma.apresentacaoCrianca.delete({ where: { id } });
  } catch {
    throw new Error("Não é possível excluir: existem documentos vinculados a este registro.");
  }

  revalidatePath("/apresentacoes");
}
