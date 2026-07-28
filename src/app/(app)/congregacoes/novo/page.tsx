import { requireRole } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CongregacaoForm } from "../congregacao-form";
import { createCongregacao } from "../actions";

export default async function NovaCongregacaoPage() {
  await requireRole(["ADMIN"]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nova congregação</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Dados da congregação</CardTitle>
        </CardHeader>
        <CardContent>
          <CongregacaoForm action={createCongregacao} />
        </CardContent>
      </Card>
    </div>
  );
}
