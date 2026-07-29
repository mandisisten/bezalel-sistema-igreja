"use client";

import { useState } from "react";
import { orderBy } from "firebase/firestore";
import { toast } from "sonner";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData, useConfiguracao } from "@/lib/firestore-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_MEMBRO_OPTIONS, toSelectItems } from "@/lib/member-options";
import { DOCUMENTO_LABELS } from "@/lib/documento-client";
import { REPORTS } from "@/lib/reports-client";
import { gerarRelatorioPdf, baixarArquivo } from "@/lib/pdf-client";
import { buildExcelBlob } from "@/lib/excel-client";
import type { CongregacaoInput } from "../congregacoes/actions";
import type { CargoInput } from "../cargos/actions";

const STATUS_ITEMS = toSelectItems(STATUS_MEMBRO_OPTIONS);
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const MES_ITEMS = Object.fromEntries(MESES.map((m, i) => [String(i + 1), m]));

function ReportActions({
  gerando,
  onGerar,
}: {
  gerando: "pdf" | "excel" | null;
  onGerar: (formato: "pdf" | "excel") => void;
}) {
  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" disabled={gerando !== null} onClick={() => onGerar("pdf")}>
        {gerando === "pdf" ? "Gerando..." : "PDF"}
      </Button>
      <Button type="button" disabled={gerando !== null} onClick={() => onGerar("excel")}>
        {gerando === "excel" ? "Gerando..." : "Excel"}
      </Button>
    </div>
  );
}

