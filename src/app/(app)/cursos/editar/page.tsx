"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useDocData } from "@/lib/firestore-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CursoForm } from "../curso-form";
import { updateCurso, type CursoInput } from "../actions";

function EditarCursoContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { data: curso, loading } = useDocData<CursoInput>(`cursos/${id}`);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!curso) return <p className="text-muted-foreground">Curso não encontrado.</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar curso</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Dados do curso</CardTitle>
        </CardHeader>
        <CardContent>
          <CursoForm
            action={(formData) => updateCurso(id, formData)}
            defaultValues={{
              nome: curso.nome,
              cargaHoraria: curso.cargaHoraria,
              descricao: curso.descricao,
              ativo: curso.ativo,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditarCursoPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA"]}>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <EditarCursoContent />
      </Suspense>
    </AuthGuard>
  );
}
