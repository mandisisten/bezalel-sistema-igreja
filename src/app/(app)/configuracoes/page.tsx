import Link from "next/link";
import { Users } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getConfiguracao } from "@/lib/documento";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfiguracaoForm } from "./configuracao-form";

export default async function ConfiguracoesPage() {
  await requireRole(["ADMIN"]);
  const configuracao = await getConfiguracao();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Configurações</h1>
          <p className="text-muted-foreground">
            Dados usados no cabeçalho dos certificados, cartas e relatórios.
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link href="/configuracoes/usuarios" />}>
          <Users className="size-4" />
          Usuários
        </Button>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados da igreja</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfiguracaoForm
            defaultValues={{
              nomeIgreja: configuracao.nomeIgreja,
              cnpj: configuracao.cnpj,
              logoUrl: configuracao.logoUrl,
              enderecoSede: configuracao.enderecoSede,
              telefoneSede: configuracao.telefoneSede,
              nomePresidente: configuracao.nomePresidente,
              cargoPresidente: configuracao.cargoPresidente,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
