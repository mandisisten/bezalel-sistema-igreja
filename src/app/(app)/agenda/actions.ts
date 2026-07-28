"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const eventoSchema = z.object({
  titulo: z.string().min(2, "Informe o título do evento."),
  descricao: z.string().optional(),
  inicio: z.string().min(1, "Informe o início."),
  fim: z.string().min(1, "Informe o fim."),
  local: z.string().optional(),
  tipo: z.string().optional(),
  congregacaoId: z.coerce.number().int().optional(),
  responsavelId: z.coerce.number().int().optional(),
  recorrencia: z.string().optional(),
});

export type EventoFormState = { error?: string };

function parseForm(formData: FormData) {
  return eventoSchema.safeParse({
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao") || undefined,
    inicio: formData.get("inicio"),
    fim: formData.get("fim"),
    local: formData.get("local") || undefined,
    tipo: formData.get("tipo") || undefined,
    congregacaoId: formData.get("congregacaoId") || undefined,
    responsavelId: formData.get("responsavelId") || undefined,
    recorrencia: formData.get("recorrencia") || undefined,
  });
}

export async function createEvento(
  _prevState: EventoFormState,
  formData: FormData,
): Promise<EventoFormState> {
  await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const inicio = new Date(parsed.data.inicio);
  const fim = new Date(parsed.data.fim);
  if (fim < inicio) {
    return { error: "A data de término não pode ser anterior ao início." };
  }

  await prisma.eventoAgenda.create({
    data: { ...parsed.data, inicio, fim },
  });

  revalidatePath("/agenda");
  redirect("/agenda");
}

export async function updateEvento(
  id: number,
  _prevState: EventoFormState,
  formData: FormData,
): Promise<EventoFormState> {
  await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const inicio = new Date(parsed.data.inicio);
  const fim = new Date(parsed.data.fim);
  if (fim < inicio) {
    return { error: "A data de término não pode ser anterior ao início." };
  }

  await prisma.eventoAgenda.update({
    where: { id },
    data: { ...parsed.data, inicio, fim },
  });

  revalidatePath("/agenda");
  redirect("/agenda");
}

export async function deleteEvento(id: number) {
  await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);
  await prisma.eventoAgenda.delete({ where: { id } });
  revalidatePath("/agenda");
}
