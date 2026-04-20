import { notFound } from "next/navigation";
import { StoryblokServerComponent } from "@storyblok/react/rsc";
import { fetchStory } from "@/lib/storyblok";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import type { PageBlok } from "@/components/bloks/Page";

/**
 * ISR: Seite wird im Hintergrund alle 60 Minuten neu gerendert.
 * Zusätzlich triggert der Storyblok-Webhook sofort ein Revalidate
 * beim Publish (siehe app/api/revalidate/route.ts).
 */
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const story = await fetchStory<PageBlok>("home");
  return buildMetadata(story, "/");
}

export default async function HomePage() {
  const story = await fetchStory<PageBlok>("home");

  if (!story) {
    notFound();
  }

  return <StoryblokServerComponent blok={story.content} />;
}
