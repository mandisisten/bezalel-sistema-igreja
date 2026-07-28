import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/shared/delete-button";
import { deleteApresentacao } from "./actions";

export default async function ApresentacoesPage() {
  await requireUser();

  const apresentacoes = await prisma.apresentacaoCrianca.findMany({
    orderBy: { data: "desc" },
    include: { congregacao: true, responsavel: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Apresentação de Crianças</h1>
          <p className="text-muted-foreground">{apresentacoes.length} registro(s).</p>
        </div>
        <Button nativeButton={false} render={<Link href="/apresentacoes/novo" />}>
          <Plus className="size-4" />
          Nova apresentação
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Criança</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Congregação</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apresentacoes.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">
                  <Link href={`/apresentacoes/${a.id}`}>{a.nomeCrianca}</Link>
                </TableCell>
                <TableCell>{formatDate(a.data)}</TableCell>
                <TableCell>{a.responsavel?.nomeCompleto ?? "—"}</TableCell>
                <TableCell>{a.congregacao?.nome ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={
                        <Link
                          href={`/api/documentos/certificado-apresentacao/${a.id}`}
                          target="_blank"
                        />
                      }
                    >
                      Certificado
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/apresentacoes/${a.id}`} />}
                    >
                      Editar
                    </Button>
                    <DeleteButton
                      action={deleteApresentacao.bind(null, a.id)}
                      title="Excluir registro de apresentação?"
                      description="Esta ação não pode ser desfeita."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {apresentacoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma apresentação registrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
