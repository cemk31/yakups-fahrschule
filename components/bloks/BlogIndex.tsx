import { storyblokEditable } from "@storyblok/react/rsc";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import { fetchStories } from "@/lib/storyblok";
import type { BaseBlok, StoryblokAsset } from "./types";

interface BlogPostContent {
  title?: string;
  excerpt?: string;
  featuredImage?: StoryblokAsset;
  category?: string;
  tags?: string;
  publishedDate?: string;
  authorName?: string;
  readingTime?: string;
  sourceNetwork?: "instagram" | "facebook" | "manual";
}

export interface BlogIndexBlok extends BaseBlok {
  component: "blog_index";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  description?: string;
  emptyStateText?: string;
}

interface Props {
  blok: BlogIndexBlok;
}

/**
 * Übersichtsseite /news. Lädt alle blog_post-Stories unter news/ und
 * zeigt sie als Grid. Zeigt zusätzlich einen Kategorie-Filter, sobald
 * mehr als eine Kategorie belegt ist.
 */
export async function BlogIndex({ blok }: Props) {
  const posts = await fetchStories<BlogPostContent>({
    starts_with: "news/",
    content_type: "blog_post",
    sort_by: "content.publishedDate:desc",
    per_page: 100,
  });

  // Kategorien für einfache clientseitige Anker-Filter (Scroll-Jump auf #cat-<value>)
  const categories = Array.from(
    new Set(
      posts
        .map((p) => p.content.category)
        .filter((c): c is string => Boolean(c)),
    ),
  );

  return (
    <section
      {...storyblokEditable(blok)}
      className="py-16 md:py-20"
    >
      <Container>
        <div className="mb-10 max-w-2xl">
          {blok.tagline ? (
            <div className="mb-3.5">
              <Tag>{blok.tagline}</Tag>
            </div>
          ) : null}
          <h1 className="mb-4 text-3xl font-medium leading-tight md:text-[40px]">
            {blok.headline}
            {blok.headlineAccent ? (
              <span className="text-brand-green">.{blok.headlineAccent}</span>
            ) : null}
          </h1>
          {blok.description ? (
            <p className="text-[15px] leading-relaxed text-brand-text">
              {blok.description}
            </p>
          ) : null}
        </div>

        {categories.length > 1 ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-full bg-brand-green-soft px-3 py-1 text-[12px] font-medium text-[color:var(--color-brand-green-dark)]"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : null}

        {posts.length === 0 ? (
          <div className="rounded-brand border border-dashed border-brand-border bg-white p-10 text-center text-sm text-brand-text">
            {blok.emptyStateText ?? "Bald gibt's hier die ersten Beiträge."}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function PostCard({
  post,
}: {
  post: { full_slug: string; content: BlogPostContent; id: number };
}) {
  const img = post.content.featuredImage;
  const date = formatDate(post.content.publishedDate);

  return (
    <Link
      href={`/${post.full_slug}`}
      className="flex flex-col overflow-hidden rounded-brand border border-brand-border bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] bg-brand-green-soft">
        {img?.filename ? (
          <Image
            src={img.filename}
            alt={img.alt ?? post.content.title ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        {post.content.category ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-brand-ink shadow-sm">
            {post.content.category}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-brand-text">
          {date ? <span>{date}</span> : null}
          {date && post.content.readingTime ? (
            <span className="text-brand-border">•</span>
          ) : null}
          {post.content.readingTime ? (
            <span>{post.content.readingTime}</span>
          ) : null}
        </div>
        <h3 className="mb-2 text-[16px] font-medium leading-snug">
          {post.content.title}
        </h3>
        {post.content.excerpt ? (
          <p className="mb-4 line-clamp-3 text-[13px] leading-relaxed text-brand-text">
            {post.content.excerpt}
          </p>
        ) : null}
        <span className="mt-auto text-[13px] font-medium text-brand-green">
          Weiterlesen →
        </span>
      </div>
    </Link>
  );
}
