import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoryblokProvider } from "@/components/StoryblokProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd, localBusinessSchema } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

/**
 * Inter via next/font - wird beim Build lokal gebündelt, also DSGVO-konform.
 * Kein Request an Google-Fonts zur Laufzeit.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Moderne Fahrschule in Bad Iburg und Hilter. PKW, Motorrad und LKW-Führerschein mit Bildungsgutschein-Förderung.",
  // Next.js 16 erkennt app/icon.png und app/apple-icon.png automatisch,
  // wir setzen hier zusätzlich die Android/PWA-Größen und das OG-Bild.
  icons: {
    icon: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Moderne Fahrschule in Bad Iburg und Hilter. PKW, Motorrad und LKW-Führerschein mit Bildungsgutschein-Förderung.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Moderne Fahrschule in Bad Iburg und Hilter. PKW, Motorrad und LKW-Führerschein mit Bildungsgutschein-Förderung.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
};

// viewport separat exportieren (Next 16 empfiehlt das)
export const viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <head>
        <JsonLd data={localBusinessSchema} />
      </head>
      <body>
        <StoryblokProvider>
          <Header />
          {children}
          <Footer />
        </StoryblokProvider>
      </body>
    </html>
  );
}
