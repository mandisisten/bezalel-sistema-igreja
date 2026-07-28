import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConclusaoForm } from "../conclusao-form";
import { createConclusao } from "../actions";

export default async function NovaConclusaoPage() {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const [membros, cursos] = await Promise.all([
    prisma.membro.findMany({ orderBy: { nomeCompleto: "asc" }, select: { id: true, nomeCompleto: true } }),
    prisma.curso.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nova conclusão de curso</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de conclusão</CardTitle>
        </CardHeader>
        <CardContent>
          <ConclusaoForm action={createConclusao} membros={membros} cursos={cursos} />
        </CardContent>
      </Card>
    </div>
  );
}
