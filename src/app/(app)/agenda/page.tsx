"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { orderBy } from "firebase/firestore";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/lib/firebase-auth";
import { useCollectionData } from "@/lib/firestore-hooks";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarView } from "./calendar-view";
import type { EventoInput } from "./actions";
import type { CongregacaoInput } from "../congregacoes/actions";

function AgendaContent() {
  const { profile } = useAuth();
  const canManage = profile?.role === "ADMIN" || profile?.role === "SECRETARIA" || profile?.role === "LIDERANCA";
  const router = useRouter();
  const searchParams = useSearchParams();
  const congregacaoId = searchParams.get("congregacaoId") ?? "";

  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);
  const { data: todosEventos } = useCollectionData<EventoInput>("eventos", [orderBy("inicio", "asc")]);

  const eventos = useMemo(
    () => (congregacaoId ? todosEventos.filter((e) => e.congregacaoId === congregacaoId) : todosEventos),
    [todosEventos, congregacaoId],
  );

  function handleFiltrar(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("congregacaoId", value);
    else params.delete("congregacaoId");
    router.push(`/agenda?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agenda</h1>
          <p className="text-muted-foreground">{eventos.length} evento(s).</p>
        </div>
        {canManage && (
          <Button nativeButton={false} render={<Link href="/agenda/novo" />}>
            <Plus className="size-4" />
            Novo evento
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Select
          items={Object.fromEntries(congregacoes.map((c) => [c.id, c.nome]))}
          value={congregacaoId || undefined}
          onValueChange={(value) => handleFiltrar(String(value ?? ""))}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Todas as congregações" />
          </SelectTrigger>
          <SelectContent>
            {congregacoes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {congregacaoId && (
          <Button variant="ghost" onClick={() => handleFiltrar("")}>
            Limpar
          </Button>
        )}
      </div>

      <CalendarView
        eventos={eventos.map((e) => ({
          id: e.id,
          titulo: e.titulo,
          tipo: e.tipo,
          inicio: e.inicio.toDate(),
          fim: e.fim.toDate(),
        }))}
      />
    </div>
  );
}

export default function AgendaPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <AgendaContent />
      </Suspense>
    </AuthGuard>
  );
}
