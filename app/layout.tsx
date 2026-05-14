import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import QueryProviders from "@/contexts/query-provider";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/navigations/ScrollToTop";
import { AuthProvider } from "@/components/auth/auth-provider";
import { SocketProvider } from "@/components/providers/socket-provider";

export const metadata: Metadata = {
  title: "FolaIgnite - Learn, Build, and Ignite Change",
  description: "30 Minutes at a Time - Join the learning revolution",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FolaIgnite",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "FolaIgnite",
    title: "FolaIgnite - Learn, Build, and Ignite Change",
    description: "30 Minutes at a Time - Join the learning revolution",
  },
  twitter: {
    card: "summary_large_image",
    title: "FolaIgnite - Learn, Build, and Ignite Change",
    description: "30 Minutes at a Time - Join the learning revolution",
  },
};

import { LoadingScreen } from "@/components/shared/LoadingScreen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FF6B35" />
      </head>
      <QueryProviders>
        <AuthProvider>
          <SocketProvider>
            <body
              className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
              suppressHydrationWarning
            >
              <Toaster position="top-center" />
              <ScrollToTop />
              <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
              <Analytics />
            </body>
          </SocketProvider>
        </AuthProvider>
      </QueryProviders>
    </html>
  );
}
