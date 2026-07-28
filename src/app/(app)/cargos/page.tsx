import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
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
import { deleteCargo } from "./actions";

export default async function CargosPage() {
  await requireRole(["ADMIN"]);

  const cargos = await prisma.cargo.findMany({
    orderBy: { ordem: "asc" },
    include: { _count: { select: { membros: true } } },
  });

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
              <TableHead>Membros</TableHead>
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
                <TableCell>{cargo._count.membros}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Editar"
                      nativeButton={false}
                      render={<Link href={`/cargos/${cargo.id}`} />}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <DeleteButton
                      action={deleteCargo.bind(null, cargo.id)}
                      title={`Excluir "${cargo.nome}"?`}
                      description="Esta ação não pode ser desfeita. O cargo só pode ser excluído se não houver membros vinculados a ele."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {cargos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
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
