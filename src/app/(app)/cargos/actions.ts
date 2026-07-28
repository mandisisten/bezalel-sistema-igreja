"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const cargoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do cargo."),
  ordem: z.coerce.number().int().min(0),
  ativo: z.boolean(),
});

export type CargoFormState = { error?: string };

function parseForm(formData: FormData) {
  return cargoSchema.safeParse({
    nome: formData.get("nome"),
    ordem: formData.get("ordem") || 0,
    ativo: formData.get("ativo") === "on",
  });
}

export async function createCargo(
  _prevState: CargoFormState,
  formData: FormData,
): Promise<CargoFormState> {
  await requireRole(["ADMIN"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await prisma.cargo.create({ data: parsed.data });
  } catch {
    return { error: "Já existe um cargo com esse nome." };
  }

  revalidatePath("/cargos");
  redirect("/cargos");
}

export async function updateCargo(
  id: number,
  _prevState: CargoFormState,
  formData: FormData,
): Promise<CargoFormState> {
  await requireRole(["ADMIN"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await prisma.cargo.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "Já existe um cargo com esse nome." };
  }

  revalidatePath("/cargos");
  redirect("/cargos");
}

export async function deleteCargo(id: number) {
  await requireRole(["ADMIN"]);

  try {
    await prisma.cargo.delete({ where: { id } });
  } catch {
    throw new Error(
      "Não é possível excluir este cargo: existem membros vinculados a ele.",
    );
  }

  revalidatePath("/cargos");
}
