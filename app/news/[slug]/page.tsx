import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchStory, fetchPublishedStories } from "@/lib/storyblok";
import { buildMetadata } from "@/lib/seo";
import { BlogPostPage, type BlogPostBlok } from "@/components/bloks/BlogPostPage";

/**
 * Detailseite für einen einzelnen Blog-Post unter /news/<slug>.
 *
 * Diese Route ist spezifischer als die Catch-All-Route in app/[...slug]/page.tsx
 * und wird von Next.js bevorzugt. Die Catch-All-Route kümmert sich um alle
 * anderen page-Stories (inkl. /news selbst).
 */

export const revalidate = 3600;
export const dynamicParams = true;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const stories = await fetchPublishedStories({
    starts_with: "news/",
    content_type: "blog_post",
    per_page: 100,
  });
  return stories
    .map((s) => {
      // s.full_slug ist "news/neuer-theoriekurs" → nur den letzten Part als slug
      const parts = s.full_slug.split("/");
      return { slug: parts[parts.length - 1] };
    })
    .filter((p) => p.slug);
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const story = await fetchStory<BlogPostBlok>(`news/${slug}`);
  return buildMetadata(story, `/news/${slug}`);
}

export default async function BlogPostRoute({ params }: RouteParams) {
  const { slug } = await params;
  const story = await fetchStory<BlogPostBlok>(`news/${slug}`);

  if (!story) {
    notFound();
  }

  return <BlogPostPage blok={story.content} />;
}
