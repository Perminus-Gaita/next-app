// app/layout.tsx
import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My App",
  description: "Welcome to my application",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}