import { requireRole } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CargoForm } from "../cargo-form";
import { createCargo } from "../actions";

export default async function NovoCargoPage() {
  await requireRole(["ADMIN"]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Novo cargo</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Dados do cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <CargoForm action={createCargo} />
        </CardContent>
      </Card>
    </div>
  );
}
