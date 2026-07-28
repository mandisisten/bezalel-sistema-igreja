import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApresentacaoForm } from "../apresentacao-form";
import { createApresentacao } from "../actions";

export default async function NovaApresentacaoPage() {
  await requireRole(["ADMIN", "SECRETARIA"]);

  const [membros, congregacoes] = await Promise.all([
    prisma.membro.findMany({ orderBy: { nomeCompleto: "asc" }, select: { id: true, nomeCompleto: true } }),
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nova apresentação de criança</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de apresentação</CardTitle>
        </CardHeader>
        <CardContent>
          <ApresentacaoForm action={createApresentacao} membros={membros} congregacoes={congregacoes} />
        </CardContent>
      </Card>
    </div>
  );
}
