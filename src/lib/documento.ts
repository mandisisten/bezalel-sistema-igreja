import "server-only";
import fs from "fs";
import { prisma } from "@/lib/prisma";
import { resolveUploadPath } from "@/lib/upload";

export const DOCUMENTO_PREFIXOS: Record<string, string> = {
  CARTEIRINHA: "CART",
  CERTIFICADO_BATISMO: "CBAT",
  CERTIFICADO_APRESENTACAO: "CAPR",
  CERTIFICADO_CURSO: "CCUR",
  CARTA_RECOMENDACAO: "CREC",
  CARTA_MUDANCA: "CMUD",
};

export const DOCUMENTO_LABELS: Record<string, string> = {
  CARTEIRINHA: "Carteirinha de membro",
  CERTIFICADO_BATISMO: "Certificado de batismo",
  CERTIFICADO_APRESENTACAO: "Certificado de apresentação de criança",
  CERTIFICADO_CURSO: "Certificado de conclusão de curso",
  CARTA_RECOMENDACAO: "Carta de recomendação",
  CARTA_MUDANCA: "Carta de mudança",
};

export async function emitDocumento(params: {
  tipo: string;
  membroId?: number;
  referenciaId?: number;
  validade?: Date;
  emitidoPorId: number;
}) {
  const documento = await prisma.documento.create({
    data: {
      tipo: params.tipo,
      membroId: params.membroId,
      referenciaId: params.referenciaId,
      validade: params.validade,
      emitidoPorId: params.emitidoPorId,
      numero: "TEMP",
    },
  });

  const ano = documento.dataEmissao.getFullYear();
  const prefixo = DOCUMENTO_PREFIXOS[params.tipo] ?? "DOC";
  const numero = `${prefixo}-${ano}-${String(documento.id).padStart(4, "0")}`;

  return prisma.documento.update({ where: { id: documento.id }, data: { numero } });
}

export function resolveLogoPath(logoUrl: string | null): string | null {
  const absolute = resolveUploadPath(logoUrl);
  if (!absolute || !fs.existsSync(absolute)) return null;
  return absolute;
}

export async function getConfiguracao() {
  const config = await prisma.configuracao.findUnique({ where: { id: 1 } });
  return (
    config ?? {
      id: 1,
      nomeIgreja: "Minha Igreja",
      cnpj: null,
      logoUrl: null,
      enderecoSede: null,
      telefoneSede: null,
      nomePresidente: null,
      cargoPresidente: "Pastor Presidente",
      assinaturaUrl: null,
      updatedAt: new Date(),
    }
  );
}
