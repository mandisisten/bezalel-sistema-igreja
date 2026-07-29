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
import { gerarCertificadoBatismo } from "@/lib/pdf-client";
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
import { deleteBatismo, type BatismoInput } from "./actions";

function BatismosContent() {
  const { profile, user } = useAuth();
  const canManage = profile?.role === "ADMIN" || profile?.role === "SECRETARIA";
  const { configuracao } = useConfiguracao();
  const { data: batismos, loading } = useCollectionData<BatismoInput>("batismos", [
    orderBy("data", "desc"),
  ]);
  const [gerandoId, setGerandoId] = useState<string | null>(null);

  async function handleCertificado(batismo: WithId<BatismoInput>) {
    if (!user || !profile) return;
    setGerandoId(batismo.id);
    try {
      await gerarCertificadoBatismo(batismo, configuracao, { uid: user.uid, nome: profile.nome });
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
          <h1 className="text-2xl font-semibold">Batismos</h1>
          <p className="text-muted-foreground">{batismos.length} registro(s).</p>
        </div>
        {canManage && (
          <Button nativeButton={false} render={<Link href="/batismos/novo" />}>
            <Plus className="size-4" />
            Novo batismo
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Oficiante</TableHead>
              <TableHead>Congregação</TableHead>
              <TableHead className="w-40 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batismos.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.membroNome ?? "—"}</TableCell>
                <TableCell>{formatTimestamp(b.data)}</TableCell>
                <TableCell>{b.local || "—"}</TableCell>
                <TableCell>{b.oficiante || "—"}</TableCell>
                <TableCell>{b.congregacaoNome ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={gerandoId === b.id}
                      onClick={() => handleCertificado(b)}
                    >
                      <FileDown className="size-4" />
                      {gerandoId === b.id ? "Gerando..." : "Certificado"}
                    </Button>
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/batismos/editar?id=${b.id}`} />}
                      >
                        Editar
                      </Button>
                    )}
                    {profile?.role === "ADMIN" && (
                      <DeleteButton
                        action={() => deleteBatismo(b.id)}
                        title="Excluir registro de batismo?"
                        description="Esta ação não pode ser desfeita."
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && batismos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum batismo registrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function BatismosPage() {
  return (
    <AuthGuard>
      <BatismosContent />
    </AuthGuard>
  );
}
