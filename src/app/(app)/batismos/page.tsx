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
import { deleteBatismo } from "./actions";

export default async function BatismosPage() {
  await requireUser();

  const batismos = await prisma.batismo.findMany({
    orderBy: { data: "desc" },
    include: { membro: true, congregacao: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Batismos</h1>
          <p className="text-muted-foreground">{batismos.length} registro(s).</p>
        </div>
        <Button nativeButton={false} render={<Link href="/batismos/novo" />}>
          <Plus className="size-4" />
          Novo batismo
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Oficiante</TableHead>
              <TableHead>Congregação</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batismos.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">
                  <Link href={`/batismos/${b.id}`}>{b.membro.nomeCompleto}</Link>
                </TableCell>
                <TableCell>{formatDate(b.data)}</TableCell>
                <TableCell>{b.local || "—"}</TableCell>
                <TableCell>{b.oficiante || "—"}</TableCell>
                <TableCell>{b.congregacao?.nome ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={
                        <Link href={`/api/documentos/certificado-batismo/${b.id}`} target="_blank" />
                      }
                    >
                      Certificado
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/batismos/${b.id}`} />}
                    >
                      Editar
                    </Button>
                    <DeleteButton
                      action={deleteBatismo.bind(null, b.id)}
                      title="Excluir registro de batismo?"
                      description="Esta ação não pode ser desfeita."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {batismos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum batismo registrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
