"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/roles";

const createSchema = z.object({
  nome: z.string().min(2, "Informe o nome."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
  role: z.enum(ROLES),
  congregacaoId: z.coerce.number().int().optional(),
});

const updateSchema = z.object({
  nome: z.string().min(2, "Informe o nome."),
  role: z.enum(ROLES),
  congregacaoId: z.coerce.number().int().optional(),
  ativo: z.boolean(),
  senha: z.string().min(6).optional().or(z.literal("")),
});

export type UserFormState = { error?: string };

export async function createUser(
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireRole(["ADMIN"]);

  const parsed = createSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    senha: formData.get("senha"),
    role: formData.get("role"),
    congregacaoId: formData.get("congregacaoId") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "Já existe um usuário com este e-mail." };
  }

  const senhaHash = await bcrypt.hash(parsed.data.senha, 10);

  await prisma.user.create({
    data: {
      nome: parsed.data.nome,
      email: parsed.data.email,
      senhaHash,
      role: parsed.data.role,
      congregacaoId: parsed.data.congregacaoId,
    },
  });

  revalidatePath("/configuracoes/usuarios");
  redirect("/configuracoes/usuarios");
}

export async function updateUser(
  id: number,
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireRole(["ADMIN"]);

  const parsed = updateSchema.safeParse({
    nome: formData.get("nome"),
    role: formData.get("role"),
    congregacaoId: formData.get("congregacaoId") || undefined,
    ativo: formData.get("ativo") === "on",
    senha: formData.get("senha") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const data: Record<string, unknown> = {
    nome: parsed.data.nome,
    role: parsed.data.role,
    congregacaoId: parsed.data.congregacaoId,
    ativo: parsed.data.ativo,
  };
  if (parsed.data.senha) {
    data.senhaHash = await bcrypt.hash(parsed.data.senha, 10);
  }

  await prisma.user.update({ where: { id }, data });

  revalidatePath("/configuracoes/usuarios");
  redirect("/configuracoes/usuarios");
}
