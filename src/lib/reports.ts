import "server-only";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { optionLabel, STATUS_MEMBRO_OPTIONS } from "@/lib/member-options";
import { DOCUMENTO_LABELS } from "@/lib/documento";
import type { Prisma } from "@/generated/prisma/client";

export type ReportResult = {
  titulo: string;
  headers: string[];
  rows: (string | number)[][];
};

function parseDateRange(params: URLSearchParams) {
  const inicio = params.get("inicio");
  const fim = params.get("fim");
  return {
    gte: inicio ? new Date(inicio) : undefined,
    lte: fim ? new Date(`${fim}T23:59:59`) : undefined,
  };
}

export async function relatorioMembros(params: URLSearchParams): Promise<ReportResult> {
  const where: Prisma.MembroWhereInput = {};
  const congregacaoId = params.get("congregacaoId");
  const cargoId = params.get("cargoId");
  const status = params.get("status");
  if (congregacaoId) where.congregacaoId = Number(congregacaoId);
  if (cargoId) where.cargoId = Number(cargoId);
  if (status) where.status = status;

  const membros = await prisma.membro.findMany({
    where,
    orderBy: { nomeCompleto: "asc" },
    include: { congregacao: true, cargo: true },
  });

  return {
    titulo: "Relação Geral de Membros",
    headers: ["Nome", "Congregação", "Cargo", "Status", "Telefone", "E-mail", "Admissão"],
    rows: membros.map((m) => [
      m.nomeCompleto,
      m.congregacao.nome,
      m.cargo?.nome ?? "—",
      optionLabel(STATUS_MEMBRO_OPTIONS, m.status),
      m.celular || m.telefone || "—",
      m.email || "—",
      formatDate(m.dataAdmissao),
    ]),
  };
}

export async function relatorioAniversariantes(params: URLSearchParams): Promise<ReportResult> {
  const mes = Number(params.get("mes") ?? new Date().getMonth() + 1);

  const membros = await prisma.membro.findMany({
    where: { dataNascimento: { not: null }, status: "ATIVO" },
    include: { congregacao: true },
  });

  const filtrados = membros
    .filter((m) => m.dataNascimento!.getUTCMonth() + 1 === mes)
    .sort((a, b) => a.dataNascimento!.getUTCDate() - b.dataNascimento!.getUTCDate());

  const nomesMes = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  return {
    titulo: `Aniversariantes de ${nomesMes[mes - 1]}`,
    headers: ["Nome", "Data de nascimento", "Congregação", "Celular"],
    rows: filtrados.map((m) => [
      m.nomeCompleto,
      formatDate(m.dataNascimento),
      m.congregacao.nome,
      m.celular || "—",
    ]),
  };
}

export async function relatorioBatismos(params: URLSearchParams): Promise<ReportResult> {
  const range = parseDateRange(params);
  const batismos = await prisma.batismo.findMany({
    where: { data: { gte: range.gte, lte: range.lte } },
    orderBy: { data: "asc" },
    include: { membro: true, congregacao: true },
  });

  return {
    titulo: "Batismos por Período",
    headers: ["Nome", "Data", "Local", "Oficiante", "Congregação"],
    rows: batismos.map((b) => [
      b.membro.nomeCompleto,
      formatDate(b.data),
      b.local || "—",
      b.oficiante || "—",
      b.congregacao?.nome ?? "—",
    ]),
  };
}

export async function relatorioApresentacoes(params: URLSearchParams): Promise<ReportResult> {
  const range = parseDateRange(params);
  const apresentacoes = await prisma.apresentacaoCrianca.findMany({
    where: { data: { gte: range.gte, lte: range.lte } },
    orderBy: { data: "asc" },
    include: { congregacao: true, responsavel: true },
  });

  return {
    titulo: "Apresentações de Crianças por Período",
    headers: ["Criança", "Data", "Pais", "Responsável", "Congregação"],
    rows: apresentacoes.map((a) => [
      a.nomeCrianca,
      formatDate(a.data),
      [a.nomePai, a.nomeMae].filter(Boolean).join(" e ") || "—",
      a.responsavel?.nomeCompleto ?? "—",
      a.congregacao?.nome ?? "—",
    ]),
  };
}

