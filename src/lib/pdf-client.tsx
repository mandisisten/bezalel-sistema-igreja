import { pdf } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { formatDate, formatDateTime } from "@/lib/format";
import { emitDocumento } from "@/lib/documento-client";
import type { Configuracao } from "@/lib/firestore-hooks";
import type { WithId } from "@/lib/firestore-hooks";
import type { MembroInput } from "@/app/(app)/membros/actions";
import type { BatismoInput } from "@/app/(app)/batismos/actions";
import type { ApresentacaoInput } from "@/app/(app)/apresentacoes/actions";
import type { ConclusaoInput } from "@/app/(app)/cursos/conclusoes/actions";
import type { CartaRecomendacaoInput } from "@/app/(app)/cartas/recomendacao/actions";
import type { CartaMudancaInput } from "@/app/(app)/cartas/mudanca/actions";
import type { ReportResult } from "@/lib/reports-client";
import { Carteirinha } from "@/lib/pdf/carteirinha";
import { CertificadoBatismo } from "@/lib/pdf/certificado-batismo";
import { CertificadoApresentacao } from "@/lib/pdf/certificado-apresentacao";
import { CertificadoCurso } from "@/lib/pdf/certificado-curso";
import { CartaRecomendacao } from "@/lib/pdf/carta-recomendacao";
import { CartaMudanca } from "@/lib/pdf/carta-mudanca";
import { RelatorioPdf } from "@/lib/pdf/relatorio";

export type Usuario = { uid: string; nome: string };

// Precisa ser chamada de forma síncrona no início do handler de clique — se
// window.open() rodar depois de um await, o navegador não reconhece mais o
// gesto do usuário e bloqueia o popup.
function abrirJanela(): Window {
  const win = window.open("", "_blank");
  if (!win) {
    throw new Error("O navegador bloqueou a abertura do PDF. Permita pop-ups para este site.");
  }
  return win;
}

function preencherJanela(win: Window, blob: Blob) {
  const url = URL.createObjectURL(blob);
  win.location.href = url;
}

export async function gerarCarteirinha(
  membro: WithId<MembroInput>,
  configuracao: Configuracao,
  usuario: Usuario,
) {
  const win = abrirJanela();

  const validadeDate = new Date();
  validadeDate.setFullYear(validadeDate.getFullYear() + 2);

  await emitDocumento({
    tipo: "CARTEIRINHA",
    membroId: membro.id,
    membroNome: membro.nomeCompleto,
    validade: validadeDate,
    emitidoPorUid: usuario.uid,
    emitidoPorNome: usuario.nome,
  });

  const qrDataUrl = await QRCode.toDataURL(
    `${configuracao.nomeIgreja} | Matrícula ${membro.id} | ${membro.nomeCompleto}`,
    { margin: 0 },
  );

  const blob = await pdf(
    <Carteirinha
      nomeIgreja={configuracao.nomeIgreja}
      logoPath={configuracao.logoUrl}
      nomeMembro={membro.nomeCompleto}
      cargo={membro.cargoNome ?? "Membro"}
      congregacao={membro.congregacaoNome ?? "—"}
      matricula={membro.id}
      fotoPath={membro.fotoUrl ?? null}
      validade={formatDate(validadeDate)}
      qrDataUrl={qrDataUrl}
    />,
  ).toBlob();

  preencherJanela(win, blob);
}

export async function gerarCertificadoBatismo(
  batismo: WithId<BatismoInput>,
  configuracao: Configuracao,
  usuario: Usuario,
) {
  const win = abrirJanela();

  const numero = await emitDocumento({
    tipo: "CERTIFICADO_BATISMO",
    membroId: batismo.membroId,
    membroNome: batismo.membroNome,
    referenciaId: batismo.id,
    emitidoPorUid: usuario.uid,
    emitidoPorNome: usuario.nome,
  });

  const blob = await pdf(
    <CertificadoBatismo
      nomeIgreja={configuracao.nomeIgreja}
      enderecoSede={configuracao.enderecoSede}
      logoPath={configuracao.logoUrl}
      nomeMembro={batismo.membroNome ?? "—"}
      data={formatDate(batismo.data.toDate())}
      local={batismo.local}
      oficiante={batismo.oficiante}
      nomePresidente={configuracao.nomePresidente}
      cargoPresidente={configuracao.cargoPresidente}
      numero={numero}
    />,
  ).toBlob();

  preencherJanela(win, blob);
}

