import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Day Score",
  description: "Game Day 점수 현황",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
