"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, type Role } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe a senha."),
});

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    senha: formData.get("senha"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user || !user.ativo) {
    return { error: "E-mail ou senha incorretos." };
  }

  const senhaValida = await bcrypt.compare(parsed.data.senha, user.senhaHash);
  if (!senhaValida) {
    return { error: "E-mail ou senha incorretos." };
  }

  await createSession({
    sub: String(user.id),
    nome: user.nome,
    email: user.email,
    role: user.role as Role,
    congregacaoId: user.congregacaoId,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
