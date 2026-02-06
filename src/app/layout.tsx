import type { Metadata } from "next";
import { Inter_Tight, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["900"],
});

export const metadata: Metadata = {
  title: "Power Users Community Calendar",
  description:
    "A public calendar for community events. Submit your event for review.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interTight.variable} ${outfit.variable} antialiased flex min-h-screen flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
