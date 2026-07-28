import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartaRecomendacaoForm } from "../carta-form";
import { createCartaRecomendacao } from "../actions";

export default async function NovaCartaRecomendacaoPage() {
  await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);

  const membros = await prisma.membro.findMany({
    orderBy: { nomeCompleto: "asc" },
    select: { id: true, nomeCompleto: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nova carta de recomendação</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados da carta</CardTitle>
        </CardHeader>
        <CardContent>
          <CartaRecomendacaoForm action={createCartaRecomendacao} membros={membros} />
        </CardContent>
      </Card>
    </div>
  );
}
