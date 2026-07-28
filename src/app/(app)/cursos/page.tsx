import Link from "next/link";
import { Plus, Pencil, GraduationCap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
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
import { deleteCurso } from "./actions";

export default async function CursosPage() {
  await requireUser();

  const cursos = await prisma.curso.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { conclusoes: true } } },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cursos</h1>
          <p className="text-muted-foreground">Catálogo de cursos oferecidos pela igreja.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/cursos/conclusoes" />}
          >
            <GraduationCap className="size-4" />
            Conclusões
          </Button>
          <Button nativeButton={false} render={<Link href="/cursos/novo" />}>
            <Plus className="size-4" />
            Novo curso
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Carga horária</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Concluintes</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cursos.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell>{c.cargaHoraria ? `${c.cargaHoraria}h` : "—"}</TableCell>
                <TableCell>
                  <Badge variant={c.ativo ? "secondary" : "outline"}>
                    {c.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>{c._count.conclusoes}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Editar"
                      nativeButton={false}
                      render={<Link href={`/cursos/${c.id}`} />}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <DeleteButton
                      action={deleteCurso.bind(null, c.id)}
                      title={`Excluir "${c.nome}"?`}
                      description="Esta ação não pode ser desfeita. O curso só pode ser excluído se não houver conclusões vinculadas."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {cursos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum curso cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
