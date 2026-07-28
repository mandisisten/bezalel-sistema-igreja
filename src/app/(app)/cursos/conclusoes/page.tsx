import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
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
import { deleteConclusao } from "./actions";

export default async function ConclusoesPage() {
  await requireUser();

  const conclusoes = await prisma.cursoConclusao.findMany({
    orderBy: { dataConclusao: "desc" },
    include: { curso: true, membro: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Voltar"
              nativeButton={false}
              render={<Link href="/cursos" />}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-2xl font-semibold">Conclusões de curso</h1>
          </div>
          <p className="text-muted-foreground">{conclusoes.length} registro(s).</p>
        </div>
        <Button nativeButton={false} render={<Link href="/cursos/conclusoes/novo" />}>
          <Plus className="size-4" />
          Nova conclusão
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Conclusão</TableHead>
              <TableHead>Instrutor</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conclusoes.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">
                  <Link href={`/cursos/conclusoes/${c.id}`}>{c.membro.nomeCompleto}</Link>
                </TableCell>
                <TableCell>{c.curso.nome}</TableCell>
                <TableCell>{formatDate(c.dataConclusao)}</TableCell>
                <TableCell>{c.instrutor || "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={
                        <Link href={`/api/documentos/certificado-curso/${c.id}`} target="_blank" />
                      }
                    >
                      Certificado
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/cursos/conclusoes/${c.id}`} />}
                    >
                      Editar
                    </Button>
                    <DeleteButton
                      action={deleteConclusao.bind(null, c.id)}
                      title="Excluir registro de conclusão?"
                      description="Esta ação não pode ser desfeita."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {conclusoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma conclusão registrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
