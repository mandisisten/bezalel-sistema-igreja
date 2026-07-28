import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CargoForm } from "../cargo-form";
import { updateCargo } from "../actions";

export default async function EditarCargoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { id } = await params;

  const cargo = await prisma.cargo.findUnique({ where: { id: Number(id) } });
  if (!cargo) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar cargo</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Dados do cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <CargoForm
            action={updateCargo.bind(null, cargo.id)}
            defaultValues={{ nome: cargo.nome, ordem: cargo.ordem, ativo: cargo.ativo }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
