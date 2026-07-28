import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { emitDocumento, getConfiguracao, resolveLogoPath } from "@/lib/documento";
import { formatDate } from "@/lib/format";
import { CertificadoBatismo } from "@/lib/pdf/certificado-batismo";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ batismoId: string }> },
) {
  const session = await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);
  const { batismoId } = await params;

  const batismo = await prisma.batismo.findUnique({
    where: { id: Number(batismoId) },
    include: { membro: true },
  });
  if (!batismo) {
    return new Response("Batismo não encontrado", { status: 404 });
  }

  const configuracao = await getConfiguracao();

  const documento = await emitDocumento({
    tipo: "CERTIFICADO_BATISMO",
    membroId: batismo.membroId,
    referenciaId: batismo.id,
    emitidoPorId: Number(session.sub),
  });

  const buffer = await renderToBuffer(
    <CertificadoBatismo
      nomeIgreja={configuracao.nomeIgreja}
      enderecoSede={configuracao.enderecoSede}
      logoPath={resolveLogoPath(configuracao.logoUrl)}
      nomeMembro={batismo.membro.nomeCompleto}
      data={formatDate(batismo.data)}
      local={batismo.local}
      oficiante={batismo.oficiante}
      nomePresidente={configuracao.nomePresidente}
      cargoPresidente={configuracao.cargoPresidente}
      numero={documento.numero}
    />,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificado-batismo-${documento.numero}.pdf"`,
    },
  });
}
