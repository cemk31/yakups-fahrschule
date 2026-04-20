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
