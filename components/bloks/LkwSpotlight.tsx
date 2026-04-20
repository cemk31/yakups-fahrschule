import { storyblokEditable } from "@storyblok/react/rsc";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { BaseBlok, StoryblokLink } from "./types";
import { linkHref } from "./types";

interface SpotlightStep {
  _uid: string;
  title: string;
  description?: string;
  highlighted?: boolean;
  spanFull?: boolean;
}

export interface LkwSpotlightBlok extends BaseBlok {
  component: "lkw_spotlight";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaLink?: StoryblokLink;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: StoryblokLink;
  steps: SpotlightStep[];
}

interface Props {
  blok: LkwSpotlightBlok;
}

export function LkwSpotlight({ blok }: Props) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="relative overflow-hidden bg-brand-ink py-16 text-white md:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full border-[80px] border-brand-green opacity-[0.04]"
      />
      <Container className="relative">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1.2fr]">
          <div>
            {blok.tagline ? (
              <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-brand-green/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-brand-green">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                {blok.tagline}
              </div>
            ) : null}
            <h2 className="mb-4 text-3xl font-medium leading-tight text-white md:text-[34px]">
              {blok.headline}
              {blok.headlineAccent ? (
                <span className="text-brand-green">.{blok.headlineAccent}</span>
              ) : (
                <span className="text-brand-green">.</span>
              )}
            </h2>
            {blok.description ? (
              <p className="mb-7 max-w-sm text-[15px] text-white/70">
                {blok.description}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2.5">
              {blok.primaryCtaLabel ? (
                <Button variant="primary" href={linkHref(blok.primaryCtaLink)}>
                  {blok.primaryCtaLabel}
                  <ArrowRight />
                </Button>
              ) : null}
              {blok.secondaryCtaLabel ? (
                <a
                  href={linkHref(blok.secondaryCtaLink)}
                  className="inline-flex items-center gap-2 py-3 text-sm font-medium text-white hover:text-brand-green"
                >
                  {blok.secondaryCtaLabel} →
                </a>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {blok.steps?.map((step, idx) => (
              <StepCard key={step._uid} step={step} index={idx + 1} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function StepCard({ step, index }: { step: SpotlightStep; index: number }) {
  const num = String(index).padStart(2, "0");

  if (step.highlighted) {
    return (
      <div
        className={`rounded-xl bg-brand-green p-5 text-brand-ink ${step.spanFull ? "md:col-span-2" : ""}`}
      >
        <div className="mb-2 flex items-center gap-2.5">
          <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-ink text-[13px] font-medium text-brand-green">
            {index}
          </div>
          <div className="text-sm font-medium">{step.title}</div>
        </div>
        {step.description ? (
          <div className="text-xs opacity-80">{step.description}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/5 p-5 ${step.spanFull ? "md:col-span-2" : ""}`}
    >
      <div className="mb-2.5 flex items-center gap-2.5">
        <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-green text-[13px] font-medium text-brand-ink">
          {num[1]}
        </div>
        <div className="text-sm font-medium text-white">{step.title}</div>
      </div>
      {step.description ? (
        <div className="text-xs text-white/60">{step.description}</div>
      ) : null}
    </div>
  );
}
