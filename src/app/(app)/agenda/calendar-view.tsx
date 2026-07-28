"use client";

import { useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TIPO_EVENTO_OPTIONS } from "@/lib/evento-options";

const locales = { "pt-BR": ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: ptBR }),
  getDay,
  locales,
});

const MESSAGES = {
  next: "Próximo",
  previous: "Anterior",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Lista",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Nenhum evento neste período.",
  showMore: (total: number) => `+ ${total} mais`,
};

type EventoCalendario = {
  id: number;
  titulo: string;
  tipo: string | null;
  inicio: Date;
  fim: Date;
};

function tipoLabel(tipo: string | null) {
  return TIPO_EVENTO_OPTIONS.find((o) => o.value === tipo)?.label ?? "Evento";
}

export function CalendarView({ eventos }: { eventos: EventoCalendario[] }) {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const events = useMemo(
    () =>
      eventos.map((e) => ({
        id: e.id,
        title: e.titulo,
        resource: tipoLabel(e.tipo),
        start: e.inicio,
        end: e.fim,
      })),
    [eventos],
  );

  const handleSelectEvent = useCallback(
    (event: { id: number }) => {
      router.push(`/agenda/${event.id}`);
    },
    [router],
  );

  return (
    <div className="h-[70vh] rounded-lg border bg-background p-2">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: "100%" }}
        views={["month", "week", "day", "agenda"] as View[]}
        date={date}
        onNavigate={setDate}
        view={view}
        onView={setView}
        messages={MESSAGES}
        culture="pt-BR"
        onSelectEvent={handleSelectEvent}
        popup
      />
    </div>
  );
}
