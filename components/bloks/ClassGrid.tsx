import { storyblokEditable } from "@storyblok/react/rsc";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok, StoryblokLink } from "./types";
import { linkHref } from "./types";

interface ClassCard {
  _uid: string;
  title: string;
  description?: string;
  tags?: string;
  icon: "car" | "truck";
  ctaLabel?: string;
  ctaLink?: StoryblokLink;
  highlighted?: boolean;
  numberLabel?: string;
}

export interface ClassGridBlok extends BaseBlok {
  component: "class_grid";
  tagline?: string;
  headline: string;
  sideLinkLabel?: string;
  sideLink?: StoryblokLink;
  cards: ClassCard[];
}

const cardIcons: Record<ClassCard["icon"], React.ReactElement> = {
  car: (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
      <path
        d="M6 20h20M7 20v-6l3-5h12l3 5v6"
        stroke="#0E0E0E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="22" r="2.5" fill="#0E0E0E" />
      <circle cx="21" cy="22" r="2.5" fill="#0E0E0E" />
      <path d="M11 12h10" stroke="#A5C620" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  truck: (
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
      <path
        d="M3 22h22M3 22v-9h15v9M18 16h8l4 4v2M25 22h7"
        stroke="#0E0E0E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="24.5" r="3" fill="#0E0E0E" />
      <circle cx="27" cy="24.5" r="3" fill="#0E0E0E" />
    </svg>
  ),
};

interface Props {
  blok: ClassGridBlok;
}

export function ClassGrid({ blok }: Props) {
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
            </h2>
          </div>
          {blok.sideLinkLabel ? (
            <a
              href={linkHref(blok.sideLink)}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-ink"
            >
              {blok.sideLinkLabel} <span className="text-brand-green">→</span>
            </a>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {blok.cards?.map((card) => (
            <Card key={card._uid} card={card} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Card({ card }: { card: ClassCard }) {
  const isDark = card.highlighted === true;
  const tags = (card.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (isDark) {
    return (
      <article className="relative flex flex-col overflow-hidden rounded-brand bg-brand-ink p-7 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-brand-green/10" />
        <div className="relative mb-5 flex items-start justify-between">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-[14px] bg-brand-green">
            {cardIcons[card.icon]}
          </div>
          {card.numberLabel ? (
            <div className="text-5xl font-medium leading-none text-brand-green/25">
              {card.numberLabel}
            </div>
          ) : null}
        </div>
        <h3 className="mb-2.5 text-xl font-medium md:text-[22px]">{card.title}</h3>
        {card.description ? (
          <p className="mb-5 text-sm text-white/75">{card.description}</p>
        ) : null}
        {tags.length > 0 ? (
          <div className="mb-6 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand-green/30 bg-brand-green/15 px-2.5 py-1 text-xs font-medium text-brand-green"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {card.ctaLabel ? (
          <Button
            variant="primary"
            href={linkHref(card.ctaLink)}
            className="mt-auto self-start"
          >
            {card.ctaLabel}
            <ArrowRight />
          </Button>
        ) : null}
      </article>
    );
  }

  return (
    <article className="flex flex-col rounded-brand border border-brand-border bg-white p-7">
      <div className="mb-5 flex items-start justify-between">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-[14px] bg-brand-green-soft">
          {cardIcons[card.icon]}
        </div>
        {card.numberLabel ? (
          <div className="text-5xl font-medium leading-none text-brand-border">
            {card.numberLabel}
          </div>
        ) : null}
      </div>
      <h3 className="mb-2.5 text-xl font-medium md:text-[22px]">{card.title}</h3>
      {card.description ? (
        <p className="mb-5 text-sm text-brand-text">{card.description}</p>
      ) : null}
      {tags.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-brand-border bg-brand-bg px-2.5 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      {card.ctaLabel ? (
        <Button
          variant="ghost"
          href={linkHref(card.ctaLink)}
          className="mt-auto self-start"
        >
          {card.ctaLabel}
          <ArrowRight />
        </Button>
      ) : null}
    </article>
  );
}