export async function relatorioCursos(params: URLSearchParams): Promise<ReportResult> {
  const range = parseDateRange(params);
  const conclusoes = await prisma.cursoConclusao.findMany({
    where: { dataConclusao: { gte: range.gte, lte: range.lte } },
    orderBy: { dataConclusao: "asc" },
    include: { curso: true, membro: true },
  });

  return {
    titulo: "Cursos Concluídos por Período",
    headers: ["Membro", "Curso", "Conclusão", "Instrutor", "Nota"],
    rows: conclusoes.map((c) => [
      c.membro.nomeCompleto,
      c.curso.nome,
      formatDate(c.dataConclusao),
      c.instrutor || "—",
      c.nota || "—",
    ]),
  };
}

export async function relatorioDocumentos(params: URLSearchParams): Promise<ReportResult> {
  const range = parseDateRange(params);
  const tipo = params.get("tipo");

  const documentos = await prisma.documento.findMany({
    where: {
      dataEmissao: { gte: range.gte, lte: range.lte },
      tipo: tipo || undefined,
    },
    orderBy: { dataEmissao: "asc" },
    include: { membro: true, emitidoPor: true },
  });

  return {
    titulo: "Documentos Emitidos por Período",
    headers: ["Número", "Tipo", "Membro", "Emitido em", "Emitido por"],
    rows: documentos.map((d) => [
      d.numero,
      DOCUMENTO_LABELS[d.tipo] ?? d.tipo,
      d.membro?.nomeCompleto ?? "—",
      formatDate(d.dataEmissao),
      d.emitidoPor.nome,
    ]),
  };
}

export async function relatorioMovimentacao(params: URLSearchParams): Promise<ReportResult> {
  const range = parseDateRange(params);

  const [entradas, saidas] = await Promise.all([
    prisma.membro.findMany({
      where: { dataAdmissao: { gte: range.gte, lte: range.lte } },
      include: { congregacao: true },
      orderBy: { dataAdmissao: "asc" },
    }),
    prisma.membro.findMany({
      where: { dataSaida: { gte: range.gte, lte: range.lte } },
      include: { congregacao: true },
      orderBy: { dataSaida: "asc" },
    }),
  ]);

  const rows: (string | number)[][] = [
    ...entradas.map((m) => [
      "Entrada",
      m.nomeCompleto,
      formatDate(m.dataAdmissao),
      m.formaAdmissao || "—",
      m.congregacao.nome,
    ]),
    ...saidas.map((m) => [
      "Saída",
      m.nomeCompleto,
      formatDate(m.dataSaida),
      m.motivoSaida || "—",
      m.congregacao.nome,
    ]),
  ];

  return {
    titulo: "Movimentação de Membros (Entradas e Saídas)",
    headers: ["Tipo", "Nome", "Data", "Motivo/Forma", "Congregação"],
    rows,
  };
}

export async function relatorioCrescimentoAnual(params: URLSearchParams): Promise<ReportResult> {
  const ano = Number(params.get("ano") ?? new Date().getFullYear());
  const inicio = new Date(ano, 0, 1);
  const fim = new Date(ano, 11, 31, 23, 59, 59);

  const membros = await prisma.membro.findMany({
    where: { createdAt: { gte: inicio, lte: fim } },
    select: { createdAt: true },
  });

  const nomesMes = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  const buckets = new Array(12).fill(0);
  for (const m of membros) buckets[m.createdAt.getMonth()]++;

  return {
    titulo: `Crescimento de Membros — ${ano}`,
    headers: ["Mês", "Novos membros"],
    rows: nomesMes.map((nome, i) => [nome, buckets[i]]),
  };
}

export const REPORTS: Record<
  string,
  { label: string; run: (params: URLSearchParams) => Promise<ReportResult> }
> = {
  membros: { label: "Relação geral de membros", run: relatorioMembros },
  aniversariantes: { label: "Aniversariantes do mês", run: relatorioAniversariantes },
  batismos: { label: "Batismos por período", run: relatorioBatismos },
  apresentacoes: { label: "Apresentações por período", run: relatorioApresentacoes },
  cursos: { label: "Cursos concluídos por período", run: relatorioCursos },
  documentos: { label: "Documentos emitidos por período", run: relatorioDocumentos },
  movimentacao: { label: "Movimentação de membros", run: relatorioMovimentacao },
  crescimento: { label: "Estatístico de crescimento anual", run: relatorioCrescimentoAnual },
};
