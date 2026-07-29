"use client";

import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData } from "@/lib/firestore-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartaRecomendacaoForm } from "../carta-form";
import { createCartaRecomendacao } from "../actions";
import type { MembroInput } from "../../../membros/actions";

function NovaCartaRecomendacaoContent() {
  const { data: membros } = useCollectionData<MembroInput>("membros", [
    orderBy("nomeCompleto", "asc"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nova carta de recomendação</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados da carta</CardTitle>
        </CardHeader>
        <CardContent>
          <CartaRecomendacaoForm action={createCartaRecomendacao} membros={membros} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function NovaCartaRecomendacaoPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA", "LIDERANCA"]}>
      <NovaCartaRecomendacaoContent />
    </AuthGuard>
  );
}
