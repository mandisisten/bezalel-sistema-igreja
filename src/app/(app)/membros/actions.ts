"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { saveMemberPhoto, deleteMemberPhoto } from "@/lib/upload";

const membroSchema = z.object({
  nomeCompleto: z.string().min(2, "Informe o nome completo."),
  apelido: z.string().optional(),
  dataNascimento: z.string().optional(),
  sexo: z.string().optional(),
  estadoCivil: z.string().optional(),
  naturalidade: z.string().optional(),
  nacionalidade: z.string().optional(),
  rg: z.string().optional(),
  cpf: z.string().optional(),
  cep: z.string().optional(),
  endereco: z.string().optional(),
  numeroCasa: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  telefone: z.string().optional(),
  celular: z.string().optional(),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  profissao: z.string().optional(),
  escolaridade: z.string().optional(),
  nomeConjuge: z.string().optional(),
  nomePai: z.string().optional(),
  nomeMae: z.string().optional(),
  dataConversao: z.string().optional(),
  dataAdmissao: z.string().optional(),
  formaAdmissao: z.string().optional(),
  congregacaoId: z.coerce.number().int("Selecione a congregação."),
  cargoId: z.coerce.number().int().optional(),
  status: z.string(),
  dataSaida: z.string().optional(),
  motivoSaida: z.string().optional(),
  observacoes: z.string().optional(),
});

export type MembroFormState = { error?: string };

function toDate(value?: string) {
  return value ? new Date(value) : undefined;
}

function parseForm(formData: FormData) {
  return membroSchema.safeParse({
    nomeCompleto: formData.get("nomeCompleto"),
    apelido: formData.get("apelido") || undefined,
    dataNascimento: formData.get("dataNascimento") || undefined,
    sexo: formData.get("sexo") || undefined,
    estadoCivil: formData.get("estadoCivil") || undefined,
    naturalidade: formData.get("naturalidade") || undefined,
    nacionalidade: formData.get("nacionalidade") || undefined,
    rg: formData.get("rg") || undefined,
    cpf: formData.get("cpf") || undefined,
    cep: formData.get("cep") || undefined,
    endereco: formData.get("endereco") || undefined,
    numeroCasa: formData.get("numeroCasa") || undefined,
    bairro: formData.get("bairro") || undefined,
    cidade: formData.get("cidade") || undefined,
    uf: formData.get("uf") || undefined,
    telefone: formData.get("telefone") || undefined,
    celular: formData.get("celular") || undefined,
    email: formData.get("email") || undefined,
    profissao: formData.get("profissao") || undefined,
    escolaridade: formData.get("escolaridade") || undefined,
    nomeConjuge: formData.get("nomeConjuge") || undefined,
    nomePai: formData.get("nomePai") || undefined,
    nomeMae: formData.get("nomeMae") || undefined,
    dataConversao: formData.get("dataConversao") || undefined,
    dataAdmissao: formData.get("dataAdmissao") || undefined,
    formaAdmissao: formData.get("formaAdmissao") || undefined,
    congregacaoId: formData.get("congregacaoId"),
    cargoId: formData.get("cargoId") || undefined,
    status: formData.get("status") || "ATIVO",
    dataSaida: formData.get("dataSaida") || undefined,
    motivoSaida: formData.get("motivoSaida") || undefined,
    observacoes: formData.get("observacoes") || undefined,
  });
}

export async function createMembro(
  _prevState: MembroFormState,
  formData: FormData,
): Promise<MembroFormState> {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { congregacaoId, cargoId, dataNascimento, dataConversao, dataAdmissao, dataSaida, ...rest } =
    parsed.data;

  const foto = formData.get("foto");
  let fotoUrl: string | undefined;
  if (foto instanceof File && foto.size > 0) {
    fotoUrl = await saveMemberPhoto(foto);
  }

  const membro = await prisma.membro.create({
    data: {
      ...rest,
      fotoUrl,
      congregacaoId,
      cargoId: cargoId || undefined,
      dataNascimento: toDate(dataNascimento),
      dataConversao: toDate(dataConversao),
      dataAdmissao: toDate(dataAdmissao),
      dataSaida: toDate(dataSaida),
    },
  });

  if (cargoId) {
    await prisma.cargoHistorico.create({
      data: {
        membroId: membro.id,
        cargoId,
        congregacaoId,
        dataInicio: toDate(dataAdmissao) ?? new Date(),
      },
    });
  }

  revalidatePath("/membros");
  redirect(`/membros/${membro.id}`);
}

export async function updateMembro(
  id: number,
  _prevState: MembroFormState,
  formData: FormData,
): Promise<MembroFormState> {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const existing = await prisma.membro.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Membro não encontrado." };
  }

  const { congregacaoId, cargoId, dataNascimento, dataConversao, dataAdmissao, dataSaida, ...rest } =
    parsed.data;

  const foto = formData.get("foto");
  let fotoUrl: string | undefined;
  if (foto instanceof File && foto.size > 0) {
    fotoUrl = await saveMemberPhoto(foto);
    await deleteMemberPhoto(existing.fotoUrl);
  }

  await prisma.membro.update({
    where: { id },
    data: {
      ...rest,
      ...(fotoUrl ? { fotoUrl } : {}),
      congregacaoId,
      cargoId: cargoId || null,
      dataNascimento: toDate(dataNascimento) ?? null,
      dataConversao: toDate(dataConversao) ?? null,
      dataAdmissao: toDate(dataAdmissao) ?? null,
      dataSaida: toDate(dataSaida) ?? null,
    },
  });

  if (cargoId !== existing.cargoId) {
    const openHistorico = await prisma.cargoHistorico.findFirst({
      where: { membroId: id, dataFim: null },
      orderBy: { dataInicio: "desc" },
    });
    if (openHistorico) {
      await prisma.cargoHistorico.update({
        where: { id: openHistorico.id },
        data: { dataFim: new Date() },
      });
    }
    if (cargoId) {
      await prisma.cargoHistorico.create({
        data: {
          membroId: id,
          cargoId,
          congregacaoId,
          dataInicio: new Date(),
        },
      });
    }
  }

  revalidatePath("/membros");
  revalidatePath(`/membros/${id}`);
  redirect(`/membros/${id}`);
}

export async function deleteMembro(id: number) {
  await requireRole(["ADMIN"]);

  const membro = await prisma.membro.findUnique({ where: { id } });

  try {
    await prisma.membro.delete({ where: { id } });
  } catch {
    throw new Error(
      "Não é possível excluir este membro: existem registros vinculados (histórico, documentos, etc.). Considere alterar o status para Inativo.",
    );
  }

  if (membro?.fotoUrl) {
    await deleteMemberPhoto(membro.fotoUrl);
  }

  revalidatePath("/membros");
}
