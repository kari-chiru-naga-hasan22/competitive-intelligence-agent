import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compete Intel // CIA — Competitive Intelligence Agent",
  description:
    "Track competitor moves, uncover strategic signals, and make better decisions with CIA.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F7F9FF] text-[#0B0D24] font-sans">
        {children}
      </body>
    </html>
  );
}
