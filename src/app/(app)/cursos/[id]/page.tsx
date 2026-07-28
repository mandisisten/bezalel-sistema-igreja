import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CursoForm } from "../curso-form";
import { updateCurso } from "../actions";

export default async function EditarCursoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN", "SECRETARIA"]);
  const { id } = await params;

  const curso = await prisma.curso.findUnique({ where: { id: Number(id) } });
  if (!curso) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar curso</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Dados do curso</CardTitle>
        </CardHeader>
        <CardContent>
          <CursoForm
            action={updateCurso.bind(null, curso.id)}
            defaultValues={{
              nome: curso.nome,
              cargaHoraria: curso.cargaHoraria,
              descricao: curso.descricao,
              ativo: curso.ativo,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
