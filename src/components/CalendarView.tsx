"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, EventContentArg } from "@fullcalendar/core";
import EventDetailModal from "./EventDetailModal";
import type { CalendarEvent } from "@/types";

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

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
    extendedProps: { organizerName: ev.organizerName, dateTime: ev.dateTime },
  }));

  function handleEventClick(info: EventClickArg) {
    setSelectedEventId(info.event.id);
  }

  function renderEventContent(arg: EventContentArg) {
    const { organizerName, dateTime } = arg.event.extendedProps;
    const time = formatTime(dateTime);
    return (
      <div className="fc-custom-event">
        <div className="fc-custom-event-line1">
          {time} &middot; {organizerName}
        </div>
        <div className="fc-custom-event-line2">{arg.event.title}</div>
      </div>
    );
  }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "",
          center: "prev title next",
          right: "",
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        height="auto"
        eventDisplay="block"
      />
      <EventDetailModal
        eventId={selectedEventId}
        onClose={() => setSelectedEventId(null)}
      />
    </>
  );
}
