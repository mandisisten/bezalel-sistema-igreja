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
import { gerarCartaRecomendacao } from "@/lib/pdf-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/shared/delete-button";
import { deleteCartaRecomendacao, type CartaRecomendacaoInput } from "./actions";

function CartasRecomendacaoContent() {
  const { profile, user } = useAuth();
  const canManage = profile?.role === "ADMIN" || profile?.role === "SECRETARIA" || profile?.role === "LIDERANCA";
  const { configuracao } = useConfiguracao();
  const { data: cartas, loading } = useCollectionData<CartaRecomendacaoInput>("cartasRecomendacao", [
    orderBy("data", "desc"),
  ]);
  const [gerandoId, setGerandoId] = useState<string | null>(null);

  async function handleGerarPdf(carta: WithId<CartaRecomendacaoInput>) {
    if (!user || !profile) return;
    setGerandoId(carta.id);
    try {
      await gerarCartaRecomendacao(carta, configuracao, { uid: user.uid, nome: profile.nome });
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
          <h1 className="text-2xl font-semibold">Cartas de Recomendação</h1>
          <p className="text-muted-foreground">{cartas.length} carta(s) emitida(s).</p>
        </div>
        {canManage && (
          <Button nativeButton={false} render={<Link href="/cartas/recomendacao/novo" />}>
            <Plus className="size-4" />
            Nova carta
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Destinatário</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-32 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartas.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.membroNome ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{c.tipo === "OBREIRO" ? "Obreiro" : "Membro"}</Badge>
                </TableCell>
                <TableCell>{c.destinatario || "—"}</TableCell>
                <TableCell>{formatTimestamp(c.data)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={gerandoId === c.id}
                        onClick={() => handleGerarPdf(c)}
                      >
                        <FileDown className="size-4" />
                        {gerandoId === c.id ? "Gerando..." : "PDF"}
                      </Button>
                    )}
                    {profile?.role === "ADMIN" && (
                      <DeleteButton
                        action={() => deleteCartaRecomendacao(c.id)}
                        title="Excluir carta de recomendação?"
                        description="Esta ação não pode ser desfeita."
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && cartas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma carta emitida.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function CartasRecomendacaoPage() {
  return (
    <AuthGuard>
      <CartasRecomendacaoContent />
    </AuthGuard>
  );
}
