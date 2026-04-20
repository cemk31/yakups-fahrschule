import "server-only";

import {
  apiPlugin,
  storyblokInit,
  getStoryblokApi,
  type ISbStoriesParams,
  type ISbStoryData,
} from "@storyblok/react/rsc";

// Blok-Komponenten-Registry
import { components } from "@/components/bloks";

/**
 * Einmal-Initialisierung der Storyblok SDK (serverseitig).
 * Der "server-only"-Import ganz oben sorgt dafür, dass Webpack/Turbopack
 * einen harten Fehler wirft, falls dieses Modul versehentlich in einen
 * Client-Bundle gezogen wird. Das schützt uns davor, next/headers ins
 * Browser-JS einzuziehen.
 */
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  use: [apiPlugin],
  components,
  apiOptions: {
    region: "eu", // DSGVO-konform, Server in Dublin
    cache: { clear: "auto", type: "memory" },
  },
});

export type StoryVersion = "draft" | "published";

/**
 * Gibt die aktive Story-Version zurück.
 * Im Draft-Mode (Visual Editor, Preview) "draft", sonst "published".
 *
 * Wichtig: draftMode() funktioniert nur in Request-Kontext (Server Component,
 * Route Handler, Server Action). In generateStaticParams oder sitemap.ts
 * muss stattdessen fetchPublishedStories verwendet werden.
 */
async function getStoryVersion(): Promise<StoryVersion> {
  const { draftMode } = await import("next/headers");
  const { isEnabled } = await draftMode();
  return isEnabled ? "draft" : "published";
}

/**
 * Holt eine einzelne Story anhand des Slugs.
 * Slug ist der Pfad ohne führenden Slash ("home", "lkw-fuehrerschein", etc.).
 */
export async function fetchStory<T = unknown>(
  slug: string,
  params: Partial<ISbStoriesParams> = {},
): Promise<ISbStoryData<T> | null> {
  const version = await getStoryVersion();

  try {
    const sbApi = getStoryblokApi();
    if (!sbApi) return null;
    const { data } = await sbApi.get(`cdn/stories/${slug}`, {
      version,
      resolve_links: "url",
      resolve_relations: [
        "location.teamMembers",
        "blog_post.relatedPosts",
      ].join(","),
      ...params,
    });
    return data.story as ISbStoryData<T>;
  } catch (error) {
    // 404 ist ein erwarteter Fehler - Seite nicht gefunden
    if ((error as { status?: number })?.status !== 404) {
      console.error(`[Storyblok] Fehler beim Laden von "${slug}":`, error);
    }
    return null;
  }
}

/**
 * Holt eine Liste von Stories (z.B. alle BlogPosts, alle LkwClasses).
 */
export async function fetchStories<T = unknown>(
  params: Partial<ISbStoriesParams> = {},
): Promise<ISbStoryData<T>[]> {
  const version = await getStoryVersion();
  return fetchStoriesInternal<T>(version, params);
}

/**
 * Explizit nur published Stories - verwendbar in generateStaticParams und
 * sitemap.ts, wo draftMode() nicht aufgerufen werden darf.
 */
export async function fetchPublishedStories<T = unknown>(
  params: Partial<ISbStoriesParams> = {},
): Promise<ISbStoryData<T>[]> {
  return fetchStoriesInternal<T>("published", params);
}

async function fetchStoriesInternal<T = unknown>(
  version: StoryVersion,
  params: Partial<ISbStoriesParams>,
): Promise<ISbStoryData<T>[]> {
  try {
    const sbApi = getStoryblokApi();
    if (!sbApi) return [];
    const { data } = await sbApi.get("cdn/stories", {
      version,
      per_page: 100,
      ...params,
    });
    return data.stories as ISbStoryData<T>[];
  } catch (error) {
    // Während des Builds ohne Tokens nicht als Fehler loggen, nur leeres
    // Array zurückgeben - damit bricht Build nicht ab.
    const status = (error as { status?: number })?.status;
    if (status !== 401 && status !== 404) {
      console.error("[Storyblok] Fehler beim Laden der Stories:", error);
    }
    return [];
  }
}

/**
 * Holt alle Slugs für statische Routen (generateStaticParams).
 * Nutzt explizit "published", da generateStaticParams zur Buildzeit läuft.
 *
 * Blog-Posts (content_type=blog_post) werden ausgeschlossen, weil die eine
 * eigene Detail-Route app/news/[slug]/page.tsx haben. Würden sie hier
 * mitkommen, würde Next.js versuchen, sie als Page-Story zu prerendern.
 */
export async function fetchAllSlugs(): Promise<string[]> {
  const stories = await fetchPublishedStories({
    starts_with: "",
    excluding_fields: "body",
    filter_query: {
      component: { not_in: "blog_post" },
    },
  });
  return stories.map((s) => s.full_slug).filter((s) => s !== "home");
}
