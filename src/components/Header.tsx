import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-14">
        <Link href="/" className="flex items-center gap-2 text-gray-900 uppercase" style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif", fontWeight: 900 }}>
          <svg
            className="h-5 w-5 text-[#8b0000]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          Power Users Community Calendar
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Calendar
          </Link>
          <Link
            href="/submit"
            className="ml-2 rounded-md bg-[#8b0000] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[#6b0000] transition-colors"
          >
            Submit Request
          </Link>
        </div>
      </div>
    </header>
  );
}
