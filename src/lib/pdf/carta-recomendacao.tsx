import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { letterStyles as s } from "./styles";

export function CartaRecomendacao({
  nomeIgreja,
  enderecoSede,
  telefoneSede,
  logoPath,
  nomeMembro,
  tipo,
  destinatario,
  finalidade,
  data,
  nomePresidente,
  cargoPresidente,
  numero,
}: {
  nomeIgreja: string;
  enderecoSede: string | null;
  telefoneSede: string | null;
  logoPath?: string | null;
  nomeMembro: string;
  tipo: string;
  destinatario: string | null;
  finalidade: string | null;
  data: string;
  nomePresidente: string | null;
  cargoPresidente: string | null;
  numero: string;
}) {
  const papel = tipo === "OBREIRO" ? "obreiro(a)" : "membro";

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {logoPath && <Image src={logoPath} style={s.logo} />}
          <View>
            <Text style={s.churchName}>{nomeIgreja}</Text>
            {enderecoSede && <Text style={s.churchDetail}>{enderecoSede}</Text>}
            {telefoneSede && <Text style={s.churchDetail}>{telefoneSede}</Text>}
          </View>
        </View>

        <Text style={s.title}>Carta de Recomendação</Text>

        {destinatario && <Text style={s.paragraph}>A quem possa interessar — {destinatario},</Text>}

        <Text style={s.paragraph}>
          Recomendamos {nomeMembro}, {papel} desta igreja, pessoa de conduta cristã e reputação
          ilibada dentro desta comunidade de fé.
          {finalidade ? ` A presente carta tem por finalidade: ${finalidade}.` : ""}
        </Text>

        <Text style={s.paragraph}>
          Colocamo-nos à disposição para quaisquer esclarecimentos adicionais que se façam
          necessários.
        </Text>

        <Text style={s.place}>{data}</Text>

        <View style={s.footer}>
          <Text style={s.signatureLine}>
            {nomePresidente || "_______________________"}
            {"\n"}
            {cargoPresidente || "Pastor Presidente"}
          </Text>
        </View>

        <Text style={s.docNumber}>Documento nº {numero}</Text>
      </Page>
    </Document>
  );
}
