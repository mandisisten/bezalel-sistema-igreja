import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { emitDocumento, getConfiguracao, resolveLogoPath } from "@/lib/documento";
import { formatDate } from "@/lib/format";
import { CertificadoCurso } from "@/lib/pdf/certificado-curso";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conclusaoId: string }> },
) {
  const session = await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);
  const { conclusaoId } = await params;

  const conclusao = await prisma.cursoConclusao.findUnique({
    where: { id: Number(conclusaoId) },
    include: { curso: true, membro: true },
  });
  if (!conclusao) {
    return new Response("Conclusão não encontrada", { status: 404 });
  }

  const configuracao = await getConfiguracao();

  const documento = await emitDocumento({
    tipo: "CERTIFICADO_CURSO",
    membroId: conclusao.membroId,
    referenciaId: conclusao.id,
    emitidoPorId: Number(session.sub),
  });

  const buffer = await renderToBuffer(
    <CertificadoCurso
      nomeIgreja={configuracao.nomeIgreja}
      enderecoSede={configuracao.enderecoSede}
      logoPath={resolveLogoPath(configuracao.logoUrl)}
      nomeMembro={conclusao.membro.nomeCompleto}
      nomeCurso={conclusao.curso.nome}
      cargaHoraria={conclusao.curso.cargaHoraria}
      dataConclusao={formatDate(conclusao.dataConclusao)}
      instrutor={conclusao.instrutor}
      nomePresidente={configuracao.nomePresidente}
      cargoPresidente={configuracao.cargoPresidente}
      numero={documento.numero}
    />,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificado-curso-${documento.numero}.pdf"`,
    },
  });
}
