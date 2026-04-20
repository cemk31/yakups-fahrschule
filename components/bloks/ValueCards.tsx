import { storyblokEditable } from "@storyblok/react/rsc";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok } from "./types";

interface ValueCard {
  _uid: string;
  icon: "shield" | "truck" | "card" | "house" | "building";
  title: string;
  description?: string;
  badge?: string;
}

export interface ValueCardsBlok extends BaseBlok {
  component: "value_cards";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  description?: string;
  cards: ValueCard[];
  columns?: "2" | "3";
}

const valueIcons: Record<ValueCard["icon"], React.ReactElement> = {
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7l-9-5z"
        stroke="#0E0E0E"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 12l3 3 5-6"
        stroke="#A5C620"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  truck: (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <path
        d="M4 20h24M5 20v-6l3-5h14l3 5v6"
        stroke="#0E0E0E"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="22" r="2.5" fill="#A5C620" />
      <circle cx="22" cy="22" r="2.5" fill="#A5C620" />
    </svg>
  ),
  card: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#0E0E0E" strokeWidth="1.8" />
      <path d="M3 10h18" stroke="#0E0E0E" strokeWidth="1.8" />
      <circle cx="17" cy="15" r="1.5" fill="#A5C620" />
    </svg>
  ),
  house: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 21h18M5 21V10l7-6 7 6v11"
        stroke="#0E0E0E"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="9" y="13" width="6" height="8" fill="#A5C620" />
    </svg>
  ),
  building: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"
        stroke="#0E0E0E"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="2" fill="#A5C620" />
    </svg>
  ),
};

interface Props {
  blok: ValueCardsBlok;
}

export function ValueCards({ blok }: Props) {
  const cols = blok.columns === "2" ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <section
      {...storyblokEditable(blok)}
      className="border-y border-brand-border bg-white py-16 md:py-20"
    >
      <Container>
        <div className="mb-8 max-w-xl">
          {blok.tagline ? (
            <div className="mb-3.5">
              <Tag>{blok.tagline}</Tag>
            </div>
          ) : null}
          <h2 className="mb-4 text-3xl font-medium leading-tight md:text-[30px]">
            {blok.headline}
            {blok.headlineAccent ? (
              <span className="text-brand-green">.{blok.headlineAccent}</span>
            ) : null}
          </h2>
          {blok.description ? (
            <p className="text-sm leading-relaxed text-brand-text">
              {blok.description}
            </p>
          ) : null}
        </div>

        <div className={`grid gap-4 ${cols}`}>
          {blok.cards?.map((card) => (
            <article
              key={card._uid}
              className="rounded-brand border border-brand-border bg-white p-6"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-green-soft">
                {valueIcons[card.icon]}
              </div>
              <h3 className="mb-2 text-base font-medium">{card.title}</h3>
              {card.description ? (
                <p className="mb-3.5 text-[13px] leading-relaxed text-brand-text">
                  {card.description}
                </p>
              ) : null}
              {card.badge ? (
                <span className="inline-block rounded-full bg-brand-green-soft px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-brand-green-dark)]">
                  {card.badge}
                </span>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
