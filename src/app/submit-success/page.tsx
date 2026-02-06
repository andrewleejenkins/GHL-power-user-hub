import Link from "next/link";

export default function SubmitSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          Event Submitted
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Thank you! Your event will be reviewed by an administrator and will
          appear on the calendar once approved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Calendar
          </Link>
          <Link
            href="/submit"
            className="rounded-md bg-[#8b0000] px-4 py-2 text-sm font-medium text-white hover:bg-[#6b0000] transition-colors"
          >
            Submit Another
          </Link>
        </div>
      </div>
    </div>
  );
}
