"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData, useDocData } from "@/lib/firestore-hooks";
import { toDateInputValue } from "@/lib/firestore-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatismoForm } from "../batismo-form";
import { updateBatismo, type BatismoInput } from "../actions";
import type { CongregacaoInput } from "../../congregacoes/actions";
import type { MembroInput } from "../../membros/actions";

function EditarBatismoContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { data: batismo, loading } = useDocData<BatismoInput>(`batismos/${id}`);
  const { data: membros } = useCollectionData<MembroInput>("membros", [
    orderBy("nomeCompleto", "asc"),
  ]);
  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!batismo) return <p className="text-muted-foreground">Batismo não encontrado.</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar batismo</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de batismo</CardTitle>
        </CardHeader>
        <CardContent>
          <BatismoForm
            action={(formData) => updateBatismo(id, formData)}
            membros={membros}
            congregacoes={congregacoes}
            defaultValues={{
              membroId: batismo.membroId,
              data: toDateInputValue(batismo.data),
              local: batismo.local,
              oficiante: batismo.oficiante,
              testemunhas: batismo.testemunhas,
              congregacaoId: batismo.congregacaoId,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditarBatismoPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA"]}>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <EditarBatismoContent />
      </Suspense>
    </AuthGuard>
  );
}
