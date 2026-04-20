import type { Metadata } from "next";
import type { ISbStoryData } from "@storyblok/react/rsc";

const SITE_NAME = "Yakups Fahrschule";
const SITE_URL = "https://yakups-fahrschule.de";
const DEFAULT_DESCRIPTION =
  "Moderne Fahrschule in Bad Iburg und Hilter. PKW, Motorrad und LKW-Führerschein mit Bildungsgutschein-Förderung.";

interface SeoFields {
  title?: string;
  description?: string;
  ogImage?: { filename: string; alt?: string };
  noindex?: boolean;
}

/**
 * In unseren Storyblok-Schemas ist das "seo"-Feld ein bloks-Array mit
 * maximum=1, weil das im Editor wesentlich angenehmer ist als ein einzelnes
 * Objekt. Manche Bestands-Stories haben aber auch nur ein flaches Objekt.
 * Diese Helper-Funktion akzeptiert beide Formen.
 */
type SeoLike = SeoFields | SeoFields[] | undefined;
function normalizeSeo(seo: SeoLike): SeoFields | undefined {
  if (!seo) return undefined;
  if (Array.isArray(seo)) return seo[0];
  return seo;
}

/**
 * Shape-Check: jede Story, die wir als Quelle für Metadaten akzeptieren,
 * muss optional "title" und "seo" haben. Weitere Felder sind egal.
 */
interface StoryWithSeo {
  title?: string;
  seo?: SeoLike;
  [key: string]: unknown;
}

/**
 * Generiert Next.js-Metadata aus einem Story-Objekt.
 * Jede Page-Story in Storyblok hat optional einen "seo"-Block mit Title,
 * Description und OG-Image. Wenn nicht gesetzt, fallen wir auf sinnvolle
 * Defaults zurück.
 *
 * Generisch über T, damit beliebige Story-Content-Types akzeptiert werden,
 * solange sie die SEO-Felder tragen können.
 */
export function buildMetadata<T extends StoryWithSeo>(
  story: ISbStoryData<T> | null,
  path: string = "",
): Metadata {
  const seo = normalizeSeo(story?.content?.seo);
  const title = seo?.title ?? story?.content?.title ?? SITE_NAME;
  const description = seo?.description ?? DEFAULT_DESCRIPTION;
  const canonical = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const ogImage = seo?.ogImage?.filename
    ? [{ url: seo.ogImage.filename, alt: seo.ogImage.alt ?? title }]
    : [{ url: `${SITE_URL}/og-default.jpg`, alt: SITE_NAME }];

  return {
    title: title === SITE_NAME ? title : `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: ogImage,
      locale: "de_DE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage.map((img) => img.url),
    },
    robots: seo?.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export { SITE_NAME, SITE_URL };
