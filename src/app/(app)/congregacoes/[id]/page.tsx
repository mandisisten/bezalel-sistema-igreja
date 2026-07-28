import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CongregacaoForm } from "../congregacao-form";
import { updateCongregacao } from "../actions";

export default async function EditarCongregacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { id } = await params;

  const congregacao = await prisma.congregacao.findUnique({
    where: { id: Number(id) },
  });
  if (!congregacao) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar congregação</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Dados da congregação</CardTitle>
        </CardHeader>
        <CardContent>
          <CongregacaoForm
            action={updateCongregacao.bind(null, congregacao.id)}
            defaultValues={{
              nome: congregacao.nome,
              matriz: congregacao.matriz,
              endereco: congregacao.endereco,
              cidade: congregacao.cidade,
              uf: congregacao.uf,
              telefone: congregacao.telefone,
              pastorResponsavel: congregacao.pastorResponsavel,
              dataFundacao: congregacao.dataFundacao
                ? congregacao.dataFundacao.toISOString().slice(0, 10)
                : null,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
