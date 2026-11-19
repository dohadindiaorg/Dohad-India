import type React from "react"
import type { Metadata } from "next"
import { Hind_Siliguri } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FooterSection } from "@/components/footer-section"
import { Toaster } from "@/components/ui/sonner"
import { getSiteSettings } from "@/lib/data/site-settings"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { OrganizationSchema, WebSiteSchema } from "@/components/json-ld"

export const revalidate = 60

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind-siliguri",
})

const siteUrl = "https://www.dohadindia.org"
const siteTitle = "DOHaD India – Developmental Origins of Health and Disease Regional Society"
const siteDescription =
  "DOHaD India Regional Society advances research, training, and policy on the developmental origins of health and disease in India, connecting researchers, clinicians, and policymakers."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | DOHaD India",
  },
  description: siteDescription,
  keywords: [
    "DOHaD India",
    "Developmental Origins of Health and Disease",
    "DOHaD research India",
    "fetal programming",
    "epigenetics India",
    "maternal nutrition research",
    "non-communicable diseases India",
    "perinatal health",
    "early life nutrition",
    "adolescent health research",
    "DOHaD society",
    "PHFI India",
    "maternal child health India",
    "intergenerational health",
    "DOHaD regional society",
  ],
  authors: [{ name: "DOHaD India Regional Society", url: siteUrl }],
  creator: "DOHaD India Regional Society",
  publisher: "DOHaD India Regional Society",
  category: "Health Research",
  classification: "Medical Research, Public Health",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${siteUrl}/api/events/feed`,
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "DOHaD India",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/dohad-india-rgb.png",
        width: 1024,
        height: 640,
        alt: "DOHaD India – Developmental Origins of Health and Disease Regional Society",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dohadindia",
    creator: "@dohadindia",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/dohad-india-rgb.png",
        alt: "DOHaD India – Developmental Origins of Health and Disease Regional Society",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "wJUk6I-8dL5wbsYmSzWYkRS8NVNrYKcdBkKhLtCYjXY",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let settings = null
  try {
    settings = JSON.parse(JSON.stringify(await getSiteSettings()))
  } catch {
    settings = null
  }

  return (
    <html lang="en" className={`${hindSiliguri.variable} antialiased`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="wJUk6I-8dL5wbsYmSzWYkRS8NVNrYKcdBkKhLtCYjXY" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <OrganizationSchema />
        <WebSiteSchema />
        <ThemeProvider>
          <main className="flex-1">{children}</main>
          <FooterSection settings={settings} />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
