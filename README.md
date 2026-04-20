# Yakups Fahrschule - Next.js + Storyblok

Moderne SEO-optimierte Webseite für Yakups Fahrschule. Next.js 16 mit App Router, Storyblok als Headless CMS, Tailwind v4, hostet auf Vercel.

## Stack

- **Next.js 16** mit App Router, Server Components, ISR (Turbopack-Build)
- **Storyblok v6** (EU-Region, DSGVO-konform) als Headless CMS
- **Tailwind CSS v4** mit Brand-Tokens als `@theme`
- **React 19** + **TypeScript 5** überall
- Fonts lokal gehostet via `next/font` (kein Google-Fonts-Request)

## Erstmaliger Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Storyblok-Space einrichten

1. Auf [storyblok.com](https://www.storyblok.com/) einloggen, neuen Space anlegen (EU-Region!)
2. Under **Settings > Access Tokens** zwei Tokens erstellen:
   - **Public Token** (Preview + Published) für `NEXT_PUBLIC_STORYBLOK_TOKEN`
   - **Preview Token** für `STORYBLOK_PREVIEW_TOKEN`
3. Content-Types anlegen: entweder manuell nach den JSON-Schemas in `/storyblok-schemas` oder per Management-API importieren.

### 3. Environment-Variablen

```bash
cp .env.example .env.local
```

Dann `.env.local` befüllen:
- `NEXT_PUBLIC_STORYBLOK_TOKEN` - Public Access Token
- `STORYBLOK_PREVIEW_TOKEN` - Preview Token
- `STORYBLOK_WEBHOOK_SECRET` - selbst gewählter String (in Storyblok Webhook-Settings verwenden)

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Läuft auf [http://localhost:3000](http://localhost:3000).

Wichtig: Solange in Storyblok noch keine Story `home` existiert, zeigt die Startseite die 404-Seite. Als Erstes in Storyblok eine Story namens `home` anlegen mit Content-Type `page`, dann Bloks hinzufügen.

## Projektstruktur

```
yakups-fahrschule/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root-Layout, Fonts, JSON-LD
│   ├── page.tsx                  # Homepage (Story "home")
│   ├── [...slug]/page.tsx        # Catch-All für alle anderen Seiten
│   ├── api/
│   │   ├── revalidate/route.ts   # Webhook von Storyblok
│   │   ├── contact/route.ts      # Kontakt-Formular → Resend
│   │   └── draft/route.ts        # Draft-Mode für Visual Editor
│   ├── sitemap.ts                # Dynamische Sitemap
│   ├── robots.ts
│   └── not-found.tsx
├── components/
│   ├── bloks/                    # 1:1 Mapping zu Storyblok Bloks
│   │   ├── index.ts              # <-- Blok-Registry, hier neue Bloks eintragen
│   │   ├── Page.tsx              # Universeller Container mit body-Feld
│   │   ├── HeroSection.tsx       # Startseiten-Hero mit Bild & Stats
│   │   ├── UspStrip.tsx          # 4er-Grid mit Icons
│   │   ├── ClassGrid.tsx         # PKW/LKW-Karten
│   │   ├── LkwSpotlight.tsx      # Dunkler Spotlight-Bereich mit 5 Steps
│   │   ├── ProcessSteps.tsx      # Vertikale Prozess-Liste (LKW-Ablauf)
│   │   ├── PricingTable.tsx      # Kostentabelle mit Promo-Box
│   │   ├── LocationsMap.tsx      # Standortkarten
│   │   ├── TeamGrid.tsx          # Team-Vorstellung
│   │   ├── BlogTeaser.tsx        # Neueste Blog-Posts
│   │   ├── ReviewsSection.tsx    # Google-Bewertungen
│   │   ├── CtaSection.tsx        # Grüne Call-to-Action
│   │   ├── ValueCards.tsx        # 3er-Grid mit USP-Karten
│   │   ├── LicenseClassGrid.tsx  # Detaillierte Klassen-Übersicht (LKW-Page)
│   │   ├── ComparisonTable.tsx   # Vergleichstabelle mehrerer Klassen
│   │   ├── DownloadSection.tsx   # Download-Karten für PDFs/Formulare
│   │   ├── ContactForm.tsx       # Kontakt-Formular (Client, validiert)
│   │   ├── FaqAccordion.tsx      # FAQ mit Client-State
│   │   └── types.ts              # Shared types für Storyblok-Assets/Links
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ui/                       # Atomare Komponenten
│   │   ├── Button.tsx
│   │   ├── Tag.tsx
│   │   ├── Container.tsx
│   │   └── Logo.tsx
│   └── StoryblokProvider.tsx
├── lib/
│   ├── storyblok.ts              # SDK-Init, fetchStory, fetchStories
│   ├── seo.ts                    # Metadata-Helper
│   └── schema.tsx                # JSON-LD Builder
└── storyblok-schemas/            # Storyblok Content-Type Definitionen
```

## Storyblok-Webhook einrichten

Damit Änderungen im CMS sofort auf der Website sichtbar werden:

1. In Storyblok unter **Settings > Webhooks** einen neuen Webhook erstellen
2. Trigger: "Story published" und "Story unpublished"
3. URL: `https://yakups-fahrschule.de/api/revalidate?secret=DEIN_WEBHOOK_SECRET`

## Visual Editor einrichten

Damit du im Storyblok Visual Editor direkt die Website siehst:

1. In Storyblok unter **Settings > Visual Editor**
2. Location: `http://localhost:3000/api/draft?secret=DEIN_WEBHOOK_SECRET&slug=/`
3. Für Produktion: `https://yakups-fahrschule.de/api/draft?secret=...&slug=/`

## Deployment auf Vercel

1. Repo auf GitHub pushen
2. Auf [vercel.com](https://vercel.com) importieren
3. Environment-Variablen dort eintragen
4. Domain `yakups-fahrschule.de` zuweisen
5. In Storyblok die Webhook-URL auf die Produktions-URL ändern

## Neue Bloks hinzufügen

Das ist der häufigste Entwicklungs-Workflow:

1. Content-Type in Storyblok anlegen (als JSON-Schema in `/storyblok-schemas` dokumentieren)
2. React-Komponente in `components/bloks/DeinBlok.tsx` schreiben
3. In `components/bloks/index.ts` zur Registry hinzufügen:
   ```ts
   import { DeinBlok } from "./DeinBlok";
   export const components = { ...bestehende, dein_blok: DeinBlok };
   ```
4. Im Visual Editor testen

Keine Route-Änderungen nötig - der Catch-All-Router findet alles automatisch.

## Kontakt-Formular einrichten

Das `contact_form`-Blok schickt Anfragen über [Resend](https://resend.com) (EU-Region verfügbar, DSGVO-konform). Drei Env-Variablen sind nötig:

- `RESEND_API_KEY` - API-Key aus dem Resend-Dashboard
- `CONTACT_FROM_EMAIL` - Absender (muss eine verifizierte Domain bei Resend sein)
- `CONTACT_TO_EMAIL` - Empfänger (Yakups Postfach)

Solange die Variablen fehlen, läuft die Route im Dry-Run-Modus und loggt nur — praktisch für lokale Entwicklung ohne Resend-Account.

## Unterseiten-Übersicht

| Slug | Zweck | Beispielstory |
|---|---|---|
| `home` | Startseite | `_example-home-story.json` |
| `fuehrerscheine` | PKW-Klassen B, BE, B96, B197 | `_example-fuehrerscheine-story.json` |
| `lkw-fuehrerschein` | LKW & BKF-Ausbildung | noch anzulegen |

## Was noch zu tun ist

Dieses Starter-Repo enthält alle Bloks für Startseite, PKW-Führerscheine-Seite und die LKW-Landingpage. Noch offen:

- [ ] LKW-Beispielstory dokumentieren (Slug: `lkw-fuehrerschein`)
- [ ] Team-Übersichtsseite (Story `team`)
- [ ] Standorte als eigenständige Detailseiten (`standort/bad-iburg`, `standort/hilter`)
- [ ] Blog-Post Content-Type mit Social-Import-Automation (Make.com Blueprint)
- [ ] TeamMember Content-Type als eigenständige Detailseiten (aktuell nur inline im TeamGrid)
- [ ] Breadcrumb-Komponente mit Schema.org JSON-LD
- [ ] Cookie-Banner (oder Integration mit bspw. Usercentrics)
- [ ] OG-Default-Image in `/public/og-default.jpg` ablegen

## Lizenz

Interner Code der Yakups Fahrschule. Nicht für Dritte bestimmt.
