import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { authClient } from '@/lib/auth/client';
import { NeonAuthUIProvider, UserButton } from '@neondatabase/auth/react';

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900">
        <NeonAuthUIProvider
          authClient={authClient}
          redirectTo="/account/settings"
          emailOTP
        >
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <UserButton size="icon" />
          </header>
          <main className="min-h-screen">
            {children}
          </main>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}