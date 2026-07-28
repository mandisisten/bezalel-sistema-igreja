import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { certificateStyles as s } from "./styles";

export function CertificadoCurso({
  nomeIgreja,
  enderecoSede,
  logoPath,
  nomeMembro,
  nomeCurso,
  cargaHoraria,
  dataConclusao,
  instrutor,
  nomePresidente,
  cargoPresidente,
  numero,
}: {
  nomeIgreja: string;
  enderecoSede: string | null;
  logoPath?: string | null;
  nomeMembro: string;
  nomeCurso: string;
  cargaHoraria: number | null;
  dataConclusao: string;
  instrutor: string | null;
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
          <Text style={s.title}>Certificado de Conclusão</Text>
          <Text style={s.paragraph}>Certificamos para os devidos fins que</Text>
          <Text style={s.name}>{nomeMembro}</Text>
          <Text style={s.paragraph}>
            concluiu com aproveitamento o curso de {nomeCurso}
            {cargaHoraria ? `, com carga horária de ${cargaHoraria} horas,` : ""} finalizado em{" "}
            {dataConclusao}
            {instrutor ? `, ministrado por ${instrutor}` : ""}.
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
