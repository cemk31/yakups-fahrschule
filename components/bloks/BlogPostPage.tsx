import Image from "next/image";
import Link from "next/link";
import { storyblokEditable, StoryblokServerRichText } from "@storyblok/react/rsc";
import type { StoryblokRichTextNode } from "@storyblok/react/rsc";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import type { BaseBlok, StoryblokAsset } from "./types";

interface SeoBlok extends BaseBlok {
  component: "seo";
  title?: string;
  description?: string;
  image?: StoryblokAsset;
}

export interface BlogPostBlok extends BaseBlok {
  component: "blog_post";
  title: string;
  excerpt?: string;
  featuredImage?: StoryblokAsset;
  category?: string;
  tags?: string;
  publishedDate?: string;
  authorName?: string;
  readingTime?: string;
  body?: StoryblokRichTextNode<React.ReactElement>;
  sourceNetwork?: "instagram" | "facebook" | "manual";
  seo?: SeoBlok[];
}

interface Props {
  blok: BlogPostBlok;
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

function splitTags(tags?: string): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function BlogPostPage({ blok }: Props) {
  const date = formatDate(blok.publishedDate);
  const tags = splitTags(blok.tags);
  const image = blok.featuredImage;
  const hasBody =
    blok.body &&
    typeof blok.body === "object" &&
    "content" in blok.body &&
    Array.isArray(
      (blok.body as { content?: unknown[] }).content,
    ) &&
    ((blok.body as { content: unknown[] }).content?.length ?? 0) > 0;

  return (
    <article {...storyblokEditable(blok)} className="pb-16 md:pb-24">
      <header className="border-b border-brand-border bg-white py-10 md:py-14">
        <Container>
          <div className="mb-4">
            <Link
              href="/news"
              className="text-[13px] font-medium text-brand-text hover:text-brand-green"
            >
              ← Zurück zur Übersicht
            </Link>
          </div>

          <div className="mx-auto max-w-3xl">
            {blok.category ? (
              <div className="mb-3">
                <Tag>{blok.category}</Tag>
              </div>
            ) : null}
            <h1 className="mb-4 text-3xl font-medium leading-tight md:text-[40px]">
              {blok.title}
            </h1>
            {blok.excerpt ? (
              <p className="mb-6 text-[16px] leading-relaxed text-brand-text">
                {blok.excerpt}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-brand-text">
              {date ? <span>{date}</span> : null}
              {blok.authorName ? (
                <>
                  <span className="text-brand-border">•</span>
                  <span>von {blok.authorName}</span>
                </>
              ) : null}
              {blok.readingTime ? (
                <>
                  <span className="text-brand-border">•</span>
                  <span>{blok.readingTime}</span>
                </>
              ) : null}
            </div>
          </div>
        </Container>
      </header>

      {image?.filename ? (
        <Reveal>
          <div className="border-b border-brand-border bg-brand-green-soft">
            <Container>
              <div className="relative mx-auto my-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-brand md:my-12">
                <Image
                  src={image.filename}
                  alt={image.alt ?? blok.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              </div>
            </Container>
          </div>
        </Reveal>
      ) : null}

      <Reveal delay={80}>
        <div className="pt-10 md:pt-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              {hasBody ? (
                <div className="blog-prose">
                  <StoryblokServerRichText doc={blok.body!} />
                </div>
              ) : blok.excerpt ? (
                <p className="text-[15px] leading-relaxed text-brand-text">
                  {blok.excerpt}
                </p>
              ) : (
                <p className="text-sm italic text-brand-text">
                  Dieser Artikel hat noch keinen Inhalt.
                </p>
              )}

              {tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap gap-2 border-t border-brand-border pt-6">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full bg-brand-green-soft px-3 py-1 text-[12px] font-medium text-[color:var(--color-brand-green-dark)]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Container>
        </div>
      </Reveal>
    </article>
  );
}
