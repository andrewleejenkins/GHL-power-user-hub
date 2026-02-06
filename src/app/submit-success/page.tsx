import Link from "next/link";

export default function SubmitSuccessPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="rounded-lg bg-green-50 p-8">
        <h1 className="text-2xl font-bold text-green-800">
          Event Submitted!
        </h1>
        <p className="mt-3 text-sm text-green-700">
          Thank you for submitting your event. It will be reviewed by an
          administrator and will appear on the calendar once approved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
          >
            View Calendar
          </Link>
          <Link
            href="/submit"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Submit Another
          </Link>
        </div>
      </div>
    </main>
  );
}
