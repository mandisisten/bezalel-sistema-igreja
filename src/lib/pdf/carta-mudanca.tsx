import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { letterStyles as s } from "./styles";

export function CartaMudanca({
  nomeIgreja,
  enderecoSede,
  telefoneSede,
  logoPath,
  nomeMembro,
  congregacaoDestino,
  data,
  motivo,
  nomePresidente,
  cargoPresidente,
  numero,
}: {
  nomeIgreja: string;
  enderecoSede: string | null;
  telefoneSede: string | null;
  logoPath?: string | null;
  nomeMembro: string;
  congregacaoDestino: string;
  data: string;
  motivo: string | null;
  nomePresidente: string | null;
  cargoPresidente: string | null;
  numero: string;
}) {
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

        <Text style={s.title}>Carta de Mudança</Text>

        <Text style={s.paragraph}>Prezados irmãos da {congregacaoDestino}, graça e paz.</Text>

        <Text style={s.paragraph}>
          Pela presente, apresentamos e recomendamos à vossa comunhão o(a) irmão(ã){" "}
          {nomeMembro}, membro(a) desta igreja, que ora se transfere para essa congregação.
          {motivo ? ` Motivo: ${motivo}.` : ""}
        </Text>

        <Text style={s.paragraph}>
          Pedimos que seja recebido(a) com o mesmo amor cristão que sempre demonstrou entre nós,
          desejando-lhe as bênçãos do Senhor nesta nova caminhada.
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
