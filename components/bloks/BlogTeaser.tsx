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
  readingTime?: string;
  sourceNetwork?: "instagram" | "facebook" | "manual";
}

export interface BlogTeaserBlok extends BaseBlok {
  component: "blog_teaser";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  sideLinkLabel?: string;
  sideLinkUrl?: string;
  maxPosts?: number;
}

interface Props {
  blok: BlogTeaserBlok;
}

/**
 * Lädt die neuesten BlogPosts aus Storyblok.
 * Server Component, also async direkt in Next.js-App-Router nutzbar.
 */
export async function BlogTeaser({ blok }: Props) {
  const posts = await fetchStories<BlogPostContent>({
    starts_with: "news/",
    content_type: "blog_post",
    sort_by: "published_at:desc",
    per_page: blok.maxPosts ?? 3,
  });

  return (
    <section {...storyblokEditable(blok)} className="py-16 md:py-20">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            {blok.tagline ? (
              <div className="mb-3.5">
                <Tag>{blok.tagline}</Tag>
              </div>
            ) : null}
            <h2 className="text-3xl font-medium leading-tight md:text-[34px]">
              {blok.headline}
              {blok.headlineAccent ? (
                <span className="text-brand-green">.{blok.headlineAccent}</span>
              ) : null}
            </h2>
          </div>
          <Link
            href={blok.sideLinkUrl ?? "/news"}
            className="text-sm font-medium hover:text-brand-green"
          >
            {blok.sideLinkLabel ?? "Zum Blog"} →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts.length === 0 ? (
            <p className="col-span-full text-sm text-brand-text">
              Noch keine Blog-Posts veröffentlicht.
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function PostCard({
  post,
}: {
  post: { full_slug: string; content: BlogPostContent };
}) {
  const img = post.content.featuredImage;

  return (
    <Link
      href={`/${post.full_slug}`}
      className="flex flex-col overflow-hidden rounded-brand border border-brand-border bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-brand-ink">
        {img?.filename ? (
          <Image
            src={img.filename}
            alt={img.alt ?? post.content.title ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
        {post.content.sourceNetwork ? (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
            <SourceIcon network={post.content.sourceNetwork} />
            {post.content.sourceNetwork === "instagram"
              ? "Instagram"
              : post.content.sourceNetwork === "facebook"
                ? "Facebook"
                : null}
          </div>
        ) : null}
      </div>
      <div className="p-5">
        {(post.content.category || post.content.readingTime) ? (
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-brand-green">
            {[post.content.category, post.content.readingTime]
              .filter(Boolean)
              .join(" · ")}
          </div>
        ) : null}
        <h3 className="mb-2 text-[15px] font-medium leading-snug">
          {post.content.title}
        </h3>
        {post.content.excerpt ? (
          <p className="line-clamp-3 text-[13px] text-brand-text">
            {post.content.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function SourceIcon({ network }: { network: "instagram" | "facebook" | "manual" }) {
  if (network === "instagram") {
    return (
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="6" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (network === "facebook") {
    return (
      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.7 0H1.3C.6 0 0 .6 0 1.3v21.3C0 23.4.6 24 1.3 24h11.5v-9.3H9.7v-3.6h3.1V8.4c0-3.1 1.9-4.8 4.7-4.8 1.3 0 2.5.1 2.8.1v3.2h-2c-1.5 0-1.8.7-1.8 1.8v2.4h3.6l-.5 3.6h-3.1V24h6c.7 0 1.3-.6 1.3-1.3V1.3c0-.7-.6-1.3-1.3-1.3z" />
      </svg>
    );
  }
  return null;
}
