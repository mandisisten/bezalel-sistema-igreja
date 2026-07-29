"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData, useDocData } from "@/lib/firestore-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "../user-form";
import { updateUsuario, type UsuarioInput } from "../actions";
import type { CongregacaoInput } from "../../../congregacoes/actions";

function EditarUsuarioContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { data: usuario, loading } = useDocData<UsuarioInput>(`usuarios/${id}`);
  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!usuario) return <p className="text-muted-foreground">Usuário não encontrado.</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar usuário</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{usuario.email}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm
            action={(formData) => updateUsuario(id, formData)}
            congregacoes={congregacoes}
            mode="edit"
            defaultValues={{
              nome: usuario.nome,
              email: usuario.email,
              role: usuario.role,
              congregacaoId: usuario.congregacaoId,
              ativo: usuario.ativo,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditarUsuarioPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <EditarUsuarioContent />
      </Suspense>
    </AuthGuard>
  );
}
