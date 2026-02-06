import CalendarView from "@/components/CalendarView";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Community Events
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse upcoming events in our community.
        </p>
      </div>
      <CalendarView />
    </main>
  );
}
