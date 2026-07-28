import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { cardStyles as s } from "./styles";

export function Carteirinha({
  nomeIgreja,
  logoPath,
  nomeMembro,
  cargo,
  congregacao,
  matricula,
  fotoPath,
  validade,
  qrDataUrl,
}: {
  nomeIgreja: string;
  logoPath?: string | null;
  nomeMembro: string;
  cargo: string;
  congregacao: string;
  matricula: string;
  fotoPath: string | null;
  validade: string;
  qrDataUrl: string;
}) {
  return (
    <Document>
      <Page size={{ width: 243, height: 153 }} style={s.page}>
        <View style={s.card}>
          {fotoPath ? (
            <Image src={fotoPath} style={s.photo} />
          ) : (
            <View style={s.photoPlaceholder} />
          )}
          <View style={s.info}>
            <View>
              <View style={s.churchRow}>
                {logoPath && <Image src={logoPath} style={s.miniLogo} />}
                <Text style={s.churchName}>{nomeIgreja}</Text>
              </View>
              <Text style={s.memberName}>{nomeMembro}</Text>
              <Text style={s.label}>Cargo</Text>
              <Text style={s.value}>{cargo}</Text>
              <Text style={s.label}>Congregação</Text>
              <Text style={s.value}>{congregacao}</Text>
            </View>
            <View style={s.qrRow}>
              <View>
                <Text style={s.label}>Matrícula {matricula}</Text>
                <Text style={s.label}>Válida até {validade}</Text>
              </View>
              <Image src={qrDataUrl} style={s.qr} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
