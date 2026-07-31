import { Document, Page, Text, View, Image, Svg, Path, Circle, StyleSheet } from "@react-pdf/renderer";

const navy = "#1B3A5C";
const gold = "#B08D57";

const s = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Times-Roman",
    color: navy,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 22,
    left: 22,
  },
  cornerTopRight: {
    position: "absolute",
    top: 22,
    right: 22,
    transform: "scaleX(-1)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 18,
  },
  title: {
    fontSize: 42,
    fontFamily: "Times-Bold",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    letterSpacing: 3,
    marginTop: 4,
  },
  ornamentDivider: {
    marginTop: 14,
  },
  declara: {
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 14,
  },
  nomeMembro: {
    fontSize: 28,
    fontFamily: "Times-Bold",
    marginTop: 14,
    marginBottom: 14,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: navy,
    width: "100%",
    marginTop: 2,
    marginBottom: 20,
  },
  paragraph: {
    width: "100%",
    fontSize: 13.5,
    lineHeight: 1.7,
    textAlign: "center",
    paddingHorizontal: 55,
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  quote: {
    width: "100%",
    fontFamily: "Times-Italic",
    fontSize: 12.5,
    lineHeight: 1.6,
    textAlign: "center",
    paddingHorizontal: 55,
    marginTop: 12,
  },
  referencia: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    letterSpacing: 1,
    color: gold,
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: 18,
  },
  signatureBlock: {
    width: 190,
    alignItems: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: navy,
    width: "100%",
    marginBottom: 6,
  },
  signatureNome: {
    fontFamily: "Times-Italic",
    fontSize: 11,
  },
  signatureCargo: {
    fontSize: 8,
    letterSpacing: 1,
    marginTop: 2,
  },
  churchBlock: {
    alignItems: "center",
  },
  churchLogo: {
    width: 138,
    height: 138,
    objectFit: "contain",
  },
  docNumber: {
    position: "absolute",
    bottom: 12,
    right: 22,
    fontSize: 7,
    color: gold,
  },
});

function CornerOrnament({ mirrored }: { mirrored?: boolean }) {
  return (
    <Svg width={64} height={64} style={mirrored ? s.cornerTopRight : s.cornerTopLeft}>
      <Path
        d="M3 26 Q3 3 26 3 L58 3"
        stroke={gold}
        strokeWidth={1.2}
        fill="none"
      />
      <Path d="M3 26 Q3 34 11 34" stroke={gold} strokeWidth={1.2} fill="none" />
      <Path d="M50 3 Q58 3 58 11" stroke={gold} strokeWidth={1.2} fill="none" />
      <Circle cx={3} cy={41} r={2.4} fill={gold} />
      <Circle cx={63} cy={3} r={2.4} fill={gold} />
      <Circle cx={16} cy={38} r={1.4} fill={gold} />
      <Circle cx={45} cy={9} r={1.4} fill={gold} />
    </Svg>
  );
}

function OrnamentDivider() {
  return (
    <Svg width={100} height={12} style={s.ornamentDivider}>
      <Path d="M0 6 H36" stroke={gold} strokeWidth={1} />
      <Circle cx={44} cy={6} r={2} fill={gold} />
      <Path d="M50 6 a6 6 0 1 1 0 0.01" stroke={gold} strokeWidth={1} fill="none" />
      <Circle cx={56} cy={6} r={2} fill={gold} />
      <Path d="M64 6 H100" stroke={gold} strokeWidth={1} />
    </Svg>
  );
}

export function CertificadoBatismo({
  nomeIgreja,
  logoPath,
  nomeMembro,
  data,
  local,
  oficiante,
  nomePresidente,
  cargoPresidente,
  nomeSecretario,
  cargoSecretario,
  numero,
}: {
  nomeIgreja: string;
  logoPath?: string | null;
  nomeMembro: string;
  data: string;
  local: string | null;
  oficiante: string | null;
  nomePresidente: string | null;
  cargoPresidente: string | null;
  nomeSecretario: string | null;
  cargoSecretario: string | null;
  numero: string;
}) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <CornerOrnament />
        <CornerOrnament mirrored />

        <View style={s.content}>
          <Text style={s.title}>CERTIFICADO</Text>
          <Text style={s.subtitle}>DE BATISMO NAS ÁGUAS</Text>

          <OrnamentDivider />

          <Text style={s.declara}>ESTE CERTIFICADO DECLARA QUE</Text>

          <Text style={s.nomeMembro}>{nomeMembro}</Text>

          <View style={s.divider} />

          <Text style={s.paragraph}>
            foi batizado(a) nas águas no dia <Text style={s.bold}>{data}</Text>
            {local ? `, em ${local}` : ""} em nome do Pai, do Filho e do Espírito Santo,
            conforme o exemplo de Jesus Cristo
            {oficiante ? `, sob a condução de ${oficiante}` : ""}.
          </Text>

          <Text style={s.quote}>
            &ldquo;Portanto, ide, fazei discípulos de todas as nações, batizando-os em nome do
            Pai, e do Filho, e do Espírito Santo.&rdquo;
          </Text>
          <Text style={s.referencia}>(MATEUS 28:19)</Text>

          <View style={s.footer}>
            <View style={s.signatureBlock}>
              <View style={s.signatureLine} />
              <Text style={s.signatureNome}>{nomeSecretario || "_______________________"}</Text>
              <Text style={s.signatureCargo}>{(cargoSecretario || "1º SECRETÁRIO").toUpperCase()}</Text>
            </View>

            <View style={s.churchBlock}>
              {logoPath && <Image src={logoPath} style={s.churchLogo} />}
            </View>

            <View style={s.signatureBlock}>
              <View style={s.signatureLine} />
              <Text style={s.signatureNome}>{nomePresidente || "_______________________"}</Text>
              <Text style={s.signatureCargo}>{(cargoPresidente || "PASTOR PRESIDENTE").toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <Text style={s.docNumber}>Documento nº {numero}</Text>
      </Page>
    </Document>
  );
}