export async function gerarCertificadoApresentacao(
  apresentacao: WithId<ApresentacaoInput>,
  configuracao: Configuracao,
  usuario: Usuario,
) {
  const win = abrirJanela();

  const numero = await emitDocumento({
    tipo: "CERTIFICADO_APRESENTACAO",
    membroId: apresentacao.responsavelId,
    membroNome: apresentacao.responsavelNome,
    referenciaId: apresentacao.id,
    emitidoPorUid: usuario.uid,
    emitidoPorNome: usuario.nome,
  });

  const blob = await pdf(
    <CertificadoApresentacao
      nomeIgreja={configuracao.nomeIgreja}
      enderecoSede={configuracao.enderecoSede}
      logoPath={configuracao.logoUrl}
      nomeCrianca={apresentacao.nomeCrianca}
      nomePai={apresentacao.nomePai}
      nomeMae={apresentacao.nomeMae}
      data={formatDate(apresentacao.data.toDate())}
      oficiante={apresentacao.oficiante}
      nomePresidente={configuracao.nomePresidente}
      cargoPresidente={configuracao.cargoPresidente}
      numero={numero}
    />,
  ).toBlob();

  preencherJanela(win, blob);
}

export async function gerarCertificadoCurso(
  conclusao: WithId<ConclusaoInput>,
  cargaHoraria: number | null,
  configuracao: Configuracao,
  usuario: Usuario,
) {
  const win = abrirJanela();

  const numero = await emitDocumento({
    tipo: "CERTIFICADO_CURSO",
    membroId: conclusao.membroId,
    membroNome: conclusao.membroNome,
    referenciaId: conclusao.id,
    emitidoPorUid: usuario.uid,
    emitidoPorNome: usuario.nome,
  });

  const blob = await pdf(
    <CertificadoCurso
      nomeIgreja={configuracao.nomeIgreja}
      enderecoSede={configuracao.enderecoSede}
      logoPath={configuracao.logoUrl}
      nomeMembro={conclusao.membroNome ?? "—"}
      nomeCurso={conclusao.cursoNome ?? "—"}
      cargaHoraria={cargaHoraria}
      dataConclusao={formatDate(conclusao.dataConclusao.toDate())}
      instrutor={conclusao.instrutor}
      nomePresidente={configuracao.nomePresidente}
      cargoPresidente={configuracao.cargoPresidente}
      numero={numero}
    />,
  ).toBlob();

  preencherJanela(win, blob);
}

export async function gerarCartaRecomendacao(
  carta: WithId<CartaRecomendacaoInput>,
  configuracao: Configuracao,
  usuario: Usuario,
) {
  const win = abrirJanela();

  const numero = await emitDocumento({
    tipo: "CARTA_RECOMENDACAO",
    membroId: carta.membroId,
    membroNome: carta.membroNome,
    referenciaId: carta.id,
    emitidoPorUid: usuario.uid,
    emitidoPorNome: usuario.nome,
  });

  const blob = await pdf(
    <CartaRecomendacao
      nomeIgreja={configuracao.nomeIgreja}
      enderecoSede={configuracao.enderecoSede}
      telefoneSede={configuracao.telefoneSede}
      logoPath={configuracao.logoUrl}
      nomeMembro={carta.membroNome ?? "—"}
      tipo={carta.tipo}
      destinatario={carta.destinatario}
      finalidade={carta.finalidade}
      data={formatDate(carta.data.toDate())}
      nomePresidente={configuracao.nomePresidente}
      cargoPresidente={configuracao.cargoPresidente}
      numero={numero}
    />,
  ).toBlob();

  preencherJanela(win, blob);
}

export async function gerarCartaMudanca(
  carta: WithId<CartaMudancaInput>,
  configuracao: Configuracao,
  usuario: Usuario,
) {
  const win = abrirJanela();

  const numero = await emitDocumento({
    tipo: "CARTA_MUDANCA",
    membroId: carta.membroId,
    membroNome: carta.membroNome,
    referenciaId: carta.id,
    emitidoPorUid: usuario.uid,
    emitidoPorNome: usuario.nome,
  });

  const blob = await pdf(
    <CartaMudanca
      nomeIgreja={configuracao.nomeIgreja}
      enderecoSede={configuracao.enderecoSede}
      telefoneSede={configuracao.telefoneSede}
      logoPath={configuracao.logoUrl}
      nomeMembro={carta.membroNome ?? "—"}
      congregacaoDestino={carta.congregacaoDestinoNome ?? carta.igrejaDestinoTexto ?? "igreja destino"}
      data={formatDate(carta.data.toDate())}
      motivo={carta.motivo}
      nomePresidente={configuracao.nomePresidente}
      cargoPresidente={configuracao.cargoPresidente}
      numero={numero}
    />,
  ).toBlob();

  preencherJanela(win, blob);
}

export async function gerarRelatorioPdf(resultado: ReportResult, configuracao: Configuracao) {
  const win = abrirJanela();

  const blob = await pdf(
    <RelatorioPdf
      nomeIgreja={configuracao.nomeIgreja}
      logoPath={configuracao.logoUrl}
      titulo={resultado.titulo}
      headers={resultado.headers}
      rows={resultado.rows}
      geradoEm={formatDateTime(new Date())}
    />,
  ).toBlob();

  preencherJanela(win, blob);
}

export function baixarArquivo(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
