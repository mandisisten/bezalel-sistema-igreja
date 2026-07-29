"use client";

import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData } from "@/lib/firestore-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "../user-form";
import { createUsuario } from "../actions";
import type { CongregacaoInput } from "../../../congregacoes/actions";

function NovoUsuarioContent() {
  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Novo usuário</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Dados de acesso</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm action={createUsuario} congregacoes={congregacoes} mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function NovoUsuarioPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <NovoUsuarioContent />
    </AuthGuard>
  );
}
