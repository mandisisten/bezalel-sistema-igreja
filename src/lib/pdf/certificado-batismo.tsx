import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { certificateStyles as s } from "./styles";

export function CertificadoBatismo({
  nomeIgreja,
  enderecoSede,
  logoPath,
  nomeMembro,
  data,
  local,
  oficiante,
  nomePresidente,
  cargoPresidente,
  numero,
}: {
  nomeIgreja: string;
  enderecoSede: string | null;
  logoPath?: string | null;
  nomeMembro: string;
  data: string;
  local: string | null;
  oficiante: string | null;
  nomePresidente: string | null;
  cargoPresidente: string | null;
  numero: string;
}) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.border}>
          {logoPath && <Image src={logoPath} style={s.logo} />}
          <Text style={s.churchName}>{nomeIgreja}</Text>
          {enderecoSede && <Text style={s.churchAddress}>{enderecoSede}</Text>}
          <Text style={s.title}>Certificado de Batismo</Text>
          <Text style={s.paragraph}>Certificamos para os devidos fins que</Text>
          <Text style={s.name}>{nomeMembro}</Text>
          <Text style={s.paragraph}>
            foi batizado(a) nas águas, em obediência aos ensinos das Sagradas Escrituras, no
            dia {data}
            {local ? `, em ${local}` : ""}
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
