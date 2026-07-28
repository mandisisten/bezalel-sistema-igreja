import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { colors } from "./styles";

const s = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.ink,
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 28,
    height: 28,
    objectFit: "contain",
  },
  churchName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  title: {
    fontSize: 10,
    marginTop: 4,
    color: colors.muted,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f4",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cellHeader: {
    padding: 5,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  cell: {
    padding: 5,
    fontSize: 8,
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    fontSize: 7,
    color: colors.muted,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export function RelatorioPdf({
  nomeIgreja,
  titulo,
  logoPath,
  headers,
  rows,
  geradoEm,
}: {
  nomeIgreja: string;
  titulo: string;
  logoPath?: string | null;
  headers: string[];
  rows: (string | number)[][];
  geradoEm: string;
}) {
  const widthPct = `${100 / headers.length}%`;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.header}>
          {logoPath && <Image src={logoPath} style={s.logo} />}
          <View>
            <Text style={s.churchName}>{nomeIgreja}</Text>
            <Text style={s.title}>{titulo}</Text>
          </View>
        </View>

        <View style={s.table}>
          <View style={s.headerRow} fixed>
            {headers.map((h, i) => (
              <Text key={i} style={[s.cellHeader, { width: widthPct }]}>
                {h}
              </Text>
            ))}
          </View>
          {rows.map((row, ri) => (
            <View key={ri} style={s.row} wrap={false}>
              {row.map((cell, ci) => (
                <Text key={ci} style={[s.cell, { width: widthPct }]}>
                  {String(cell)}
                </Text>
              ))}
            </View>
          ))}
          {rows.length === 0 && (
            <View style={s.row}>
              <Text style={s.cell}>Nenhum registro encontrado.</Text>
            </View>
          )}
        </View>

        <View style={s.footer} fixed>
          <Text>Gerado em {geradoEm}</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
