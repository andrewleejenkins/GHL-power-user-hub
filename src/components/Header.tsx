"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 relative">
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
          <span className="hidden md:inline">Power Users Community Calendar</span>
        </Link>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
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
        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden rounded-md p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute right-0 top-14 z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Calendar
          </Link>
        </div>
      )}
    </header>
  );
}
