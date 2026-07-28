import { requireRole } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CursoForm } from "../curso-form";
import { createCurso } from "../actions";

export default async function NovoCursoPage() {
  await requireRole(["ADMIN", "SECRETARIA"]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Novo curso</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Dados do curso</CardTitle>
        </CardHeader>
        <CardContent>
          <CursoForm action={createCurso} />
        </CardContent>
      </Card>
    </div>
  );
}
