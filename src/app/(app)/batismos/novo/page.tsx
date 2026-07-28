import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatismoForm } from "../batismo-form";
import { createBatismo } from "../actions";

export default async function NovoBatismoPage() {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const [membros, congregacoes] = await Promise.all([
    prisma.membro.findMany({ orderBy: { nomeCompleto: "asc" }, select: { id: true, nomeCompleto: true } }),
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Novo batismo</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de batismo</CardTitle>
        </CardHeader>
        <CardContent>
          <BatismoForm action={createBatismo} membros={membros} congregacoes={congregacoes} />
        </CardContent>
      </Card>
    </div>
  );
}
