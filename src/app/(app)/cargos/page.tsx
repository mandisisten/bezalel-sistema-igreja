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
import { deleteCargo, type CargoInput } from "./actions";

function CargosContent() {
  const { data: cargos, loading } = useCollectionData<CargoInput>("cargos", [
    orderBy("ordem", "asc"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cargos</h1>
          <p className="text-muted-foreground">
            Funções eclesiásticas disponíveis para os membros.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/cargos/novo" />}>
          <Plus className="size-4" />
          Novo cargo
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargos.map((cargo) => (
              <TableRow key={cargo.id}>
                <TableCell>{cargo.ordem}</TableCell>
                <TableCell className="font-medium">{cargo.nome}</TableCell>
                <TableCell>
                  <Badge variant={cargo.ativo ? "secondary" : "outline"}>
                    {cargo.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Editar"
                      nativeButton={false}
                      render={<Link href={`/cargos/editar?id=${cargo.id}`} />}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <DeleteButton
                      action={() => deleteCargo(cargo.id)}
                      title={`Excluir "${cargo.nome}"?`}
                      description="Esta ação não pode ser desfeita. O cargo só pode ser excluído se não houver membros vinculados a ele."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && cargos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nenhum cargo cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function CargosPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <CargosContent />
    </AuthGuard>
  );
}
