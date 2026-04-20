import { storyblokEditable } from "@storyblok/react/rsc";
import { Container } from "@/components/ui/Container";
import type { BaseBlok, StoryblokLink } from "./types";
import { linkHref } from "./types";

interface CtaButton {
  _uid: string;
  label: string;
  link?: StoryblokLink;
  variant: "ink" | "white" | "outline";
  icon?: "phone" | "whatsapp" | "arrow";
}

export interface CtaSectionBlok extends BaseBlok {
  component: "cta_section";
  headline: string;
  description?: string;
  buttons: CtaButton[];
}

interface Props {
  blok: CtaSectionBlok;
}

export function CtaSection({ blok }: Props) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="relative overflow-hidden bg-brand-green py-16 md:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full border-[30px] border-brand-ink opacity-[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 h-[260px] w-[260px] rounded-full border-[40px] border-brand-ink opacity-[0.04]"
      />
      <Container>
        <div className="relative mx-auto max-w-xl text-center">
          <h2 className="mb-3.5 text-3xl font-medium leading-tight text-brand-ink md:text-[34px]">
            {blok.headline}
          </h2>
          {blok.description ? (
            <p className="mb-7 text-[15px] text-brand-ink/75">{blok.description}</p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-2.5">
            {blok.buttons?.map((btn) => (
              <CtaButtonEl key={btn._uid} btn={btn} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CtaButtonEl({ btn }: { btn: CtaButton }) {
  const base =
    "inline-flex items-center gap-2.5 rounded-lg px-5 py-3.5 text-sm font-medium";
  const classes =
    btn.variant === "ink"
      ? `${base} bg-brand-ink text-brand-green`
      : btn.variant === "white"
        ? `${base} bg-white text-brand-ink`
        : `${base} border-2 border-brand-ink bg-transparent text-brand-ink`;

  const iconEl = btn.icon === "phone" ? <PhoneIcon /> : btn.icon === "whatsapp" ? <WhatsAppIcon /> : null;

  return (
    <a href={linkHref(btn.link)} className={classes}>
      {iconEl}
      {btn.label}
      {btn.icon === "arrow" ? " →" : null}
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 12a8 8 0 11-4.5-7.2L20 4l-1 4.5A8 8 0 0120 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
