import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, toDateInputValue } from "@/lib/format";
import Link from "next/link";
import { IdCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MembroForm } from "../membro-form";
import { updateMembro, deleteMembro } from "../actions";
import { MembroDeleteButton } from "./membro-delete-button";

export default async function EditarMembroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);
  const { id } = await params;
  const membroId = Number(id);

  const [membro, congregacoes, cargos] = await Promise.all([
    prisma.membro.findUnique({
      where: { id: membroId },
      include: {
        cargoHistorico: {
          include: { cargo: true, congregacao: true },
          orderBy: { dataInicio: "desc" },
        },
      },
    }),
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
    prisma.cargo.findMany({ where: { ativo: true }, orderBy: { ordem: "asc" } }),
  ]);

  if (!membro) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{membro.nomeCompleto}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/api/documentos/carteirinha/${membro.id}`} target="_blank" />}
          >
            <IdCard className="size-4" />
            Emitir carteirinha
          </Button>
          {session.role === "ADMIN" && (
            <MembroDeleteButton
              action={deleteMembro.bind(null, membro.id)}
              nome={membro.nomeCompleto}
            />
          )}
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Editar cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <MembroForm
            action={updateMembro.bind(null, membro.id)}
            congregacoes={congregacoes}
            cargos={cargos}
            defaultValues={{
              nomeCompleto: membro.nomeCompleto,
              apelido: membro.apelido,
              fotoUrl: membro.fotoUrl,
              dataNascimento: toDateInputValue(membro.dataNascimento),
              sexo: membro.sexo,
              estadoCivil: membro.estadoCivil,
              naturalidade: membro.naturalidade,
              nacionalidade: membro.nacionalidade,
              rg: membro.rg,
              cpf: membro.cpf,
              cep: membro.cep,
              endereco: membro.endereco,
              numeroCasa: membro.numeroCasa,
              bairro: membro.bairro,
              cidade: membro.cidade,
              uf: membro.uf,
              telefone: membro.telefone,
              celular: membro.celular,
              email: membro.email,
              profissao: membro.profissao,
              escolaridade: membro.escolaridade,
              nomeConjuge: membro.nomeConjuge,
              nomePai: membro.nomePai,
              nomeMae: membro.nomeMae,
              dataConversao: toDateInputValue(membro.dataConversao),
              dataAdmissao: toDateInputValue(membro.dataAdmissao),
              formaAdmissao: membro.formaAdmissao,
              congregacaoId: membro.congregacaoId,
              cargoId: membro.cargoId,
              status: membro.status,
              dataSaida: toDateInputValue(membro.dataSaida),
              motivoSaida: membro.motivoSaida,
              observacoes: membro.observacoes,
            }}
          />
        </CardContent>
      </Card>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Histórico de cargos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cargo</TableHead>
                <TableHead>Congregação</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membro.cargoHistorico.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.cargo.nome}</TableCell>
                  <TableCell>{h.congregacao?.nome ?? "—"}</TableCell>
                  <TableCell>{formatDate(h.dataInicio)}</TableCell>
                  <TableCell>{h.dataFim ? formatDate(h.dataFim) : "Atual"}</TableCell>
                </TableRow>
              ))}
              {membro.cargoHistorico.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhum histórico de cargo registrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
