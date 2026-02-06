import EventSubmitForm from "@/components/EventSubmitForm";

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submit an Event</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill out the form below. Your event will be reviewed before appearing
          on the public calendar.
        </p>
      </div>
      <EventSubmitForm />
    </main>
  );
}
