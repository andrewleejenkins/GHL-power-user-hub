import EventSubmitForm from "@/components/EventSubmitForm";

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <div className="rounded-lg bg-white p-6" style={{ border: "1px solid #151515" }}>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 uppercase">
            Submit an Event
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Your event will be reviewed by an admin before appearing on the
            public calendar.
          </p>
        </div>
        <EventSubmitForm />
      </div>
    </div>
  );
}
