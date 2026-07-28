"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { saveChurchLogo, deleteChurchLogo } from "@/lib/upload";
import { getConfiguracao } from "@/lib/documento";

const configuracaoSchema = z.object({
  nomeIgreja: z.string().min(2, "Informe o nome da igreja."),
  cnpj: z.string().optional(),
  enderecoSede: z.string().optional(),
  telefoneSede: z.string().optional(),
  nomePresidente: z.string().optional(),
  cargoPresidente: z.string().optional(),
});

export type ConfiguracaoFormState = { error?: string; success?: boolean };

export async function updateConfiguracao(
  _prevState: ConfiguracaoFormState,
  formData: FormData,
): Promise<ConfiguracaoFormState> {
  await requireRole(["ADMIN"]);

  const parsed = configuracaoSchema.safeParse({
    nomeIgreja: formData.get("nomeIgreja"),
    cnpj: formData.get("cnpj") || undefined,
    enderecoSede: formData.get("enderecoSede") || undefined,
    telefoneSede: formData.get("telefoneSede") || undefined,
    nomePresidente: formData.get("nomePresidente") || undefined,
    cargoPresidente: formData.get("cargoPresidente") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const logo = formData.get("logo");
  let logoUrl: string | undefined;
  if (logo instanceof File && logo.size > 0) {
    const atual = await getConfiguracao();
    logoUrl = await saveChurchLogo(logo);
    await deleteChurchLogo(atual.logoUrl);
  }

  await prisma.configuracao.upsert({
    where: { id: 1 },
    update: { ...parsed.data, ...(logoUrl ? { logoUrl } : {}) },
    create: { id: 1, ...parsed.data, logoUrl },
  });

  revalidatePath("/configuracoes");
  revalidatePath("/", "layout");
  return { success: true };
}
