"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const cartaSchema = z.object({
  membroId: z.coerce.number().int("Selecione o membro."),
  congregacaoOrigemId: z.coerce.number().int().optional(),
  congregacaoDestinoId: z.coerce.number().int().optional(),
  igrejaDestinoTexto: z.string().optional(),
  motivo: z.string().optional(),
  observacoes: z.string().optional(),
});

export type CartaMudancaFormState = { error?: string };

export async function createCartaMudanca(
  _prevState: CartaMudancaFormState,
  formData: FormData,
): Promise<CartaMudancaFormState> {
  await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);

  const parsed = cartaSchema.safeParse({
    membroId: formData.get("membroId"),
    congregacaoOrigemId: formData.get("congregacaoOrigemId") || undefined,
    congregacaoDestinoId: formData.get("congregacaoDestinoId") || undefined,
    igrejaDestinoTexto: formData.get("igrejaDestinoTexto") || undefined,
    motivo: formData.get("motivo") || undefined,
    observacoes: formData.get("observacoes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (!parsed.data.congregacaoDestinoId && !parsed.data.igrejaDestinoTexto) {
    return { error: "Informe a congregação de destino ou o nome da igreja de destino." };
  }

  await prisma.cartaMudanca.create({ data: parsed.data });

  revalidatePath("/cartas/mudanca");
  redirect("/cartas/mudanca");
}

export async function deleteCartaMudanca(id: number) {
  await requireRole(["ADMIN"]);

  try {
    await prisma.cartaMudanca.delete({ where: { id } });
  } catch {
    throw new Error("Não é possível excluir: existem documentos vinculados a este registro.");
  }

  revalidatePath("/cartas/mudanca");
}
