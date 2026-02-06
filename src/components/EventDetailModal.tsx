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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          </div>
        ) : event ? (
          <>
            <div className="mb-5 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {event.title}
              </h2>
              <button
                onClick={onClose}
                className="ml-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3 text-sm">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <div className="text-gray-700">
                  {formatDateTime(event.dateTime)}
                  <span className="text-gray-400"> &ndash; </span>
                  {formatDateTime(event.endDateTime)}
                </div>
              </div>

              <div className="flex gap-3 text-sm">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span className="text-gray-700">{event.location}</span>
              </div>

              <div className="flex gap-3 text-sm">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <span className="text-gray-700">{event.organizerName}</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="whitespace-pre-wrap text-sm text-gray-600">
                {event.description}
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </>
        ) : (
          <p className="py-8 text-center text-sm text-gray-500">
            Event not found.
          </p>
        )}
      </div>
    </div>
  );
}
