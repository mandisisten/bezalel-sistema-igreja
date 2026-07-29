"use client";

import Link from "next/link";
import { Plus, Pencil, GraduationCap } from "lucide-react";
import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/lib/firebase-auth";
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
import { deleteCurso, type CursoInput } from "./actions";
import type { ConclusaoInput } from "./conclusoes/actions";

function CursosContent() {
  const { profile } = useAuth();
  const canManage = profile?.role === "ADMIN" || profile?.role === "SECRETARIA";
  const { data: cursos, loading } = useCollectionData<CursoInput>("cursos", [
    orderBy("nome", "asc"),
  ]);
  const { data: conclusoes } = useCollectionData<ConclusaoInput>("cursoConclusoes", []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cursos</h1>
          <p className="text-muted-foreground">Catálogo de cursos oferecidos pela igreja.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href="/cursos/conclusoes" />}>
            <GraduationCap className="size-4" />
            Conclusões
          </Button>
          {canManage && (
            <Button nativeButton={false} render={<Link href="/cursos/novo" />}>
              <Plus className="size-4" />
              Novo curso
            </Button>
          )}
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
                <TableCell>{conclusoes.filter((cc) => cc.cursoId === c.id).length}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Editar"
                        nativeButton={false}
                        render={<Link href={`/cursos/editar?id=${c.id}`} />}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    )}
                    {profile?.role === "ADMIN" && (
                      <DeleteButton
                        action={() => deleteCurso(c.id)}
                        title={`Excluir "${c.nome}"?`}
                        description="Esta ação não pode ser desfeita. O curso só pode ser excluído se não houver conclusões vinculadas."
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && cursos.length === 0 && (
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

export default function CursosPage() {
  return (
    <AuthGuard>
      <CursosContent />
    </AuthGuard>
  );
}
