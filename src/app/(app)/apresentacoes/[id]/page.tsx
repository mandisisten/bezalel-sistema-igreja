import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toDateInputValue } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApresentacaoForm } from "../apresentacao-form";
import { updateApresentacao } from "../actions";

export default async function EditarApresentacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN", "SECRETARIA"]);
  const { id } = await params;

  const [apresentacao, membros, congregacoes] = await Promise.all([
    prisma.apresentacaoCrianca.findUnique({ where: { id: Number(id) } }),
    prisma.membro.findMany({ orderBy: { nomeCompleto: "asc" }, select: { id: true, nomeCompleto: true } }),
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!apresentacao) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar apresentação</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de apresentação</CardTitle>
        </CardHeader>
        <CardContent>
          <ApresentacaoForm
            action={updateApresentacao.bind(null, apresentacao.id)}
            membros={membros}
            congregacoes={congregacoes}
            defaultValues={{
              nomeCrianca: apresentacao.nomeCrianca,
              dataNascimento: toDateInputValue(apresentacao.dataNascimento),
              nomePai: apresentacao.nomePai,
              nomeMae: apresentacao.nomeMae,
              data: toDateInputValue(apresentacao.data),
              oficiante: apresentacao.oficiante,
              congregacaoId: apresentacao.congregacaoId,
              responsavelId: apresentacao.responsavelId,
              observacoes: apresentacao.observacoes,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
