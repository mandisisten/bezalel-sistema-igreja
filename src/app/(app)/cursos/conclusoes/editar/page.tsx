"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData, useDocData } from "@/lib/firestore-hooks";
import { toDateInputValue } from "@/lib/firestore-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConclusaoForm } from "../conclusao-form";
import { updateConclusao, type ConclusaoInput } from "../actions";
import type { CursoInput } from "../../actions";
import type { MembroInput } from "../../../membros/actions";

function EditarConclusaoContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { data: conclusao, loading } = useDocData<ConclusaoInput>(`cursoConclusoes/${id}`);
  const { data: membros } = useCollectionData<MembroInput>("membros", [
    orderBy("nomeCompleto", "asc"),
  ]);
  const { data: cursos } = useCollectionData<CursoInput>("cursos", [orderBy("nome", "asc")]);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!conclusao) return <p className="text-muted-foreground">Conclusão não encontrada.</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar conclusão de curso</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de conclusão</CardTitle>
        </CardHeader>
        <CardContent>
          <ConclusaoForm
            action={(formData) => updateConclusao(id, formData)}
            membros={membros}
            cursos={cursos}
            defaultValues={{
              cursoId: conclusao.cursoId,
              membroId: conclusao.membroId,
              dataConclusao: toDateInputValue(conclusao.dataConclusao),
              instrutor: conclusao.instrutor,
              nota: conclusao.nota,
              observacoes: conclusao.observacoes,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditarConclusaoPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA"]}>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <EditarConclusaoContent />
      </Suspense>
    </AuthGuard>
  );
}
