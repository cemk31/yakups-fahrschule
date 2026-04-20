import { SITE_NAME, SITE_URL } from "./seo";

/**
 * Diese Helper bauen Schema.org JSON-LD für verschiedene Seitentypen.
 * JSON-LD wird als <script type="application/ld+json"> im <head> injiziert.
 *
 * Warum wichtig: Google nutzt das für Rich Snippets in den Suchergebnissen.
 * Eine FAQ-Seite mit korrektem FAQPage-Schema bekommt oft direkt in Google
 * ausklappbare FAQ-Boxen angezeigt, was die Klickrate deutlich erhöht.
 */

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "DrivingSchool",
  name: SITE_NAME,
  url: SITE_URL,
  telephone: "+491743838353",
  email: "info@yakups-fahrschule.de",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Arkadenstraße 5",
    addressLocality: "Bad Iburg",
    postalCode: "49186",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    // TODO: Echte Koordinaten eintragen
    latitude: 52.158,
    longitude: 8.046,
  },
  areaServed: [
    { "@type": "City", name: "Osnabrück" },
    { "@type": "City", name: "Bad Iburg" },
    { "@type": "City", name: "Hilter" },
    { "@type": "AdministrativeArea", name: "Landkreis Osnabrück" },
  ],
  sameAs: [
    "https://www.facebook.com/pages/category/Driving-School/Yakups-Fahrschule-472136116526383/",
    "https://www.instagram.com/yakupsfahrschule/",
  ],
};

interface CourseParams {
  name: string;
  description: string;
  licenseClass: string;
  url: string;
}

export function courseSchema({
  name,
  description,
  licenseClass,
  url,
}: CourseParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "DrivingSchool",
      name: SITE_NAME,
      url: SITE_URL,
    },
    url,
    educationalCredentialAwarded: `Führerschein Klasse ${licenseClass}`,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Blended",
      location: {
        "@type": "Place",
        name: `${SITE_NAME} Bad Iburg`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Arkadenstraße 5",
          addressLocality: "Bad Iburg",
          postalCode: "49186",
          addressCountry: "DE",
        },
      },
    },
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Kleine Helper-Komponente zum Rendern von JSON-LD.
 * Nutzung: <JsonLd data={localBusinessSchema} />
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
