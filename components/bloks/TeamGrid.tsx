import { storyblokEditable } from "@storyblok/react/rsc";
import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok, StoryblokAsset, StoryblokLink } from "./types";
import { linkHref } from "./types";

interface TeamMember {
  _uid: string;
  /** Vor- und Nachname, z.B. "Yakup Yılmaz" */
  name: string;
  /** Rolle / Funktion, z.B. "Inhaber & Fahrlehrer" */
  role?: string;
  /** Foto-Asset (optional). Wenn leer, wird ein neutraler Platzhalter gezeigt. */
  photo?: StoryblokAsset;
  /**
   * Fahrlehrer-Klassen als komma-separierter String, z.B. "B, BE, B96, B197".
   * Wird in einzelne Pills aufgeteilt.
   */
  classes?: string;
  /** Kurz-Bio (1-3 Sätze) */
  bio?: string;
  /**
   * Sprachen als komma-separierter String, z.B. "Deutsch, Türkisch, Englisch".
   */
  languages?: string;
}

export interface TeamGridBlok extends BaseBlok {
  component: "team_grid";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  /** Optional: kurzer Lead-Text unter der Headline */
  description?: string;
  /** Optionaler Side-Link (z.B. "Karriere bei uns →") */
  sideLinkLabel?: string;
  sideLink?: StoryblokLink;
  members: TeamMember[];
  /**
   * Wenn true, kompakte Karten (Foto + Name + Rolle), 4 Spalten.
   * Wenn false (default), ausführliche Karten mit Klassen/Bio/Sprachen, 3 Spalten.
   */
  compact?: boolean;
}

interface Props {
  blok: TeamGridBlok;
}

function splitList(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function TeamGrid({ blok }: Props) {
  const compact = Boolean(blok.compact);
  const gridCols = compact
    ? "grid-cols-2 md:grid-cols-4"
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  return (
    <section
      {...storyblokEditable(blok)}
      className="border-y border-brand-border bg-white py-12 md:py-16"
    >
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
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
            {blok.description ? (
              <p className="mt-3 text-sm leading-relaxed text-brand-text">
                {blok.description}
              </p>
            ) : null}
          </div>
          {blok.sideLinkLabel ? (
            <a
              href={linkHref(blok.sideLink)}
              className="text-sm font-medium hover:text-brand-green"
            >
              {blok.sideLinkLabel} →
            </a>
          ) : null}
        </div>

        <div className={`grid gap-4 ${gridCols}`}>
          {blok.members?.map((m) => (
            <TeamCard key={m._uid} member={m} compact={compact} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function TeamCard({
  member,
  compact,
}: {
  member: TeamMember;
  compact: boolean;
}) {
  const classes = splitList(member.classes);
  const languages = splitList(member.languages);

  if (compact) {
    return (
      <div>
        <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-xl bg-brand-green-soft">
          {member.photo?.filename ? (
            <Image
              src={member.photo.filename}
              alt={member.photo.alt ?? member.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <PhotoPlaceholder name={member.name} />
          )}
        </div>
        <div className="text-sm font-medium">{member.name}</div>
        {member.role ? (
          <div className="text-xs text-brand-text">{member.role}</div>
        ) : null}
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-brand border border-brand-border bg-white">
      <div className="relative aspect-[4/3] bg-brand-green-soft">
        {member.photo?.filename ? (
          <Image
            src={member.photo.filename}
            alt={member.photo.alt ?? member.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <PhotoPlaceholder name={member.name} />
        )}
      </div>
      <div className="p-5">
        <div className="text-base font-medium leading-tight">{member.name}</div>
        {member.role ? (
          <div className="mt-0.5 text-[13px] text-brand-text">
            {member.role}
          </div>
        ) : null}

        {classes.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {classes.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-brand-green-soft px-2 py-0.5 text-[11px] font-medium text-[color:var(--color-brand-green-dark)]"
              >
                {c}
              </span>
            ))}
          </div>
        ) : null}

        {member.bio ? (
          <p className="mt-3 text-[13px] leading-relaxed text-brand-text">
            {member.bio}
          </p>
        ) : null}

        {languages.length > 0 ? (
          <div className="mt-4 flex items-center gap-2 border-t border-brand-border pt-3 text-[12px] text-brand-text">
            <GlobeIcon />
            <span>{languages.join(" · ")}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function PhotoPlaceholder({ name }: { name: string }) {
  // Initialen aus dem Namen für eine dezente Platzhalter-Darstellung
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="absolute inset-0 flex items-center justify-center text-2xl font-medium text-brand-green-dark/60">
      {initials || "·"}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
