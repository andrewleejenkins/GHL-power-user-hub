import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Community Calendar
        </Link>
        <nav className="flex gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Calendar
          </Link>
          <Link
            href="/submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Submit Event
          </Link>
        </nav>
      </div>
    </header>
  );
}
