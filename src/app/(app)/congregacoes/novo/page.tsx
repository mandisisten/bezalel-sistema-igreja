"use client";

import { AuthGuard } from "@/components/layout/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CongregacaoForm } from "../congregacao-form";
import { createCongregacao } from "../actions";

export default function NovaCongregacaoPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
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
    </AuthGuard>
  );
}
