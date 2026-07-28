import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { DOCUMENTO_LABELS } from "@/lib/documento";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DocumentosPage() {
  await requireUser();

  const documentos = await prisma.documento.findMany({
    orderBy: { dataEmissao: "desc" },
    include: { membro: true, emitidoPor: true },
    take: 300,
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Documentos emitidos</h1>
        <p className="text-muted-foreground">
          Histórico de todos os certificados, carteirinhas e cartas gerados pelo sistema.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Membro</TableHead>
              <TableHead>Emitido em</TableHead>
              <TableHead>Emitido por</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentos.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-xs">{d.numero}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{DOCUMENTO_LABELS[d.tipo] ?? d.tipo}</Badge>
                </TableCell>
                <TableCell>{d.membro?.nomeCompleto ?? "—"}</TableCell>
                <TableCell>{formatDate(d.dataEmissao)}</TableCell>
                <TableCell>{d.emitidoPor.nome}</TableCell>
              </TableRow>
            ))}
            {documentos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum documento emitido ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
