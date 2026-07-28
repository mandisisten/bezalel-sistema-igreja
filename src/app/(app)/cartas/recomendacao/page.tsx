import Link from "next/link";
import { Plus, FileDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/shared/delete-button";
import { deleteCartaRecomendacao } from "./actions";

export default async function CartasRecomendacaoPage() {
  await requireUser();

  const cartas = await prisma.cartaRecomendacao.findMany({
    orderBy: { data: "desc" },
    include: { membro: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cartas de Recomendação</h1>
          <p className="text-muted-foreground">{cartas.length} carta(s) emitida(s).</p>
        </div>
        <Button nativeButton={false} render={<Link href="/cartas/recomendacao/novo" />}>
          <Plus className="size-4" />
          Nova carta
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Destinatário</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-32 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartas.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.membro.nomeCompleto}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{c.tipo === "OBREIRO" ? "Obreiro" : "Membro"}</Badge>
                </TableCell>
                <TableCell>{c.destinatario || "—"}</TableCell>
                <TableCell>{formatDate(c.data)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/api/documentos/carta-recomendacao/${c.id}`} target="_blank" />}
                    >
                      <FileDown className="size-4" />
                      PDF
                    </Button>
                    <DeleteButton
                      action={deleteCartaRecomendacao.bind(null, c.id)}
                      title="Excluir carta de recomendação?"
                      description="Esta ação não pode ser desfeita."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {cartas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma carta emitida.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
