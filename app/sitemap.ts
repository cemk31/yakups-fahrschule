import type { MetadataRoute } from "next";
import { fetchPublishedStories } from "@/lib/storyblok";
import { SITE_URL } from "@/lib/seo";

/**
 * Next.js ruft diese Funktion auf, um /sitemap.xml zu generieren.
 * Wir ziehen alle publizierten Stories aus Storyblok und listen sie auf.
 *
 * Wichtig: fetchPublishedStories, weil diese Funktion zur Buildzeit ohne
 * Request-Kontext läuft und draftMode() deshalb nicht verfügbar ist.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stories = await fetchPublishedStories({ excluding_fields: "body" });

  return stories.map((story) => ({
    url: story.full_slug === "home" ? SITE_URL : `${SITE_URL}/${story.full_slug}`,
    lastModified: new Date(story.published_at ?? story.created_at),
    changeFrequency: "weekly",
    priority: story.full_slug === "home" ? 1.0 : 0.7,
  }));
}
