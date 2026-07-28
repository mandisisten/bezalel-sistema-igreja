import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  ink: "#1c1917",
  muted: "#57534e",
  border: "#d6d3d1",
  accent: "#7c5c34",
};

export const certificateStyles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    color: colors.ink,
  },
  border: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.accent,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  logo: {
    width: 56,
    height: 56,
    objectFit: "contain",
    marginBottom: 8,
  },
  churchName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  churchAddress: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.8,
    marginHorizontal: 40,
    color: colors.ink,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginVertical: 12,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: colors.ink,
    width: 260,
    marginTop: 36,
    paddingTop: 6,
    textAlign: "center",
    fontSize: 10,
  },
  dateLine: {
    marginTop: 24,
    fontSize: 10,
    color: colors.muted,
  },
  docNumber: {
    position: "absolute",
    bottom: 16,
    right: 24,
    fontSize: 8,
    color: colors.muted,
  },
});

export const letterStyles = StyleSheet.create({
  page: {
    padding: 56,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: colors.ink,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
    objectFit: "contain",
  },
  churchName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  churchDetail: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 2,
  },
  title: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 20,
    letterSpacing: 1,
  },
  paragraph: {
    marginBottom: 12,
    textAlign: "justify",
  },
  place: {
    marginTop: 32,
    textAlign: "right",
  },
  footer: {
    marginTop: 56,
    alignItems: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: colors.ink,
    width: 260,
    marginTop: 36,
    paddingTop: 6,
    textAlign: "center",
    fontSize: 10,
  },
  docNumber: {
    position: "absolute",
    bottom: 24,
    right: 32,
    fontSize: 8,
    color: colors.muted,
  },
});

export const cardStyles = StyleSheet.create({
  page: {
    width: 243,
    height: 153,
    padding: 12,
    fontFamily: "Helvetica",
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    gap: 10,
  },
  photo: {
    width: 60,
    height: 72,
    objectFit: "cover",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoPlaceholder: {
    width: 60,
    height: 72,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#f5f5f4",
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  churchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  miniLogo: {
    width: 10,
    height: 10,
    objectFit: "contain",
  },
  churchName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: colors.accent,
  },
  memberName: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
  },
  label: {
    fontSize: 6.5,
    color: colors.muted,
    marginTop: 4,
  },
  value: {
    fontSize: 8,
  },
  qrRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  qr: {
    width: 34,
    height: 34,
  },
});
