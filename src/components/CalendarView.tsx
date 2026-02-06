"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";
import EventDetailModal from "./EventDetailModal";
import type { CalendarEvent } from "@/types";

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data: CalendarEvent[]) => setEvents(data))
      .catch(console.error);
  }, []);

  const calendarEvents = events.map((ev) => ({
    id: ev.id,
    title: ev.title,
    start: ev.dateTime,
    end: ev.endDateTime,
    extendedProps: { category: ev.category },
  }));

  function handleEventClick(info: EventClickArg) {
    setSelectedEventId(info.event.id);
  }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        height="auto"
        eventDisplay="block"
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
      />
      <EventDetailModal
        eventId={selectedEventId}
        onClose={() => setSelectedEventId(null)}
      />
    </>
  );
}
