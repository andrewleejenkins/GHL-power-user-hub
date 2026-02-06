"use client";

import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

interface EventDetailModalProps {
  eventId: string | null;
  onClose: () => void;
}

export default function EventDetailModal({
  eventId,
  onClose,
}: EventDetailModalProps) {
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setEvent(null);
      return;
    }

    setLoading(true);
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId]);

  if (!eventId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : event ? (
          <>
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-lg font-bold text-gray-900">{event.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-medium">When:</span>{" "}
                {formatDateTime(event.dateTime)} &ndash;{" "}
                {formatDateTime(event.endDateTime)}
              </p>
              <p>
                <span className="font-medium">Where:</span> {event.location}
              </p>
              <p>
                <span className="font-medium">Category:</span> {event.category}
              </p>
              <p>
                <span className="font-medium">Organizer:</span>{" "}
                {event.organizerName}
              </p>
              <div>
                <span className="font-medium">Description:</span>
                <p className="mt-1 whitespace-pre-wrap text-gray-600">
                  {event.description}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
          </>
        ) : (
          <p className="text-sm text-red-600">Event not found.</p>
        )}
      </div>
    </div>
  );
}
