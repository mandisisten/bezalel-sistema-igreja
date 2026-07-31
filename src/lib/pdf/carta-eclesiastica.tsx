import { Text, View, Image, Svg, Path, Defs, LinearGradient, Stop, StyleSheet } from "@react-pdf/renderer";

export const navy = "#1B3A5C";
export const teal = "#2A8C8C";
export const gold = "#B08D57";

const PAGE_WIDTH = 595;

export const s = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Times-Roman",
    color: navy,
    fontSize: 11,
  },
  body: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 18,
    paddingBottom: 10,
    alignItems: "center",
  },
  logo: {
    width: 64,
    height: 64,
    objectFit: "contain",
  },
  churchName: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  churchDetail: {
    fontSize: 8,
    color: "#57534e",
    marginTop: 2,
    textAlign: "center",
  },
  quote: {
    fontFamily: "Times-Italic",
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  tipoBox: {
    borderWidth: 1,
    borderColor: navy,
    borderRadius: 3,
    padding: 10,
    width: "100%",
  },
  tipoBoxLabel: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    marginBottom: 8,
  },
  tipoBoxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  tipoBoxLeft: {
    flexDirection: "column",
    gap: 8,
  },
  tipoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipoLabelBox: {
    borderWidth: 1,
    borderColor: navy,
    borderRadius: 2,
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: 110,
  },
  tipoLabelBoxActive: {
    borderWidth: 1.4,
  },
  tipoLabelText: {
    fontSize: 10,
    textAlign: "center",
  },
  tipoLabelTextActive: {
    fontFamily: "Times-Bold",
  },
  checkCol: {
    alignItems: "center",
  },
  checkCaption: {
    fontSize: 7,
    marginBottom: 2,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: navy,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxMark: {
    fontFamily: "Times-Bold",
    fontSize: 10,
  },
  congregacaoCol: {
    alignItems: "center",
  },
  congregacaoLabel: {
    fontSize: 8,
    marginBottom: 3,
  },
  congregacaoBox: {
    borderWidth: 1,
    borderColor: navy,
    borderRadius: 2,
    paddingVertical: 5,
    paddingHorizontal: 12,
    minWidth: 110,
    alignItems: "center",
  },
  saudacao: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    textAlign: "center",
    marginTop: 18,
    marginBottom: 10,
  },
  paragraph: {
    width: "100%",
    fontSize: 11,
    lineHeight: 1.6,
    textAlign: "justify",
    marginTop: 8,
  },
  obs: {
    width: "100%",
    fontFamily: "Times-Italic",
    fontSize: 10.5,
    lineHeight: 1.5,
    textAlign: "justify",
    marginTop: 10,
  },
  place: {
    fontSize: 11,
    textAlign: "center",
    marginTop: "auto",
    paddingTop: 20,
  },
  signaturesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 60,
    marginTop: 34,
  },
  signatureBlock: {
    width: 180,
    alignItems: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: navy,
    width: "100%",
    marginBottom: 5,
  },
  signatureNome: {
    fontFamily: "Times-Italic",
    fontSize: 10.5,
  },
  signatureCargo: {
    fontSize: 8,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  docNumber: {
    position: "absolute",
    bottom: 26,
    right: 26,
    fontSize: 7,
    color: gold,
  },
});

export function WaveBar({ flip }: { flip?: boolean }) {
  const top = flip
    ? "M0,20 L595,20 L595,10 C450,10 420,2 300,5 C180,8 150,16 0,12 Z"
    : "M0,0 L595,0 L595,10 C450,10 420,18 300,15 C180,12 150,4 0,8 Z";
  return (
    <Svg width={PAGE_WIDTH} height={20}>
      <Defs>
        <LinearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={navy} />
          <Stop offset="1" stopColor={teal} />
        </LinearGradient>
      </Defs>
      <Path d={top} fill="url(#waveGrad)" />
    </Svg>
  );
}

