"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowLeft, FileDown } from "lucide-react";
import { orderBy } from "firebase/firestore";
import { toast } from "sonner";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/lib/firebase-auth";
import { useCollectionData, useConfiguracao, type WithId } from "@/lib/firestore-hooks";
import { formatTimestamp } from "@/lib/firestore-utils";
import { gerarCertificadoCurso } from "@/lib/pdf-client";
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
import { deleteConclusao, type ConclusaoInput } from "./actions";
import type { CursoInput } from "../actions";

function ConclusoesContent() {
  const { profile, user } = useAuth();
  const canManage = profile?.role === "ADMIN" || profile?.role === "SECRETARIA";
  const { configuracao } = useConfiguracao();
  const { data: conclusoes, loading } = useCollectionData<ConclusaoInput>("cursoConclusoes", [
    orderBy("dataConclusao", "desc"),
  ]);
  const { data: cursos } = useCollectionData<CursoInput>("cursos", []);
  const [gerandoId, setGerandoId] = useState<string | null>(null);

  async function handleCertificado(conclusao: WithId<ConclusaoInput>) {
    if (!user || !profile) return;
    setGerandoId(conclusao.id);
    try {
      const curso = cursos.find((c) => c.id === conclusao.cursoId);
      await gerarCertificadoCurso(conclusao, curso?.cargaHoraria ?? null, configuracao, {
        uid: user.uid,
        nome: profile.nome,
      });
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Voltar"
              nativeButton={false}
              render={<Link href="/cursos" />}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-2xl font-semibold">Conclusões de curso</h1>
          </div>
          <p className="text-muted-foreground">{conclusoes.length} registro(s).</p>
        </div>
        {canManage && (
          <Button nativeButton={false} render={<Link href="/cursos/conclusoes/novo" />}>
            <Plus className="size-4" />
            Nova conclusão
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Conclusão</TableHead>
              <TableHead>Instrutor</TableHead>
              <TableHead className="w-40 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conclusoes.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.membroNome ?? "—"}</TableCell>
                <TableCell>{c.cursoNome ?? "—"}</TableCell>
                <TableCell>{formatTimestamp(c.dataConclusao)}</TableCell>
                <TableCell>{c.instrutor || "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={gerandoId === c.id}
                      onClick={() => handleCertificado(c)}
                    >
                      <FileDown className="size-4" />
                      {gerandoId === c.id ? "Gerando..." : "Certificado"}
                    </Button>
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/cursos/conclusoes/editar?id=${c.id}`} />}
                      >
                        Editar
                      </Button>
                    )}
                    {profile?.role === "ADMIN" && (
                      <DeleteButton
                        action={() => deleteConclusao(c.id)}
                        title="Excluir registro de conclusão?"
                        description="Esta ação não pode ser desfeita."
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && conclusoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma conclusão registrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ConclusoesPage() {
  return (
    <AuthGuard>
      <ConclusoesContent />
    </AuthGuard>
  );
}
