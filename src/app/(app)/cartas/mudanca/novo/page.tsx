import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartaMudancaForm } from "../carta-form";
import { createCartaMudanca } from "../actions";

export default async function NovaCartaMudancaPage() {
  await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);

  const [membros, congregacoes] = await Promise.all([
    prisma.membro.findMany({ orderBy: { nomeCompleto: "asc" }, select: { id: true, nomeCompleto: true } }),
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nova carta de mudança</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados da carta</CardTitle>
        </CardHeader>
        <CardContent>
          <CartaMudancaForm action={createCartaMudanca} membros={membros} congregacoes={congregacoes} />
        </CardContent>
      </Card>
    </div>
  );
}
