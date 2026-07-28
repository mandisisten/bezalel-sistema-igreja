import { renderToBuffer } from "@react-pdf/renderer";
import { requireUser } from "@/lib/auth";
import { REPORTS } from "@/lib/reports";
import { buildExcelBuffer } from "@/lib/excel";
import { getConfiguracao, resolveLogoPath } from "@/lib/documento";
import { formatDateTime } from "@/lib/format";
import { RelatorioPdf } from "@/lib/pdf/relatorio";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tipo: string }> },
) {
  await requireUser();
  const { tipo } = await params;

  const report = REPORTS[tipo];
  if (!report) {
    return new Response("Relatório não encontrado", { status: 404 });
  }

  const url = new URL(request.url);
  const formato = url.searchParams.get("formato") ?? "excel";
  const resultado = await report.run(url.searchParams);

  if (formato === "excel") {
    const buffer = await buildExcelBuffer(resultado.titulo, resultado.headers, resultado.rows);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${tipo}.xlsx"`,
      },
    });
  }

  const configuracao = await getConfiguracao();
  const buffer = await renderToBuffer(
    <RelatorioPdf
      nomeIgreja={configuracao.nomeIgreja}
      logoPath={resolveLogoPath(configuracao.logoUrl)}
      titulo={resultado.titulo}
      headers={resultado.headers}
      rows={resultado.rows}
      geradoEm={formatDateTime(new Date())}
    />,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${tipo}.pdf"`,
    },
  });
}
