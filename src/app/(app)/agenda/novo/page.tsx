import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventoForm } from "../evento-form";
import { createEvento } from "../actions";

export default async function NovoEventoPage() {
  await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);

  const [membros, congregacoes] = await Promise.all([
    prisma.membro.findMany({ orderBy: { nomeCompleto: "asc" }, select: { id: true, nomeCompleto: true } }),
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Novo evento</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados do evento</CardTitle>
        </CardHeader>
        <CardContent>
          <EventoForm action={createEvento} membros={membros} congregacoes={congregacoes} />
        </CardContent>
      </Card>
    </div>
  );
}
