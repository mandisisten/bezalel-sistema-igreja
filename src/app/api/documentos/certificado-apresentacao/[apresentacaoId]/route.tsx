import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { emitDocumento, getConfiguracao, resolveLogoPath } from "@/lib/documento";
import { formatDate } from "@/lib/format";
import { CertificadoApresentacao } from "@/lib/pdf/certificado-apresentacao";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ apresentacaoId: string }> },
) {
  const session = await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);
  const { apresentacaoId } = await params;

  const apresentacao = await prisma.apresentacaoCrianca.findUnique({
    where: { id: Number(apresentacaoId) },
  });
  if (!apresentacao) {
    return new Response("Apresentação não encontrada", { status: 404 });
  }

  const configuracao = await getConfiguracao();

  const documento = await emitDocumento({
    tipo: "CERTIFICADO_APRESENTACAO",
    membroId: apresentacao.responsavelId ?? undefined,
    referenciaId: apresentacao.id,
    emitidoPorId: Number(session.sub),
  });

  const buffer = await renderToBuffer(
    <CertificadoApresentacao
      nomeIgreja={configuracao.nomeIgreja}
      enderecoSede={configuracao.enderecoSede}
      logoPath={resolveLogoPath(configuracao.logoUrl)}
      nomeCrianca={apresentacao.nomeCrianca}
      nomePai={apresentacao.nomePai}
      nomeMae={apresentacao.nomeMae}
      data={formatDate(apresentacao.data)}
      oficiante={apresentacao.oficiante}
      nomePresidente={configuracao.nomePresidente}
      cargoPresidente={configuracao.cargoPresidente}
      numero={documento.numero}
    />,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificado-apresentacao-${documento.numero}.pdf"`,
    },
  });
}
