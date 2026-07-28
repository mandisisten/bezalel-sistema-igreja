import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toDateInputValue } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatismoForm } from "../batismo-form";
import { updateBatismo } from "../actions";

export default async function EditarBatismoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN", "SECRETARIA"]);
  const { id } = await params;

  const [batismo, membros, congregacoes] = await Promise.all([
    prisma.batismo.findUnique({ where: { id: Number(id) } }),
    prisma.membro.findMany({ orderBy: { nomeCompleto: "asc" }, select: { id: true, nomeCompleto: true } }),
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!batismo) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar batismo</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de batismo</CardTitle>
        </CardHeader>
        <CardContent>
          <BatismoForm
            action={updateBatismo.bind(null, batismo.id)}
            membros={membros}
            congregacoes={congregacoes}
            defaultValues={{
              membroId: batismo.membroId,
              data: toDateInputValue(batismo.data),
              local: batismo.local,
              oficiante: batismo.oficiante,
              testemunhas: batismo.testemunhas,
              congregacaoId: batismo.congregacaoId,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
