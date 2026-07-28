import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toDateTimeInputValue } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventoForm } from "../evento-form";
import { updateEvento, deleteEvento } from "../actions";
import { EventoDeleteButton } from "./evento-delete-button";

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);
  const { id } = await params;

  const [evento, membros, congregacoes] = await Promise.all([
    prisma.eventoAgenda.findUnique({ where: { id: Number(id) } }),
    prisma.membro.findMany({ orderBy: { nomeCompleto: "asc" }, select: { id: true, nomeCompleto: true } }),
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!evento) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar evento</h1>
        <EventoDeleteButton action={deleteEvento.bind(null, evento.id)} titulo={evento.titulo} />
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados do evento</CardTitle>
        </CardHeader>
        <CardContent>
          <EventoForm
            action={updateEvento.bind(null, evento.id)}
            membros={membros}
            congregacoes={congregacoes}
            defaultValues={{
              titulo: evento.titulo,
              descricao: evento.descricao,
              inicio: toDateTimeInputValue(evento.inicio),
              fim: toDateTimeInputValue(evento.fim),
              local: evento.local,
              tipo: evento.tipo,
              congregacaoId: evento.congregacaoId,
              responsavelId: evento.responsavelId,
              recorrencia: evento.recorrencia,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
