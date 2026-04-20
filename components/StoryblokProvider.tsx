"use client";

import { storyblokInit, apiPlugin } from "@storyblok/react";

/**
 * Storyblok v6 braucht eine einmalige Client-Initialisierung, damit der
 * Visual Editor (Bridge) im Browser funktioniert.
 *
 * Wichtig: Wir importieren hier NICHT die Bloks-Registry.
 * Grund: Einige Bloks (z.B. BlogTeaser) sind async Server Components, die
 * `next/headers` aus lib/storyblok.ts transitiv ziehen. Würde der Client-
 * Provider das mitziehen, würde next/headers im Browser-Bundle landen und
 * der Build bricht.
 *
 * Die Server-Registry wird separat in lib/storyblok.ts bei der Server-Init
 * registriert - das reicht, damit StoryblokServerComponent beim RSC-Rendering
 * die richtigen Komponenten findet.
 */
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  use: [apiPlugin],
  apiOptions: { region: "eu" },
});

export function StoryblokProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
