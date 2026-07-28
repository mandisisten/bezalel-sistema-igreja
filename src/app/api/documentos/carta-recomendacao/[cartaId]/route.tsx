import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { emitDocumento, getConfiguracao, resolveLogoPath } from "@/lib/documento";
import { formatDate } from "@/lib/format";
import { CartaRecomendacao } from "@/lib/pdf/carta-recomendacao";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cartaId: string }> },
) {
  const session = await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);
  const { cartaId } = await params;

  const carta = await prisma.cartaRecomendacao.findUnique({
    where: { id: Number(cartaId) },
    include: { membro: true },
  });
  if (!carta) {
    return new Response("Carta não encontrada", { status: 404 });
  }

  const configuracao = await getConfiguracao();

  const documento = await emitDocumento({
    tipo: "CARTA_RECOMENDACAO",
    membroId: carta.membroId,
    referenciaId: carta.id,
    emitidoPorId: Number(session.sub),
  });

  const buffer = await renderToBuffer(
    <CartaRecomendacao
      nomeIgreja={configuracao.nomeIgreja}
      enderecoSede={configuracao.enderecoSede}
      telefoneSede={configuracao.telefoneSede}
      logoPath={resolveLogoPath(configuracao.logoUrl)}
      nomeMembro={carta.membro.nomeCompleto}
      tipo={carta.tipo}
      destinatario={carta.destinatario}
      finalidade={carta.finalidade}
      data={formatDate(carta.data)}
      nomePresidente={configuracao.nomePresidente}
      cargoPresidente={configuracao.cargoPresidente}
      numero={documento.numero}
    />,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="carta-recomendacao-${documento.numero}.pdf"`,
    },
  });
}