export function CartaHeader({
  nomeIgreja,
  enderecoSede,
  cidadeSede,
  logoPath,
}: {
  nomeIgreja: string;
  enderecoSede: string | null;
  cidadeSede: string | null;
  logoPath?: string | null;
}) {
  return (
    <View style={{ alignItems: "center" }}>
      {logoPath && <Image src={logoPath} style={s.logo} />}
      <Text style={s.churchName}>{nomeIgreja.toUpperCase()}</Text>
      {(enderecoSede || cidadeSede) && (
        <Text style={s.churchDetail}>{[enderecoSede, cidadeSede].filter(Boolean).join(" | ")}</Text>
      )}
      <Text style={s.quote}>
        &ldquo;Saudai a todos os Santos em Cristo Jesus, os irmãos que estão comigo vos
        saúdam.&rdquo; (Fp 4:21)
      </Text>
    </View>
  );
}

function Checkbox({ marked }: { marked: boolean }) {
  return <View style={s.checkbox}>{marked && <Text style={s.checkboxMark}>X</Text>}</View>;
}

export function CartaTipoBox({
  tipo,
  interna,
  congregacaoOrigem,
}: {
  tipo: "RECOMENDACAO" | "MUDANCA";
  interna: boolean;
  congregacaoOrigem: string;
}) {
  return (
    <View style={s.tipoBox}>
      <Text style={s.tipoBoxLabel}>CARTA DE:</Text>
      <View style={s.tipoBoxRow}>
        <View style={s.tipoBoxLeft}>
          <View style={s.tipoRow}>
            <View style={[s.tipoLabelBox, tipo === "RECOMENDACAO" ? s.tipoLabelBoxActive : {}]}>
              <Text style={[s.tipoLabelText, tipo === "RECOMENDACAO" ? s.tipoLabelTextActive : {}]}>
                Recomendação
              </Text>
            </View>
            <View style={s.checkCol}>
              <Text style={s.checkCaption}>Interna</Text>
              <Checkbox marked={tipo === "RECOMENDACAO" && interna} />
            </View>
            <View style={s.checkCol}>
              <Text style={s.checkCaption}>Externa</Text>
              <Checkbox marked={tipo === "RECOMENDACAO" && !interna} />
            </View>
          </View>
          <View style={s.tipoRow}>
            <View style={[s.tipoLabelBox, tipo === "MUDANCA" ? s.tipoLabelBoxActive : {}]}>
              <Text style={[s.tipoLabelText, tipo === "MUDANCA" ? s.tipoLabelTextActive : {}]}>
                Mudança
              </Text>
            </View>
            <View style={s.checkCol}>
              <Text style={s.checkCaption}>Interna</Text>
              <Checkbox marked={tipo === "MUDANCA" && interna} />
            </View>
            <View style={s.checkCol}>
              <Text style={s.checkCaption}>Externa</Text>
              <Checkbox marked={tipo === "MUDANCA" && !interna} />
            </View>
          </View>
        </View>

        <View style={s.congregacaoCol}>
          <Text style={s.congregacaoLabel}>Congregação</Text>
          <View style={s.congregacaoBox}>
            <Text style={s.tipoLabelText}>{congregacaoOrigem}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function CartaFooter({
  data,
  nomeSecretario,
  cargoSecretario,
  nomePresidente,
  cargoPresidente,
  numero,
}: {
  data: string;
  nomeSecretario: string | null;
  cargoSecretario: string | null;
  nomePresidente: string | null;
  cargoPresidente: string | null;
  numero: string;
}) {
  return (
    <>
      <Text style={s.place}>{data}</Text>
      <View style={s.signaturesRow}>
        <View style={s.signatureBlock}>
          <View style={s.signatureLine} />
          <Text style={s.signatureNome}>{nomeSecretario || "_______________________"}</Text>
          <Text style={s.signatureCargo}>{(cargoSecretario || "1º SECRETÁRIO").toUpperCase()}</Text>
        </View>
        <View style={s.signatureBlock}>
          <View style={s.signatureLine} />
          <Text style={s.signatureNome}>{nomePresidente || "_______________________"}</Text>
          <Text style={s.signatureCargo}>{(cargoPresidente || "PASTOR PRESIDENTE").toUpperCase()}</Text>
        </View>
      </View>
      <Text style={s.docNumber}>Documento nº {numero}</Text>
    </>
  );
}

export function formatMesAno(date: Date | null): string {
  if (!date) return "—";
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${meses[date.getMonth()]}/${date.getFullYear()}`;
}
