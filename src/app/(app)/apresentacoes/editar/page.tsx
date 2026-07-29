"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData, useDocData } from "@/lib/firestore-hooks";
import { toDateInputValue } from "@/lib/firestore-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApresentacaoForm } from "../apresentacao-form";
import { updateApresentacao, type ApresentacaoInput } from "../actions";
import type { CongregacaoInput } from "../../congregacoes/actions";
import type { MembroInput } from "../../membros/actions";

function EditarApresentacaoContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { data: apresentacao, loading } = useDocData<ApresentacaoInput>(`apresentacoes/${id}`);
  const { data: membros } = useCollectionData<MembroInput>("membros", [
    orderBy("nomeCompleto", "asc"),
  ]);
  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!apresentacao) return <p className="text-muted-foreground">Apresentação não encontrada.</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar apresentação</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de apresentação</CardTitle>
        </CardHeader>
        <CardContent>
          <ApresentacaoForm
            action={(formData) => updateApresentacao(id, formData)}
            membros={membros}
            congregacoes={congregacoes}
            defaultValues={{
              nomeCrianca: apresentacao.nomeCrianca,
              dataNascimento: toDateInputValue(apresentacao.dataNascimento),
              nomePai: apresentacao.nomePai,
              nomeMae: apresentacao.nomeMae,
              data: toDateInputValue(apresentacao.data),
              oficiante: apresentacao.oficiante,
              congregacaoId: apresentacao.congregacaoId,
              responsavelId: apresentacao.responsavelId,
              observacoes: apresentacao.observacoes,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditarApresentacaoPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA"]}>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <EditarApresentacaoContent />
      </Suspense>
    </AuthGuard>
  );
}
