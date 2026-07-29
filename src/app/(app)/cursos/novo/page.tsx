"use client";

import { AuthGuard } from "@/components/layout/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CursoForm } from "../curso-form";
import { createCurso } from "../actions";

export default function NovoCursoPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA"]}>
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
    </AuthGuard>
  );
}
