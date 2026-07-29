import { Timestamp } from "firebase/firestore";

export function toTimestamp(dateInputValue: string | undefined | null): Timestamp | null {
  if (!dateInputValue) return null;
  return Timestamp.fromDate(new Date(dateInputValue));
}

export function toDateInputValue(value: Timestamp | null | undefined): string {
  if (!value) return "";
  return value.toDate().toISOString().slice(0, 10);
}

export function formatTimestamp(value: Timestamp | null | undefined): string {
  if (!value) return "—";
  return value.toDate().toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function formatTimestampDateTime(value: Timestamp | null | undefined): string {
  if (!value) return "—";
  return value.toDate().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function toDateTimeTimestamp(dateInputValue: string | undefined | null): Timestamp | null {
  if (!dateInputValue) return null;
  return Timestamp.fromDate(new Date(dateInputValue));
}

export function toDateTimeInputValue(value: Timestamp | null | undefined): string {
  if (!value) return "";
  const d = value.toDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
