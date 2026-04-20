import { storyblokEditable } from "@storyblok/react/rsc";
import Image from "next/image";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok, StoryblokAsset, StoryblokLink } from "./types";
import { linkHref } from "./types";

interface HeroStat {
  _uid: string;
  value: string;
  accent?: string;
  label: string;
}

export interface HeroSectionBlok extends BaseBlok {
  component: "hero_section";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaLink?: StoryblokLink;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: StoryblokLink;
  image?: StoryblokAsset;
  imageBadge?: string;
  stats?: HeroStat[];
}

interface Props {
  blok: HeroSectionBlok;
}

export function HeroSection({ blok }: Props) {
  return (
    <section {...storyblokEditable(blok)} className="py-12 md:py-16">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr]">
          <div>
            {blok.tagline ? (
              <div className="mb-5">
                <Tag>{blok.tagline}</Tag>
              </div>
            ) : null}

            <h1 className="mb-4 text-4xl font-medium leading-tight md:text-5xl">
              {blok.headline}
              {blok.headlineAccent ? (
                <span className="text-brand-green">.{blok.headlineAccent}</span>
              ) : (
                <span className="text-brand-green">.</span>
              )}
            </h1>

            {blok.description ? (
              <p className="mb-7 max-w-md text-[15px] text-brand-text">
                {blok.description}
              </p>
            ) : null}

            <div className="mb-7 flex flex-wrap gap-2.5">
              {blok.primaryCtaLabel ? (
                <Button
                  variant="primary"
                  href={linkHref(blok.primaryCtaLink)}
                >
                  {blok.primaryCtaLabel}
                  <ArrowRight />
                </Button>
              ) : null}
              {blok.secondaryCtaLabel ? (
                <Button
                  variant="dark"
                  href={linkHref(blok.secondaryCtaLink)}
                >
                  {blok.secondaryCtaLabel}
                  <ArrowRight className="text-brand-green" />
                </Button>
              ) : null}
            </div>

            {blok.stats && blok.stats.length > 0 ? (
              <div className="flex gap-6 border-t border-brand-border pt-5">
                {blok.stats.map((stat) => (
                  <div key={stat._uid}>
                    <div className="text-2xl font-medium">
                      {stat.value}
                      {stat.accent ? (
                        <span className="text-brand-green">{stat.accent}</span>
                      ) : null}
                    </div>
                    <div className="text-xs text-brand-text">{stat.label}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative aspect-[5/4] overflow-hidden rounded-brand-lg bg-brand-ink">
            {blok.image?.filename ? (
              <Image
                src={blok.image.filename}
                alt={blok.image.alt ?? ""}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : null}
            {blok.imageBadge ? (
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-md bg-brand-green px-3 py-1.5 text-xs font-medium text-brand-ink">
                {blok.imageBadge}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
