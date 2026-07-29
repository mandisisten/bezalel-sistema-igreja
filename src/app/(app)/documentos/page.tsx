"use client";

import { orderBy, limit } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData } from "@/lib/firestore-hooks";
import { formatTimestamp } from "@/lib/firestore-utils";
import { DOCUMENTO_LABELS, type DocumentoInput } from "@/lib/documento-client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DocumentosContent() {
  const { data: documentos, loading } = useCollectionData<DocumentoInput>("documentos", [
    orderBy("dataEmissao", "desc"),
    limit(300),
  ]);

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
                <TableCell>{d.membroNome ?? "—"}</TableCell>
                <TableCell>{formatTimestamp(d.dataEmissao)}</TableCell>
                <TableCell>{d.emitidoPorNome}</TableCell>
              </TableRow>
            ))}
            {!loading && documentos.length === 0 && (
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

export default function DocumentosPage() {
  return (
    <AuthGuard>
      <DocumentosContent />
    </AuthGuard>
  );
}
