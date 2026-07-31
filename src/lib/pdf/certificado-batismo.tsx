import { Document, Page, Text, View, Image, Svg, Path, Circle, StyleSheet } from "@react-pdf/renderer";

const navy = "#1B3A5C";
const gold = "#B08D57";

const s = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Times-Roman",
    color: navy,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 24,
    left: 24,
  },
  cornerTopRight: {
    position: "absolute",
    top: 24,
    right: 24,
    transform: "scaleX(-1)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 36,
  },
  title: {
    fontSize: 46,
    fontFamily: "Times-Bold",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 20,
    letterSpacing: 3,
    marginTop: 2,
  },
  ornamentDivider: {
    marginTop: 14,
  },
  declara: {
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 16,
  },
  nomeMembro: {
    fontSize: 30,
    fontFamily: "Times-Bold",
    marginTop: 18,
    marginBottom: 18,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: navy,
    width: "100%",
    marginTop: 4,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 1.6,
    textAlign: "center",
    marginHorizontal: 60,
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  quote: {
    fontFamily: "Times-Italic",
    fontSize: 12,
    lineHeight: 1.6,
    textAlign: "center",
    marginHorizontal: 60,
    marginTop: 18,
  },
  referencia: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    letterSpacing: 1,
    color: gold,
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: 24,
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
    gap: 4,
  },
  churchLogo: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },
  churchName: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    letterSpacing: 1,
    textAlign: "center",
  },
  docNumber: {
    position: "absolute",
    bottom: 12,
    right: 24,
    fontSize: 7,
    color: gold,
  },
});

function CornerOrnament({ mirrored }: { mirrored?: boolean }) {
  return (
    <Svg width={60} height={60} style={mirrored ? s.cornerTopRight : s.cornerTopLeft}>
      <Path
        d="M2 20 Q2 2 20 2 L52 2"
        stroke={gold}
        strokeWidth={1.2}
        fill="none"
      />
      <Path d="M2 20 L2 40" stroke={gold} strokeWidth={1.2} />
      <Circle cx={2} cy={46} r={2.2} fill={gold} />
      <Circle cx={58} cy={2} r={2.2} fill={gold} />
    </Svg>
  );
}

function OrnamentDivider() {
  return (
    <Svg width={90} height={10} style={s.ornamentDivider}>
      <Path d="M0 5 H32" stroke={gold} strokeWidth={1} />
      <Circle cx={39} cy={5} r={2} fill={gold} />
      <Circle cx={45} cy={5} r={2.6} fill={gold} />
      <Circle cx={51} cy={5} r={2} fill={gold} />
      <Path d="M58 5 H90" stroke={gold} strokeWidth={1} />
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
              <Text style={s.churchName}>{nomeIgreja.toUpperCase()}</Text>
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
