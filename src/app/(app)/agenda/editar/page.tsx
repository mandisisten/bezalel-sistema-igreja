"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData, useDocData } from "@/lib/firestore-hooks";
import { toDateTimeInputValue } from "@/lib/firestore-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventoForm } from "../evento-form";
import { updateEvento, deleteEvento, type EventoInput } from "../actions";
import { EventoDeleteButton } from "./evento-delete-button";
import type { CongregacaoInput } from "../../congregacoes/actions";
import type { MembroInput } from "../../membros/actions";

function EditarEventoContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { data: evento, loading } = useDocData<EventoInput>(`eventos/${id}`);
  const { data: membros } = useCollectionData<MembroInput>("membros", [
    orderBy("nomeCompleto", "asc"),
  ]);
  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!evento) return <p className="text-muted-foreground">Evento não encontrado.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar evento</h1>
        <EventoDeleteButton action={() => deleteEvento(id)} titulo={evento.titulo} />
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados do evento</CardTitle>
        </CardHeader>
        <CardContent>
          <EventoForm
            action={(formData) => updateEvento(id, formData)}
            membros={membros}
            congregacoes={congregacoes}
            defaultValues={{
              titulo: evento.titulo,
              descricao: evento.descricao,
              inicio: toDateTimeInputValue(evento.inicio),
              fim: toDateTimeInputValue(evento.fim),
              local: evento.local,
              tipo: evento.tipo,
              congregacaoId: evento.congregacaoId,
              responsavelId: evento.responsavelId,
              recorrencia: evento.recorrencia,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditarEventoPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA", "LIDERANCA"]}>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <EditarEventoContent />
      </Suspense>
    </AuthGuard>
  );
}
