import Link from "next/link";
import { Plus, Pencil, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLE_LABELS, type Role } from "@/lib/auth";
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

export default async function UsuariosPage() {
  await requireRole(["ADMIN"]);

  const usuarios = await prisma.user.findMany({
    orderBy: { nome: "asc" },
    include: { congregacao: true },
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
              render={<Link href="/configuracoes" />}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-2xl font-semibold">Usuários</h1>
          </div>
          <p className="text-muted-foreground">Contas de acesso ao sistema.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/configuracoes/usuarios/novo" />}>
          <Plus className="size-4" />
          Novo usuário
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Congregação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.nome}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{ROLE_LABELS[u.role as Role]}</TableCell>
                <TableCell>{u.congregacao?.nome ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={u.ativo ? "secondary" : "outline"}>
                    {u.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Editar"
                      nativeButton={false}
                      render={<Link href={`/configuracoes/usuarios/${u.id}`} />}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
