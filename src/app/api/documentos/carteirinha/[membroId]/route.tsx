import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { emitDocumento, getConfiguracao, resolveLogoPath } from "@/lib/documento";
import { formatDate } from "@/lib/format";
import { Carteirinha } from "@/lib/pdf/carteirinha";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ membroId: string }> },
) {
  const session = await requireRole(["ADMIN", "SECRETARIA", "LIDERANCA"]);
  const { membroId } = await params;

  const membro = await prisma.membro.findUnique({
    where: { id: Number(membroId) },
    include: { congregacao: true, cargo: true },
  });
  if (!membro) {
    return new Response("Membro não encontrado", { status: 404 });
  }

  const configuracao = await getConfiguracao();

  const validadeDate = new Date();
  validadeDate.setFullYear(validadeDate.getFullYear() + 2);

  const documento = await emitDocumento({
    tipo: "CARTEIRINHA",
    membroId: membro.id,
    validade: validadeDate,
    emitidoPorId: Number(session.sub),
  });

  const qrDataUrl = await QRCode.toDataURL(
    `${configuracao.nomeIgreja} | Matrícula ${membro.id} | ${membro.nomeCompleto}`,
    { margin: 0 },
  );

  let fotoPath: string | null = null;
  if (membro.fotoUrl) {
    const absolute = path.join(process.cwd(), "public", membro.fotoUrl);
    if (fs.existsSync(absolute)) fotoPath = absolute;
  }

  const buffer = await renderToBuffer(
    <Carteirinha
      nomeIgreja={configuracao.nomeIgreja}
      logoPath={resolveLogoPath(configuracao.logoUrl)}
      nomeMembro={membro.nomeCompleto}
      cargo={membro.cargo?.nome ?? "Membro"}
      congregacao={membro.congregacao.nome}
      matricula={String(membro.id).padStart(5, "0")}
      fotoPath={fotoPath}
      validade={formatDate(validadeDate)}
      qrDataUrl={qrDataUrl}
    />,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="carteirinha-${documento.numero}.pdf"`,
    },
  });
}
