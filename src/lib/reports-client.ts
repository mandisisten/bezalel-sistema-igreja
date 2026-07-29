import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatTimestamp } from "@/lib/firestore-utils";
import { optionLabel, STATUS_MEMBRO_OPTIONS } from "@/lib/member-options";
import { DOCUMENTO_LABELS } from "@/lib/documento-client";
import type { MembroInput } from "@/app/(app)/membros/actions";
import type { BatismoInput } from "@/app/(app)/batismos/actions";
import type { ApresentacaoInput } from "@/app/(app)/apresentacoes/actions";
import type { ConclusaoInput } from "@/app/(app)/cursos/conclusoes/actions";
import type { DocumentoInput } from "@/lib/documento-client";
import type { Timestamp } from "firebase/firestore";

export type ReportResult = {
  titulo: string;
  headers: string[];
  rows: (string | number)[][];
};

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function inRange(ts: Timestamp | null | undefined, inicio: string | null, fim: string | null) {
  if (!ts) return false;
  const millis = ts.toMillis();
  if (inicio && millis < new Date(inicio).getTime()) return false;
  if (fim && millis > new Date(`${fim}T23:59:59`).getTime()) return false;
  return true;
}

async function fetchAll<T>(path: string, orderField: string): Promise<(T & { id: string })[]> {
  const snap = await getDocs(query(collection(db, path), orderBy(orderField, "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function relatorioMembros(params: URLSearchParams): Promise<ReportResult> {
  const congregacaoId = params.get("congregacaoId");
  const cargoId = params.get("cargoId");
  const status = params.get("status");

  let membros = await fetchAll<MembroInput>("membros", "nomeCompleto");
  if (congregacaoId) membros = membros.filter((m) => m.congregacaoId === congregacaoId);
  if (cargoId) membros = membros.filter((m) => m.cargoId === cargoId);
  if (status) membros = membros.filter((m) => m.status === status);

  return {
    titulo: "Relação Geral de Membros",
    headers: ["Nome", "Congregação", "Cargo", "Status", "Telefone", "E-mail", "Admissão"],
    rows: membros.map((m) => [
      m.nomeCompleto,
      m.congregacaoNome ?? "—",
      m.cargoNome ?? "—",
      optionLabel(STATUS_MEMBRO_OPTIONS, m.status),
      m.celular || m.telefone || "—",
      m.email || "—",
      formatTimestamp(m.dataAdmissao),
    ]),
  };
}

export async function relatorioAniversariantes(params: URLSearchParams): Promise<ReportResult> {
  const mes = Number(params.get("mes") ?? new Date().getMonth() + 1);

  const snap = await getDocs(query(collection(db, "membros"), where("status", "==", "ATIVO")));
  const membros = snap.docs.map((d) => ({ id: d.id, ...(d.data() as MembroInput) }));

  const filtrados = membros
    .filter((m) => m.dataNascimento && m.dataNascimento.toDate().getUTCMonth() + 1 === mes)
    .sort((a, b) => a.dataNascimento!.toDate().getUTCDate() - b.dataNascimento!.toDate().getUTCDate());

  return {
    titulo: `Aniversariantes de ${MESES[mes - 1]}`,
    headers: ["Nome", "Data de nascimento", "Congregação", "Celular"],
    rows: filtrados.map((m) => [
      m.nomeCompleto,
      formatTimestamp(m.dataNascimento),
      m.congregacaoNome ?? "—",
      m.celular || "—",
    ]),
  };
}

export async function relatorioBatismos(params: URLSearchParams): Promise<ReportResult> {
  const inicio = params.get("inicio");
  const fim = params.get("fim");

  const batismos = await fetchAll<BatismoInput>("batismos", "data");
  const filtrados = batismos.filter((b) => inRange(b.data, inicio, fim));

  return {
    titulo: "Batismos por Período",
    headers: ["Nome", "Data", "Local", "Oficiante", "Congregação"],
    rows: filtrados.map((b) => [
      b.membroNome ?? "—",
      formatTimestamp(b.data),
      b.local || "—",
      b.oficiante || "—",
      b.congregacaoNome ?? "—",
    ]),
  };
}

export async function relatorioApresentacoes(params: URLSearchParams): Promise<ReportResult> {
  const inicio = params.get("inicio");
  const fim = params.get("fim");

  const apresentacoes = await fetchAll<ApresentacaoInput>("apresentacoes", "data");
  const filtrados = apresentacoes.filter((a) => inRange(a.data, inicio, fim));

  return {
    titulo: "Apresentações de Crianças por Período",
    headers: ["Criança", "Data", "Pais", "Responsável", "Congregação"],
    rows: filtrados.map((a) => [
      a.nomeCrianca,
      formatTimestamp(a.data),
      [a.nomePai, a.nomeMae].filter(Boolean).join(" e ") || "—",
      a.responsavelNome ?? "—",
      a.congregacaoNome ?? "—",
    ]),
  };
}

export async function relatorioCursos(params: URLSearchParams): Promise<ReportResult> {
  const inicio = params.get("inicio");
  const fim = params.get("fim");

  const conclusoes = await fetchAll<ConclusaoInput>("cursoConclusoes", "dataConclusao");
  const filtrados = conclusoes.filter((c) => inRange(c.dataConclusao, inicio, fim));

  return {
    titulo: "Cursos Concluídos por Período",
    headers: ["Membro", "Curso", "Conclusão", "Instrutor", "Nota"],
    rows: filtrados.map((c) => [
      c.membroNome ?? "—",
      c.cursoNome ?? "—",
      formatTimestamp(c.dataConclusao),
      c.instrutor || "—",
      c.nota || "—",
    ]),
  };
}

export async function relatorioDocumentos(params: URLSearchParams): Promise<ReportResult> {
  const inicio = params.get("inicio");
  const fim = params.get("fim");
  const tipo = params.get("tipo");

  let documentos = await fetchAll<DocumentoInput>("documentos", "dataEmissao");
  documentos = documentos.filter((d) => inRange(d.dataEmissao, inicio, fim));
  if (tipo) documentos = documentos.filter((d) => d.tipo === tipo);

  return {
    titulo: "Documentos Emitidos por Período",
    headers: ["Número", "Tipo", "Membro", "Emitido em", "Emitido por"],
    rows: documentos.map((d) => [
      d.numero,
      DOCUMENTO_LABELS[d.tipo] ?? d.tipo,
      d.membroNome ?? "—",
      formatTimestamp(d.dataEmissao),
      d.emitidoPorNome,
    ]),
  };
}

export async function relatorioMovimentacao(params: URLSearchParams): Promise<ReportResult> {
  const inicio = params.get("inicio");
  const fim = params.get("fim");

  const membros = await fetchAll<MembroInput>("membros", "nomeCompleto");
  const entradas = membros.filter((m) => inRange(m.dataAdmissao, inicio, fim));
  const saidas = membros.filter((m) => inRange(m.dataSaida, inicio, fim));

  const rows: (string | number)[][] = [
    ...entradas.map((m) => [
      "Entrada",
      m.nomeCompleto,
      formatTimestamp(m.dataAdmissao),
      m.formaAdmissao || "—",
      m.congregacaoNome ?? "—",
    ]),
    ...saidas.map((m) => [
      "Saída",
      m.nomeCompleto,
      formatTimestamp(m.dataSaida),
      m.motivoSaida || "—",
      m.congregacaoNome ?? "—",
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

  const snap = await getDocs(collection(db, "membros"));
  const buckets = new Array(12).fill(0);
  for (const d of snap.docs) {
    const createdAt = d.data().createdAt as Timestamp | undefined;
    if (!createdAt) continue;
    const date = createdAt.toDate();
    if (date.getFullYear() === ano) buckets[date.getMonth()]++;
  }

  return {
    titulo: `Crescimento de Membros — ${ano}`,
    headers: ["Mês", "Novos membros"],
    rows: MESES.map((nome, i) => [nome, buckets[i]]),
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
