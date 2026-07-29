"use client";

import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData } from "@/lib/firestore-hooks";
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
import { deleteCongregacao, type CongregacaoInput } from "./actions";

function CongregacoesContent() {
  const { data: congregacoes, loading } = useCollectionData<CongregacaoInput>(
    "congregacoes",
    [orderBy("nome", "asc")],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Congregações</h1>
          <p className="text-muted-foreground">Filiais e sede cadastradas no sistema.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/congregacoes/novo" />}>
          <Plus className="size-4" />
          Nova congregação
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cidade/UF</TableHead>
              <TableHead>Pastor responsável</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {congregacoes.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {c.nome}
                    {c.matriz && <Badge variant="secondary">Sede</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  {[c.cidade, c.uf].filter(Boolean).join(" / ") || "—"}
                </TableCell>
                <TableCell>{c.pastorResponsavel || "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Editar"
                      nativeButton={false}
                      render={<Link href={`/congregacoes/editar?id=${c.id}`} />}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <DeleteButton
                      action={() => deleteCongregacao(c.id)}
                      title={`Excluir "${c.nome}"?`}
                      description="Esta ação não pode ser desfeita. A congregação só pode ser excluída se não houver membros vinculados a ela."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && congregacoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nenhuma congregação cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function CongregacoesPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <CongregacoesContent />
    </AuthGuard>
  );
}
