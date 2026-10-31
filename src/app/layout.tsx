import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "OomniEye — Approvals & Review | Command Centre",
  description: "AI-Augmented Approvals Command Centre for OomniEye Digital Twin Solutions",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
