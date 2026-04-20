import { notFound } from "next/navigation";
import { StoryblokServerComponent } from "@storyblok/react/rsc";
import { fetchStory, fetchAllSlugs } from "@/lib/storyblok";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import type { PageBlok } from "@/components/bloks/Page";

/**
 * Diese Catch-All-Route übernimmt ALLE Unterseiten automatisch.
 * /lkw-fuehrerschein, /impressum, /standort/bad-iburg - alles hier.
 *
 * generateStaticParams sorgt dafür, dass zum Build-Zeitpunkt alle
 * existierenden Seiten vorgerendert werden. Neue Seiten, die später in
 * Storyblok angelegt werden, werden per ISR on-demand generiert.
 */
export const revalidate = 3600;
export const dynamicParams = true;

interface RouteParams {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  return slugs.map((fullSlug) => ({ slug: fullSlug.split("/") }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const story = await fetchStory<PageBlok>(slugPath);
  return buildMetadata(story, `/${slugPath}`);
}

export default async function DynamicPage({ params }: RouteParams) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const story = await fetchStory<PageBlok>(slugPath);

  if (!story) {
    notFound();
  }

  return <StoryblokServerComponent blok={story.content} />;
}
