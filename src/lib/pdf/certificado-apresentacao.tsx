import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { certificateStyles as s } from "./styles";

export function CertificadoApresentacao({
  nomeIgreja,
  enderecoSede,
  logoPath,
  nomeCrianca,
  nomePai,
  nomeMae,
  data,
  oficiante,
  nomePresidente,
  cargoPresidente,
  numero,
}: {
  nomeIgreja: string;
  enderecoSede: string | null;
  logoPath?: string | null;
  nomeCrianca: string;
  nomePai: string | null;
  nomeMae: string | null;
  data: string;
  oficiante: string | null;
  nomePresidente: string | null;
  cargoPresidente: string | null;
  numero: string;
}) {
  const pais = [nomePai, nomeMae].filter(Boolean).join(" e ");

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.border}>
          {logoPath && <Image src={logoPath} style={s.logo} />}
          <Text style={s.churchName}>{nomeIgreja}</Text>
          {enderecoSede && <Text style={s.churchAddress}>{enderecoSede}</Text>}
          <Text style={s.title}>Certificado de Apresentação</Text>
          <Text style={s.paragraph}>Certificamos para os devidos fins que a criança</Text>
          <Text style={s.name}>{nomeCrianca}</Text>
          <Text style={s.paragraph}>
            {pais ? `filho(a) de ${pais}, ` : ""}
            foi apresentada(o) ao Senhor perante esta congregação no dia {data}
            {oficiante ? `, sob a condução de ${oficiante}` : ""}.
          </Text>
          <View style={s.footer}>
            <Text style={s.signatureLine}>
              {nomePresidente || "_______________________"}
              {"\n"}
              {cargoPresidente || "Pastor Presidente"}
            </Text>
          </View>
        </View>
        <Text style={s.docNumber}>Documento nº {numero}</Text>
      </Page>
    </Document>
  );
}
