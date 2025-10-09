import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <meta name="theme-color" content="#FF6B35" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
