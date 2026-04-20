import { storyblokEditable } from "@storyblok/react/rsc";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok } from "./types";

interface ReviewItem {
  _uid: string;
  text: string;
  author: string;
  initials?: string;
  context?: string;
  rating?: number;
}

export interface ReviewsSectionBlok extends BaseBlok {
  component: "reviews_section";
  tagline?: string;
  averageRating: string;
  totalCount: string;
  items: ReviewItem[];
}

interface Props {
  blok: ReviewsSectionBlok;
}

export function ReviewsSection({ blok }: Props) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="border-y border-brand-border bg-white py-16 md:py-20"
    >
      <Container>
        <div className="grid items-start gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            {blok.tagline ? (
              <div className="mb-3.5">
                <Tag>{blok.tagline}</Tag>
              </div>
            ) : null}
            <div className="mb-2 flex items-baseline gap-2">
              <div className="text-5xl font-medium leading-none">
                {blok.averageRating}
              </div>
              <div className="text-base text-brand-text">/ 5</div>
            </div>
            <div className="mb-2.5 text-base tracking-widest text-[#F4B800]">
              ★★★★★
            </div>
            <div className="text-[13px] text-brand-text">{blok.totalCount}</div>
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            {blok.items?.map((review) => (
              <article
                key={review._uid}
                className="rounded-brand border border-brand-border bg-white p-5"
              >
                <div className="mb-2.5 text-[13px] tracking-widest text-[#F4B800]">
                  {"★".repeat(review.rating ?? 5)}
                </div>
                <p className="mb-3.5 text-[13px] leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-brand-green-soft text-xs font-medium text-[color:var(--color-brand-green-dark)]">
                    {review.initials ?? review.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-medium">{review.author}</div>
                    {review.context ? (
                      <div className="text-[11px] text-brand-text">{review.context}</div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
