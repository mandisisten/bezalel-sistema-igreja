import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarView } from "./calendar-view";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ congregacaoId?: string }>;
}) {
  await requireUser();
  const params = await searchParams;

  const congregacoes = await prisma.congregacao.findMany({ orderBy: { nome: "asc" } });

  const eventos = await prisma.eventoAgenda.findMany({
    where: params.congregacaoId ? { congregacaoId: Number(params.congregacaoId) } : undefined,
    orderBy: { inicio: "asc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agenda</h1>
          <p className="text-muted-foreground">{eventos.length} evento(s).</p>
        </div>
        <Button nativeButton={false} render={<Link href="/agenda/novo" />}>
          <Plus className="size-4" />
          Novo evento
        </Button>
      </div>

      <form className="flex gap-2" method="get">
        <Select
          name="congregacaoId"
          items={Object.fromEntries(congregacoes.map((c) => [String(c.id), c.nome]))}
          defaultValue={params.congregacaoId}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Todas as congregações" />
          </SelectTrigger>
          <SelectContent>
            {congregacoes.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
        {params.congregacaoId && (
          <Button variant="ghost" nativeButton={false} render={<Link href="/agenda" />}>
            Limpar
          </Button>
        )}
      </form>

      <CalendarView
        eventos={eventos.map((e) => ({
          id: e.id,
          titulo: e.titulo,
          tipo: e.tipo,
          inicio: e.inicio,
          fim: e.fim,
        }))}
      />
    </div>
  );
}
