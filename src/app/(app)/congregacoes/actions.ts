"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const congregacaoSchema = z.object({
  nome: z.string().min(2, "Informe o nome da congregação."),
  matriz: z.boolean(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  telefone: z.string().optional(),
  pastorResponsavel: z.string().optional(),
  dataFundacao: z.string().optional(),
});

export type CongregacaoFormState = { error?: string };

function parseForm(formData: FormData) {
  return congregacaoSchema.safeParse({
    nome: formData.get("nome"),
    matriz: formData.get("matriz") === "on",
    endereco: formData.get("endereco") || undefined,
    cidade: formData.get("cidade") || undefined,
    uf: formData.get("uf") || undefined,
    telefone: formData.get("telefone") || undefined,
    pastorResponsavel: formData.get("pastorResponsavel") || undefined,
    dataFundacao: formData.get("dataFundacao") || undefined,
  });
}

export async function createCongregacao(
  _prevState: CongregacaoFormState,
  formData: FormData,
): Promise<CongregacaoFormState> {
  await requireRole(["ADMIN"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.congregacao.create({
    data: {
      ...parsed.data,
      dataFundacao: parsed.data.dataFundacao
        ? new Date(parsed.data.dataFundacao)
        : undefined,
    },
  });

  revalidatePath("/congregacoes");
  redirect("/congregacoes");
}

export async function updateCongregacao(
  id: number,
  _prevState: CongregacaoFormState,
  formData: FormData,
): Promise<CongregacaoFormState> {
  await requireRole(["ADMIN"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.congregacao.update({
    where: { id },
    data: {
      ...parsed.data,
      dataFundacao: parsed.data.dataFundacao
        ? new Date(parsed.data.dataFundacao)
        : null,
    },
  });

  revalidatePath("/congregacoes");
  redirect("/congregacoes");
}

export async function deleteCongregacao(id: number) {
  await requireRole(["ADMIN"]);

  try {
    await prisma.congregacao.delete({ where: { id } });
  } catch {
    throw new Error(
      "Não é possível excluir esta congregação: existem membros ou registros vinculados a ela.",
    );
  }

  revalidatePath("/congregacoes");
}
