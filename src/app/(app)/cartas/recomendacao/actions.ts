"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const cartaSchema = z.object({
  membroId: z.coerce.number().int("Selecione o membro."),
  tipo: z.enum(["OBREIRO", "MEMBRO"]),
  destinatario: z.string().optional(),
  finalidade: z.string().optional(),
  observacoes: z.string().optional(),
});

export type CartaRecomendacaoFormState = { error?: string };

export async function createCartaRecomendacao(
  _prevState: CartaRecomendacaoFormState,
  formData: FormData,
): Promise<CartaRecomendacaoFormState> {
  await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);

  const parsed = cartaSchema.safeParse({
    membroId: formData.get("membroId"),
    tipo: formData.get("tipo"),
    destinatario: formData.get("destinatario") || undefined,
    finalidade: formData.get("finalidade") || undefined,
    observacoes: formData.get("observacoes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.cartaRecomendacao.create({ data: parsed.data });

  revalidatePath("/cartas/recomendacao");
  redirect("/cartas/recomendacao");
}

export async function deleteCartaRecomendacao(id: number) {
  await requireRole(["ADMIN"]);

  try {
    await prisma.cartaRecomendacao.delete({ where: { id } });
  } catch {
    throw new Error("Não é possível excluir: existem documentos vinculados a este registro.");
  }

  revalidatePath("/cartas/recomendacao");
}
