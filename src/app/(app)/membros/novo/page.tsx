import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MembroForm } from "../membro-form";
import { createMembro } from "../actions";

export default async function NovoMembroPage() {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const [congregacoes, cargos] = await Promise.all([
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
    prisma.cargo.findMany({ where: { ativo: true }, orderBy: { ordem: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Novo membro</h1>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Cadastro de membro</CardTitle>
        </CardHeader>
        <CardContent>
          <MembroForm action={createMembro} congregacoes={congregacoes} cargos={cargos} />
        </CardContent>
      </Card>
    </div>
  );
}
