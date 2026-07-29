"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { orderBy } from "firebase/firestore";
import { toast } from "sonner";
import { IdCard } from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/lib/firebase-auth";
import { useCollectionData, useDocData, useConfiguracao } from "@/lib/firestore-hooks";
import { toDateInputValue, formatTimestamp } from "@/lib/firestore-utils";
import { gerarCarteirinha } from "@/lib/pdf-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MembroForm } from "../membro-form";
import { updateMembro, deleteMembro, type MembroInput } from "../actions";
import { MembroDeleteButton } from "./membro-delete-button";
import type { CongregacaoInput } from "../../congregacoes/actions";
import type { CargoInput } from "../../cargos/actions";

type CargoHistoricoItem = {
  cargoNome: string | null;
  congregacaoNome: string | null;
  dataInicio: import("firebase/firestore").Timestamp;
  dataFim: import("firebase/firestore").Timestamp | null;
};

function EditarMembroContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { profile, user } = useAuth();
  const { configuracao } = useConfiguracao();
  const [gerandoCarteirinha, setGerandoCarteirinha] = useState(false);

  const { data: membro, loading } = useDocData<MembroInput>(`membros/${id}`);
  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);
  const { data: todosCargos } = useCollectionData<CargoInput>("cargos", [orderBy("ordem", "asc")]);
  const cargos = todosCargos.filter((c) => c.ativo);
  const { data: historico } = useCollectionData<CargoHistoricoItem>(
    `membros/${id}/cargoHistorico`,
    [orderBy("dataInicio", "desc")],
    [id],
  );

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!membro) return <p className="text-muted-foreground">Membro não encontrado.</p>;

  async function handleEmitirCarteirinha() {
    if (!user || !profile || !membro) return;
    setGerandoCarteirinha(true);
    try {
      await gerarCarteirinha(membro, configuracao, { uid: user.uid, nome: profile.nome });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar carteirinha.");
    } finally {
      setGerandoCarteirinha(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{membro.nomeCompleto}</h1>
        <div className="flex gap-2">
          <Button variant="outline" disabled={gerandoCarteirinha} onClick={handleEmitirCarteirinha}>
            <IdCard className="size-4" />
            {gerandoCarteirinha ? "Gerando..." : "Emitir carteirinha"}
          </Button>
          {profile?.role === "ADMIN" && (
            <MembroDeleteButton action={() => deleteMembro(id)} nome={membro.nomeCompleto} />
          )}
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Editar cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <MembroForm
            action={(formData) => updateMembro(id, formData)}
            congregacoes={congregacoes}
            cargos={cargos}
            defaultValues={{
              nomeCompleto: membro.nomeCompleto,
              apelido: membro.apelido ?? null,
              fotoUrl: membro.fotoUrl ?? null,
              dataNascimento: toDateInputValue(membro.dataNascimento),
              sexo: membro.sexo ?? null,
              estadoCivil: membro.estadoCivil ?? null,
              naturalidade: membro.naturalidade ?? null,
              nacionalidade: membro.nacionalidade ?? null,
              rg: membro.rg ?? null,
              cpf: membro.cpf ?? null,
              cep: membro.cep ?? null,
              endereco: membro.endereco ?? null,
              numeroCasa: membro.numeroCasa ?? null,
              bairro: membro.bairro ?? null,
              cidade: membro.cidade ?? null,
              uf: membro.uf ?? null,
              telefone: membro.telefone ?? null,
              celular: membro.celular ?? null,
              email: membro.email ?? null,
              profissao: membro.profissao ?? null,
              escolaridade: membro.escolaridade ?? null,
              nomeConjuge: membro.nomeConjuge ?? null,
              nomePai: membro.nomePai ?? null,
              nomeMae: membro.nomeMae ?? null,
              dataConversao: toDateInputValue(membro.dataConversao),
              dataAdmissao: toDateInputValue(membro.dataAdmissao),
              formaAdmissao: membro.formaAdmissao ?? null,
              congregacaoId: membro.congregacaoId,
              cargoId: membro.cargoId ?? null,
              status: membro.status,
              dataSaida: toDateInputValue(membro.dataSaida),
              motivoSaida: membro.motivoSaida ?? null,
              observacoes: membro.observacoes ?? null,
            }}
          />
        </CardContent>
      </Card>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Histórico de cargos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cargo</TableHead>
                <TableHead>Congregação</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historico.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.cargoNome ?? "—"}</TableCell>
                  <TableCell>{h.congregacaoNome ?? "—"}</TableCell>
                  <TableCell>{formatTimestamp(h.dataInicio)}</TableCell>
                  <TableCell>{h.dataFim ? formatTimestamp(h.dataFim) : "Atual"}</TableCell>
                </TableRow>
              ))}
              {historico.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhum histórico de cargo registrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditarMembroPage() {
  return (
    <AuthGuard roles={["ADMIN", "SECRETARIA", "LIDERANCA"]}>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <EditarMembroContent />
      </Suspense>
    </AuthGuard>
  );
}
