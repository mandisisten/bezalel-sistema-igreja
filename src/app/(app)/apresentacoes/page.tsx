"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileDown } from "lucide-react";
import { orderBy } from "firebase/firestore";
import { toast } from "sonner";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/lib/firebase-auth";
import { useCollectionData, useConfiguracao, type WithId } from "@/lib/firestore-hooks";
import { formatTimestamp } from "@/lib/firestore-utils";
import { gerarCertificadoApresentacao } from "@/lib/pdf-client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/shared/delete-button";
import { deleteApresentacao, type ApresentacaoInput } from "./actions";

function ApresentacoesContent() {
  const { profile, user } = useAuth();
  const canManage = profile?.role === "ADMIN" || profile?.role === "SECRETARIA";
  const { configuracao } = useConfiguracao();
  const { data: apresentacoes, loading } = useCollectionData<ApresentacaoInput>("apresentacoes", [
    orderBy("data", "desc"),
  ]);
  const [gerandoId, setGerandoId] = useState<string | null>(null);

  async function handleCertificado(apresentacao: WithId<ApresentacaoInput>) {
    if (!user || !profile) return;
    setGerandoId(apresentacao.id);
    try {
      await gerarCertificadoApresentacao(apresentacao, configuracao, { uid: user.uid, nome: profile.nome });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar PDF.");
    } finally {
      setGerandoId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Apresentação de Crianças</h1>
          <p className="text-muted-foreground">{apresentacoes.length} registro(s).</p>
        </div>
        {canManage && (
          <Button nativeButton={false} render={<Link href="/apresentacoes/novo" />}>
            <Plus className="size-4" />
            Nova apresentação
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Criança</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Congregação</TableHead>
              <TableHead className="w-40 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apresentacoes.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.nomeCrianca}</TableCell>
                <TableCell>{formatTimestamp(a.data)}</TableCell>
                <TableCell>{a.responsavelNome ?? "—"}</TableCell>
                <TableCell>{a.congregacaoNome ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={gerandoId === a.id}
                      onClick={() => handleCertificado(a)}
                    >
                      <FileDown className="size-4" />
                      {gerandoId === a.id ? "Gerando..." : "Certificado"}
                    </Button>
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/apresentacoes/editar?id=${a.id}`} />}
                      >
                        Editar
                      </Button>
                    )}
                    {profile?.role === "ADMIN" && (
                      <DeleteButton
                        action={() => deleteApresentacao(a.id)}
                        title="Excluir registro de apresentação?"
                        description="Esta ação não pode ser desfeita."
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && apresentacoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma apresentação registrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ApresentacoesPage() {
  return (
    <AuthGuard>
      <ApresentacoesContent />
    </AuthGuard>
  );
}
