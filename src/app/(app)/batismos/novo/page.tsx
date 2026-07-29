"use client";

import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData } from "@/lib/firestore-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatismoForm } from "../batismo-form";
import { createBatismo } from "../actions";
import type { CongregacaoInput } from "../../congregacoes/actions";
import type { MembroInput } from "../../membros/actions";

function NovoBatismoContent() {
  const { data: membros } = useCollectionData<MembroInput>("membros", [
    orderBy("nomeCompleto", "asc"),
  ]);
  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Novo batismo</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de batismo</CardTitle>
        </CardHeader>
        <CardContent>
          <BatismoForm action={createBatismo} membros={membros} congregacoes={congregacoes} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function NovoBatismoPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA"]}>
      <NovoBatismoContent />
    </AuthGuard>
  );
}
