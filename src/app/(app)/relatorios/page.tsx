import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
import { DOCUMENTO_LABELS } from "@/lib/documento";

const STATUS_ITEMS = toSelectItems(STATUS_MEMBRO_OPTIONS);
const DOCUMENTO_ITEMS = DOCUMENTO_LABELS;
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const MES_ITEMS = Object.fromEntries(MESES.map((m, i) => [String(i + 1), m]));

function ReportActions() {
  return (
    <div className="flex gap-2">
      <Button type="submit" name="formato" value="pdf" variant="outline">
        PDF
      </Button>
      <Button type="submit" name="formato" value="excel">
        Excel
      </Button>
    </div>
  );
}

export default async function RelatoriosPage() {
  await requireUser();

  const [congregacoes, cargos, cursos] = await Promise.all([
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
    prisma.cargo.findMany({ orderBy: { ordem: "asc" } }),
    prisma.curso.findMany({ orderBy: { nome: "asc" } }),
  ]);

  const congregacaoItems = Object.fromEntries(congregacoes.map((c) => [String(c.id), c.nome]));
  const cargoItems = Object.fromEntries(cargos.map((c) => [String(c.id), c.nome]));
  void cursos;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

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
          <CardContent>
            <form action="/api/relatorios/membros" method="get" target="_blank" className="flex flex-col gap-3">
              <Select name="congregacaoId" items={congregacaoItems}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas as congregações" />
                </SelectTrigger>
                <SelectContent>
                  {congregacoes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select name="cargoId" items={cargoItems}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os cargos" />
                </SelectTrigger>
                <SelectContent>
                  {cargos.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select name="status" items={STATUS_ITEMS}>
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
              <ReportActions />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aniversariantes do mês</CardTitle>
            <CardDescription>Membros ativos aniversariantes no mês selecionado.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/relatorios/aniversariantes" method="get" target="_blank" className="flex flex-col gap-3">
              <Select name="mes" items={MES_ITEMS} defaultValue={String(currentMonth)}>
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
              <ReportActions />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Batismos por período</CardTitle>
            <CardDescription>Registros de batismo entre duas datas.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/relatorios/batismos" method="get" target="_blank" className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input name="inicio" type="date" />
                <Input name="fim" type="date" />
              </div>
              <ReportActions />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Apresentações por período</CardTitle>
            <CardDescription>Crianças apresentadas entre duas datas.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/relatorios/apresentacoes" method="get" target="_blank" className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input name="inicio" type="date" />
                <Input name="fim" type="date" />
              </div>
              <ReportActions />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos concluídos</CardTitle>
            <CardDescription>Conclusões de curso entre duas datas.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/relatorios/cursos" method="get" target="_blank" className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input name="inicio" type="date" />
                <Input name="fim" type="date" />
              </div>
              <ReportActions />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos emitidos</CardTitle>
            <CardDescription>Certificados, cartas e carteirinhas emitidos por período.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/relatorios/documentos" method="get" target="_blank" className="flex flex-col gap-3">
              <Select name="tipo" items={DOCUMENTO_ITEMS}>
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
                <Input name="inicio" type="date" />
                <Input name="fim" type="date" />
              </div>
              <ReportActions />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentação de membros</CardTitle>
            <CardDescription>Entradas e saídas registradas entre duas datas.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/relatorios/movimentacao" method="get" target="_blank" className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input name="inicio" type="date" />
                <Input name="fim" type="date" />
              </div>
              <ReportActions />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento anual</CardTitle>
            <CardDescription>Novos membros por mês em um ano específico.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/relatorios/crescimento" method="get" target="_blank" className="flex flex-col gap-3">
              <Input name="ano" type="number" defaultValue={currentYear} min={2000} max={2100} />
              <ReportActions />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
