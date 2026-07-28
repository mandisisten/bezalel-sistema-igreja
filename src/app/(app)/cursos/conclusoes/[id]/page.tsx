import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toDateInputValue } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConclusaoForm } from "../conclusao-form";
import { updateConclusao } from "../actions";

export default async function EditarConclusaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN", "SECRETARIA"]);
  const { id } = await params;

  const [conclusao, membros, cursos] = await Promise.all([
    prisma.cursoConclusao.findUnique({ where: { id: Number(id) } }),
    prisma.membro.findMany({ orderBy: { nomeCompleto: "asc" }, select: { id: true, nomeCompleto: true } }),
    prisma.curso.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!conclusao) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar conclusão de curso</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de conclusão</CardTitle>
        </CardHeader>
        <CardContent>
          <ConclusaoForm
            action={updateConclusao.bind(null, conclusao.id)}
            membros={membros}
            cursos={cursos}
            defaultValues={{
              cursoId: conclusao.cursoId,
              membroId: conclusao.membroId,
              dataConclusao: toDateInputValue(conclusao.dataConclusao),
              instrutor: conclusao.instrutor,
              nota: conclusao.nota,
              observacoes: conclusao.observacoes,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
