import { storyblokEditable } from "@storyblok/react/rsc";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok } from "./types";

interface LicenseClass {
  _uid: string;
  className: string;
  shortDescription?: string;
  ageBadge?: string;
  highlightBadge?: string;
  whatYouCanDrive?: string;
  prerequisite?: string;
  typicalDuration?: string;
  approxCost?: string;
  highlighted?: boolean;
}

export interface LicenseClassGridBlok extends BaseBlok {
  component: "license_class_grid";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  description?: string;
  classes: LicenseClass[];
}

interface Props {
  blok: LicenseClassGridBlok;
}

export function LicenseClassGrid({ blok }: Props) {
  return (
    <section {...storyblokEditable(blok)} className="py-10">
      <Container>
        <div className="mb-8">
          {blok.tagline ? (
            <div className="mb-3.5">
              <Tag>{blok.tagline}</Tag>
            </div>
          ) : null}
          <h2 className="mb-3 text-3xl font-medium leading-tight md:text-[30px]">
            {blok.headline}
            {blok.headlineAccent ? (
              <span className="text-brand-green">.{blok.headlineAccent}</span>
            ) : null}
          </h2>
          {blok.description ? (
            <p className="max-w-xl text-sm text-brand-text">{blok.description}</p>
          ) : null}
        </div>

        <div className="grid gap-3.5 md:grid-cols-2">
          {blok.classes?.map((cls) => (
            <ClassCard key={cls._uid} cls={cls} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ClassCard({ cls }: { cls: LicenseClass }) {
  if (cls.highlighted) {
    return (
      <article className="relative overflow-hidden rounded-brand bg-brand-ink p-6 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-[120px] w-[120px] rounded-full bg-brand-green/12"
        />
        <div className="relative mb-4 flex items-start justify-between">
          <div>
            <div className="text-[28px] font-medium leading-tight">
              {cls.className}
              <span className="text-brand-green">.</span>
            </div>
            {cls.shortDescription ? (
              <div className="text-[13px] text-white/60">{cls.shortDescription}</div>
            ) : null}
          </div>
          {cls.highlightBadge ? (
            <span className="rounded-full bg-brand-green px-2.5 py-1 text-[11px] font-medium text-brand-ink">
              {cls.highlightBadge}
            </span>
          ) : null}
        </div>
        {cls.whatYouCanDrive ? (
          <div className="mb-3.5 rounded-lg bg-white/5 p-3.5">
            <div className="mb-1.5 text-xs text-white/50">Was du fahren darfst</div>
            <div className="text-[13px] leading-relaxed text-white">
              {cls.whatYouCanDrive}
            </div>
          </div>
        ) : null}
        <InfoRow label="Voraussetzung" value={cls.prerequisite} dark />
        <InfoRow label="Typische Dauer" value={cls.typicalDuration} dark />
        <InfoRow label="Richtkosten" value={cls.approxCost} dark accent />
      </article>
    );
  }

  return (
    <article className="rounded-brand border border-brand-border bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="text-[28px] font-medium leading-tight">
            {cls.className}
            <span className="text-brand-green">.</span>
          </div>
          {cls.shortDescription ? (
            <div className="text-[13px] text-brand-text">{cls.shortDescription}</div>
          ) : null}
        </div>
        {cls.ageBadge ? (
          <span className="rounded-full bg-brand-green-soft px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-brand-green-dark)]">
            {cls.ageBadge}
          </span>
        ) : null}
      </div>
      {cls.whatYouCanDrive ? (
        <div className="mb-3.5 rounded-lg bg-brand-bg p-3.5">
          <div className="mb-1.5 text-xs text-brand-text">Was du fahren darfst</div>
          <div className="text-[13px] leading-relaxed">{cls.whatYouCanDrive}</div>
        </div>
      ) : null}
      <InfoRow label="Voraussetzung" value={cls.prerequisite} />
      <InfoRow label="Typische Dauer" value={cls.typicalDuration} />
      <InfoRow label="Richtkosten" value={cls.approxCost} last />
    </article>
  );
}

function InfoRow({
  label,
  value,
  dark,
  accent,
  last,
}: {
  label: string;
  value?: string;
  dark?: boolean;
  accent?: boolean;
  last?: boolean;
}) {
  if (!value) return null;
  const border = last ? "" : dark ? "border-b border-white/10" : "border-b border-brand-border";
  const labelClr = dark ? "text-white/60" : "text-brand-text";
  const valueClr = accent ? "text-brand-green" : dark ? "text-white" : "";
  return (
    <div className={`flex justify-between py-2.5 text-[13px] ${border}`}>
      <span className={labelClr}>{label}</span>
      <span className={`font-medium ${valueClr}`}>{value}</span>
    </div>
  );
}
