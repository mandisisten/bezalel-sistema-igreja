"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useDocData } from "@/lib/firestore-hooks";
import { toDateInputValue } from "@/lib/firestore-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CongregacaoForm } from "../congregacao-form";
import { updateCongregacao, type CongregacaoInput } from "../actions";

function EditarCongregacaoContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { data: congregacao, loading } = useDocData<CongregacaoInput & { dataFundacao: import("firebase/firestore").Timestamp | null }>(
    `congregacoes/${id}`,
  );

  if (loading) {
    return <p className="text-muted-foreground">Carregando...</p>;
  }

  if (!congregacao) {
    return <p className="text-muted-foreground">Congregação não encontrada.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar congregação</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Dados da congregação</CardTitle>
        </CardHeader>
        <CardContent>
          <CongregacaoForm
            action={(formData) => updateCongregacao(id, formData)}
            defaultValues={{
              nome: congregacao.nome,
              matriz: congregacao.matriz,
              endereco: congregacao.endereco ?? null,
              cidade: congregacao.cidade ?? null,
              uf: congregacao.uf ?? null,
              telefone: congregacao.telefone ?? null,
              pastorResponsavel: congregacao.pastorResponsavel ?? null,
              dataFundacao: toDateInputValue(congregacao.dataFundacao),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditarCongregacaoPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <EditarCongregacaoContent />
      </Suspense>
    </AuthGuard>
  );
}
