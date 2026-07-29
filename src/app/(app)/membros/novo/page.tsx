"use client";

import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData } from "@/lib/firestore-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MembroForm } from "../membro-form";
import { createMembro } from "../actions";
import type { CongregacaoInput } from "../../congregacoes/actions";
import type { CargoInput } from "../../cargos/actions";

function NovoMembroContent() {
  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);
  const { data: todosCargos } = useCollectionData<CargoInput>("cargos", [orderBy("ordem", "asc")]);
  const cargos = todosCargos.filter((c) => c.ativo);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Novo membro</h1>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Cadastro de membro</CardTitle>
        </CardHeader>
        <CardContent>
          <MembroForm action={createMembro} congregacoes={congregacoes} cargos={cargos} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function NovoMembroPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA"]}>
      <NovoMembroContent />
    </AuthGuard>
  );
}
