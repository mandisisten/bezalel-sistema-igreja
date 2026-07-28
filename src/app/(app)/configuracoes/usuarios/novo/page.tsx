import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "../user-form";
import { createUser } from "../actions";

export default async function NovoUsuarioPage() {
  await requireRole(["ADMIN"]);

  const congregacoes = await prisma.congregacao.findMany({ orderBy: { nome: "asc" } });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Novo usuário</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Dados de acesso</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm action={createUser} congregacoes={congregacoes} mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