function RelatoriosContent() {
  const { configuracao } = useConfiguracao();
  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);
  const { data: cargos } = useCollectionData<CargoInput>("cargos", [orderBy("ordem", "asc")]);

  const [gerando, setGerando] = useState<string | null>(null);

  const congregacaoItems = Object.fromEntries(congregacoes.map((c) => [c.id, c.nome]));
  const cargoItems = Object.fromEntries(cargos.map((c) => [c.id, c.nome]));

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [membrosFiltro, setMembrosFiltro] = useState({ congregacaoId: "", cargoId: "", status: "" });
  const [aniversariantesMes, setAniversariantesMes] = useState(String(currentMonth));
  const [batismosRange, setBatismosRange] = useState({ inicio: "", fim: "" });
  const [apresentacoesRange, setApresentacoesRange] = useState({ inicio: "", fim: "" });
  const [cursosRange, setCursosRange] = useState({ inicio: "", fim: "" });
  const [documentosFiltro, setDocumentosFiltro] = useState({ tipo: "", inicio: "", fim: "" });
  const [movimentacaoRange, setMovimentacaoRange] = useState({ inicio: "", fim: "" });
  const [crescimentoAno, setCrescimentoAno] = useState(String(currentYear));

  async function handleGerar(key: string, formato: "pdf" | "excel", params: URLSearchParams) {
    setGerando(`${key}-${formato}`);
    try {
      const report = REPORTS[key];
      const resultado = await report.run(params);
      if (formato === "pdf") {
        await gerarRelatorioPdf(resultado, configuracao);
      } else {
        const blob = await buildExcelBlob(resultado.titulo, resultado.headers, resultado.rows);
        baixarArquivo(blob, `${key}.xlsx`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar relatório.");
    } finally {
      setGerando(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Relatórios</h1>
        <p className="text-muted-foreground">
          Gere relatórios em PDF ou Excel com os filtros desejados.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Relação geral de membros</CardTitle>
            <CardDescription>Lista completa filtrável por congregação, cargo e status.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Select
              items={congregacaoItems}
              value={membrosFiltro.congregacaoId || undefined}
              onValueChange={(v) => setMembrosFiltro((f) => ({ ...f, congregacaoId: String(v ?? "") }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas as congregações" />
              </SelectTrigger>
              <SelectContent>
                {congregacoes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              items={cargoItems}
              value={membrosFiltro.cargoId || undefined}
              onValueChange={(v) => setMembrosFiltro((f) => ({ ...f, cargoId: String(v ?? "") }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os cargos" />
              </SelectTrigger>
              <SelectContent>
                {cargos.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              items={STATUS_ITEMS}
              value={membrosFiltro.status || undefined}
              onValueChange={(v) => setMembrosFiltro((f) => ({ ...f, status: String(v ?? "") }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_MEMBRO_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ReportActions
              gerando={
                gerando === "membros-pdf" ? "pdf" : gerando === "membros-excel" ? "excel" : null
              }
              onGerar={(formato) => {
                const params = new URLSearchParams();
                if (membrosFiltro.congregacaoId) params.set("congregacaoId", membrosFiltro.congregacaoId);
                if (membrosFiltro.cargoId) params.set("cargoId", membrosFiltro.cargoId);
                if (membrosFiltro.status) params.set("status", membrosFiltro.status);
                handleGerar("membros", formato, params);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aniversariantes do mês</CardTitle>
            <CardDescription>Membros ativos aniversariantes no mês selecionado.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Select items={MES_ITEMS} value={aniversariantesMes} onValueChange={(v) => setAniversariantesMes(String(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {MESES.map((m, i) => (
                  <SelectItem key={m} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ReportActions
              gerando={
                gerando === "aniversariantes-pdf"
                  ? "pdf"
                  : gerando === "aniversariantes-excel"
                    ? "excel"
                    : null
              }
              onGerar={(formato) => {
                const params = new URLSearchParams({ mes: aniversariantesMes });
                handleGerar("aniversariantes", formato, params);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Batismos por período</CardTitle>
            <CardDescription>Registros de batismo entre duas datas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                type="date"
                value={batismosRange.inicio}
                onChange={(e) => setBatismosRange((r) => ({ ...r, inicio: e.target.value }))}
              />
              <Input
                type="date"
                value={batismosRange.fim}
                onChange={(e) => setBatismosRange((r) => ({ ...r, fim: e.target.value }))}
              />
            </div>
            <ReportActions
              gerando={gerando === "batismos-pdf" ? "pdf" : gerando === "batismos-excel" ? "excel" : null}
              onGerar={(formato) => {
                const params = new URLSearchParams();
                if (batismosRange.inicio) params.set("inicio", batismosRange.inicio);
                if (batismosRange.fim) params.set("fim", batismosRange.fim);
                handleGerar("batismos", formato, params);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Apresentações por período</CardTitle>
            <CardDescription>Crianças apresentadas entre duas datas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                type="date"
                value={apresentacoesRange.inicio}
                onChange={(e) => setApresentacoesRange((r) => ({ ...r, inicio: e.target.value }))}
              />
              <Input
                type="date"
                value={apresentacoesRange.fim}
                onChange={(e) => setApresentacoesRange((r) => ({ ...r, fim: e.target.value }))}
              />
            </div>
            <ReportActions
              gerando={
                gerando === "apresentacoes-pdf" ? "pdf" : gerando === "apresentacoes-excel" ? "excel" : null
              }
              onGerar={(formato) => {
                const params = new URLSearchParams();
                if (apresentacoesRange.inicio) params.set("inicio", apresentacoesRange.inicio);
                if (apresentacoesRange.fim) params.set("fim", apresentacoesRange.fim);
                handleGerar("apresentacoes", formato, params);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos concluídos</CardTitle>
            <CardDescription>Conclusões de curso entre duas datas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                type="date"
                value={cursosRange.inicio}
                onChange={(e) => setCursosRange((r) => ({ ...r, inicio: e.target.value }))}
              />
              <Input
                type="date"
                value={cursosRange.fim}
                onChange={(e) => setCursosRange((r) => ({ ...r, fim: e.target.value }))}
              />
            </div>
            <ReportActions
              gerando={gerando === "cursos-pdf" ? "pdf" : gerando === "cursos-excel" ? "excel" : null}
              onGerar={(formato) => {
                const params = new URLSearchParams();
                if (cursosRange.inicio) params.set("inicio", cursosRange.inicio);
                if (cursosRange.fim) params.set("fim", cursosRange.fim);
                handleGerar("cursos", formato, params);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos emitidos</CardTitle>
            <CardDescription>Certificados, cartas e carteirinhas emitidos por período.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Select
              items={DOCUMENTO_LABELS}
              value={documentosFiltro.tipo || undefined}
              onValueChange={(v) => setDocumentosFiltro((f) => ({ ...f, tipo: String(v ?? "") }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENTO_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                type="date"
                value={documentosFiltro.inicio}
                onChange={(e) => setDocumentosFiltro((f) => ({ ...f, inicio: e.target.value }))}
              />
              <Input
                type="date"
                value={documentosFiltro.fim}
                onChange={(e) => setDocumentosFiltro((f) => ({ ...f, fim: e.target.value }))}
              />
            </div>
            <ReportActions
              gerando={
                gerando === "documentos-pdf" ? "pdf" : gerando === "documentos-excel" ? "excel" : null
              }
              onGerar={(formato) => {
                const params = new URLSearchParams();
                if (documentosFiltro.tipo) params.set("tipo", documentosFiltro.tipo);
                if (documentosFiltro.inicio) params.set("inicio", documentosFiltro.inicio);
                if (documentosFiltro.fim) params.set("fim", documentosFiltro.fim);
                handleGerar("documentos", formato, params);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentação de membros</CardTitle>
            <CardDescription>Entradas e saídas registradas entre duas datas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                type="date"
                value={movimentacaoRange.inicio}
                onChange={(e) => setMovimentacaoRange((r) => ({ ...r, inicio: e.target.value }))}
              />
              <Input
                type="date"
                value={movimentacaoRange.fim}
                onChange={(e) => setMovimentacaoRange((r) => ({ ...r, fim: e.target.value }))}
              />
            </div>
            <ReportActions
              gerando={
                gerando === "movimentacao-pdf" ? "pdf" : gerando === "movimentacao-excel" ? "excel" : null
              }
              onGerar={(formato) => {
                const params = new URLSearchParams();
                if (movimentacaoRange.inicio) params.set("inicio", movimentacaoRange.inicio);
                if (movimentacaoRange.fim) params.set("fim", movimentacaoRange.fim);
                handleGerar("movimentacao", formato, params);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento anual</CardTitle>
            <CardDescription>Novos membros por mês em um ano específico.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input
              type="number"
              min={2000}
              max={2100}
              value={crescimentoAno}
              onChange={(e) => setCrescimentoAno(e.target.value)}
            />
            <ReportActions
              gerando={
                gerando === "crescimento-pdf" ? "pdf" : gerando === "crescimento-excel" ? "excel" : null
              }
              onGerar={(formato) => {
                const params = new URLSearchParams({ ano: crescimentoAno });
                handleGerar("crescimento", formato, params);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RelatoriosPage() {
  return (
    <AuthGuard>
      <RelatoriosContent />
    </AuthGuard>
  );
}
