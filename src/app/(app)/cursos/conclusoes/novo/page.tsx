"use client";

import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData } from "@/lib/firestore-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConclusaoForm } from "../conclusao-form";
import { createConclusao } from "../actions";
import type { CursoInput } from "../../actions";
import type { MembroInput } from "../../../membros/actions";

function NovaConclusaoContent() {
  const { data: membros } = useCollectionData<MembroInput>("membros", [
    orderBy("nomeCompleto", "asc"),
  ]);
  const { data: todosCursos } = useCollectionData<CursoInput>("cursos", [orderBy("nome", "asc")]);
  const cursos = todosCursos.filter((c) => c.ativo);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nova conclusão de curso</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de conclusão</CardTitle>
        </CardHeader>
        <CardContent>
          <ConclusaoForm action={createConclusao} membros={membros} cursos={cursos} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function NovaConclusaoPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA"]}>
      <NovaConclusaoContent />
    </AuthGuard>
  );
}
