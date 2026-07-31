import { Document, Page, Text, View } from "@react-pdf/renderer";
import { s, WaveBar, CartaHeader, CartaTipoBox, CartaFooter } from "./carta-eclesiastica";

export function CartaRecomendacao({
  nomeIgreja,
  enderecoSede,
  cidadeSede,
  logoPath,
  nomeMembro,
  congregacaoOrigem,
  membroDesde,
  tipo,
  destinatario,
  finalidade,
  interna,
  data,
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
  tipo: string;
  destinatario: string | null;
  finalidade: string | null;
  interna: boolean;
  data: string;
  observacoes: string | null;
  nomePresidente: string | null;
  cargoPresidente: string | null;
  nomeSecretario: string | null;
  cargoSecretario: string | null;
  numero: string;
}) {
  const papel = tipo === "OBREIRO" ? "obreiro(a)" : "membro(a)";

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

          <CartaTipoBox
            tipo="RECOMENDACAO"
            interna={interna}
            congregacaoOrigem={congregacaoOrigem}
          />

          <Text style={s.saudacao}>&ldquo;A Paz do Senhor Jesus&rdquo;</Text>

          <Text style={s.paragraph}>
            Apresentamos {destinatario ? `à ${destinatario}` : "a quem possa interessar"}, o
            irmão(ã) <Text style={{ fontFamily: "Times-Bold" }}>{nomeMembro}</Text>.
          </Text>

          <Text style={s.paragraph}>
            {papel === "obreiro(a)" ? "Obreiro(a)" : "Membro(a)"} desta Igreja desde {membroDesde}
            {finalidade ? `, com a finalidade de ${finalidade}` : ""}, e por se achar em plena
            comunhão com a Igreja, pedimos que o(a) recebais no Senhor, como usam fazer os santos.
          </Text>

          {observacoes && <Text style={s.obs}>Obs. {observacoes}</Text>}

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
