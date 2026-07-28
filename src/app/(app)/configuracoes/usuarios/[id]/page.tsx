import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "../user-form";
import { updateUser } from "../actions";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { id } = await params;

  const [usuario, congregacoes] = await Promise.all([
    prisma.user.findUnique({ where: { id: Number(id) } }),
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!usuario) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar usuário</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{usuario.email}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm
            action={updateUser.bind(null, usuario.id)}
            congregacoes={congregacoes}
            mode="edit"
            defaultValues={{
              nome: usuario.nome,
              role: usuario.role,
              congregacaoId: usuario.congregacaoId,
              ativo: usuario.ativo,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
