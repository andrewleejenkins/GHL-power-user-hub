"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EventSubmitForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const startDate = form.get("startDate") as string;
    const startTime = form.get("startTime") as string;
    const endTime = form.get("endTime") as string;
    const data = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      dateTime: `${startDate}T${startTime}`,
      endDateTime: `${startDate}T${endTime}`,
      location: form.get("location") as string,
      organizerName: form.get("organizerName") as string,
      organizerEmail: form.get("organizerEmail") as string,
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        if (body.details?.fieldErrors) {
          setErrors(body.details.fieldErrors);
        } else {
          setErrors({ _form: [body.error || "Something went wrong"] });
        }
        setSubmitting(false);
        return;
      }

      router.push("/submit-success");
    } catch {
      setErrors({ _form: ["Network error. Please try again."] });
      setSubmitting(false);
    }
  }

  const inputClass =
    "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#a50000] focus:outline-none focus:ring-1 focus:ring-[#a50000] transition-colors";
  const labelClass = "block text-xs font-medium uppercase tracking-wide text-gray-500 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors._form && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errors._form.join(", ")}
        </div>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Event Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className={inputClass}
          placeholder="Community Potluck Dinner"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] items-end gap-3">
        <div>
          <label htmlFor="startDate" className={labelClass}>
            Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            className={inputClass}
          />
        </div>
        <div className="w-28">
          <label htmlFor="startTime" className={labelClass}>
            From
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            required
            className={inputClass}
          />
          {errors.dateTime && (
            <p className="mt-1 text-xs text-red-600">{errors.dateTime[0]}</p>
          )}
        </div>
        <div className="w-28">
          <label htmlFor="endTime" className={labelClass}>
            To
          </label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            required
            className={inputClass}
          />
          {errors.endDateTime && (
            <p className="mt-1 text-xs text-red-600">{errors.endDateTime[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          Location / Link
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          className={inputClass}
          placeholder="https://zoom.us/j/1234567890"
        />
        {errors.location && (
          <p className="mt-1 text-xs text-red-600">{errors.location[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          className={inputClass}
          placeholder="Tell people what to expect..."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="organizerName" className={labelClass}>
            Your Name
          </label>
          <input
            id="organizerName"
            name="organizerName"
            type="text"
            required
            className={inputClass}
            placeholder="Jane Smith"
          />
          {errors.organizerName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.organizerName[0]}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="organizerEmail" className={labelClass}>
            Your Email
          </label>
          <input
            id="organizerEmail"
            name="organizerEmail"
            type="email"
            required
            className={inputClass}
            placeholder="jane@example.com"
          />
          {errors.organizerEmail && (
            <p className="mt-1 text-xs text-red-600">
              {errors.organizerEmail[0]}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-[#8b0000] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6b0000] disabled:opacity-50 transition-colors"
      >
        {submitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
