import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { authClient } from '@/lib/auth/client';
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import AuthModal from '@/components/auth/AuthModal';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: "zeqqat",
  description: "Data-driven betting research tools",
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
          social={{ providers: ['google', 'telegram'] }}
          redirectTo="/nyumbani"
          emailOTP
        >
          <main className="min-h-screen">
            {children}
          </main>
          <AuthModal />
        </NeonAuthUIProvider>
      <Analytics />
      <SpeedInsights />
        </body>
    </html>
  );
}