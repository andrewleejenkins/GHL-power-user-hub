"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/utils";

export default function EventSubmitForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      dateTime: form.get("dateTime") as string,
      endDateTime: form.get("endDateTime") as string,
      location: form.get("location") as string,
      organizerName: form.get("organizerName") as string,
      organizerEmail: form.get("organizerEmail") as string,
      category: form.get("category") as string,
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
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors._form && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
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

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className={inputClass}
          placeholder="Tell people what to expect..."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dateTime" className={labelClass}>
            Start Date &amp; Time
          </label>
          <input
            id="dateTime"
            name="dateTime"
            type="datetime-local"
            required
            className={inputClass}
          />
          {errors.dateTime && (
            <p className="mt-1 text-xs text-red-600">{errors.dateTime[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDateTime" className={labelClass}>
            End Date &amp; Time
          </label>
          <input
            id="endDateTime"
            name="endDateTime"
            type="datetime-local"
            required
            className={inputClass}
          />
          {errors.endDateTime && (
            <p className="mt-1 text-xs text-red-600">
              {errors.endDateTime[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          className={inputClass}
          placeholder="123 Main St, Town Hall"
        />
        {errors.location && (
          <p className="mt-1 text-xs text-red-600">{errors.location[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <select id="category" name="category" required className={inputClass}>
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat.toLowerCase()}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-red-600">{errors.category[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Event for Review"}
      </button>
    </form>
  );
}
