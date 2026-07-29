"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useDocData } from "@/lib/firestore-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CargoForm } from "../cargo-form";
import { updateCargo, type CargoInput } from "../actions";

function EditarCargoContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { data: cargo, loading } = useDocData<CargoInput>(`cargos/${id}`);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!cargo) return <p className="text-muted-foreground">Cargo não encontrado.</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar cargo</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Dados do cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <CargoForm
            action={(formData) => updateCargo(id, formData)}
            defaultValues={{ nome: cargo.nome, ordem: cargo.ordem, ativo: cargo.ativo }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditarCargoPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <EditarCargoContent />
      </Suspense>
    </AuthGuard>
  );
}
