import { Document, Page, Text, View } from "@react-pdf/renderer";
import { s, WaveBar, CartaHeader, CartaTipoBox, CartaFooter } from "./carta-eclesiastica";

export function CartaMudanca({
  nomeIgreja,
  enderecoSede,
  cidadeSede,
  logoPath,
  nomeMembro,
  congregacaoOrigem,
  membroDesde,
  congregacaoDestino,
  interna,
  data,
  motivo,
  observacoes,
  nomePresidente,
  cargoPresidente,
  nomeSecretario,
  cargoSecretario,
  numero,
}: {
  nomeIgreja: string;
  enderecoSede: string | null;
  cidadeSede: string | null;
  logoPath?: string | null;
  nomeMembro: string;
  congregacaoOrigem: string;
  membroDesde: string;
  congregacaoDestino: string;
  interna: boolean;
  data: string;
  motivo: string | null;
  observacoes: string | null;
  nomePresidente: string | null;
  cargoPresidente: string | null;
  nomeSecretario: string | null;
  cargoSecretario: string | null;
  numero: string;
}) {
  const obs = [motivo ? `Motivo: ${motivo}.` : null, observacoes].filter(Boolean).join(" ");

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <WaveBar />

        <View style={s.body}>
          <CartaHeader
            nomeIgreja={nomeIgreja}
            enderecoSede={enderecoSede}
            cidadeSede={cidadeSede}
            logoPath={logoPath}
          />

          <CartaTipoBox tipo="MUDANCA" interna={interna} congregacaoOrigem={congregacaoOrigem} />

          <Text style={s.saudacao}>&ldquo;A Paz do Senhor Jesus&rdquo;</Text>

          <Text style={s.paragraph}>
            Apresentamos à {congregacaoDestino}, o irmão(ã){" "}
            <Text style={{ fontFamily: "Times-Bold" }}>{nomeMembro}</Text>.
          </Text>

          <Text style={s.paragraph}>
            Membro(a) desta Igreja desde {membroDesde}, e por se achar em plena comunhão com a
            Igreja, pedimos que os recebais no Senhor, como usam fazer os santos.
          </Text>

          {obs && <Text style={s.obs}>Obs. {obs}</Text>}

          <CartaFooter
            data={data}
            nomeSecretario={nomeSecretario}
            cargoSecretario={cargoSecretario}
            nomePresidente={nomePresidente}
            cargoPresidente={cargoPresidente}
            numero={numero}
          />
        </View>

        <WaveBar flip />
      </Page>
    </Document>
  );
}
