import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compete Intel // CIA — Competitive Intelligence Agent",
  description:
    "Track competitor moves, uncover strategic signals, and make better decisions with CIA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F4F0E8] text-[#182027] font-sans">
        {children}
      </body>
    </html>
  );
}
