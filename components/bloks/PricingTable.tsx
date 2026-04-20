import { storyblokEditable } from "@storyblok/react/rsc";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok, StoryblokLink } from "./types";
import { linkHref } from "./types";

interface PriceRow {
  _uid: string;
  licenseClass: string;
  basicFee?: string;
  theoryFee?: string;
  practiceFee?: string;
  totalFee: string;
  highlighted?: boolean;
}

interface PromoBox {
  _uid: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: StoryblokLink;
}

export interface PricingTableBlok extends BaseBlok {
  component: "pricing_table";
  tagline?: string;
  headline: string;
  description?: string;
  columnLabels?: string;
  rows: PriceRow[];
  footnote?: string;
  promoBox?: PromoBox[];
}

interface Props {
  blok: PricingTableBlok;
}

export function PricingTable({ blok }: Props) {
  const labels = (blok.columnLabels ?? "Klasse,Grundbetrag,Theorie,Praxis,Richtwert gesamt")
    .split(",")
    .map((l) => l.trim());
  const [colClass, colBasic, colTheory, colPractice, colTotal] = labels;
  const promo = blok.promoBox?.[0];

  return (
    <section {...storyblokEditable(blok)} className="py-16 md:py-20">
      <Container>
        <div className="mb-8">
          {blok.tagline ? (
            <div className="mb-3.5">
              <Tag>{blok.tagline}</Tag>
            </div>
          ) : null}
          <h2 className="mb-3 text-3xl font-medium leading-tight md:text-[34px]">
            {blok.headline}
          </h2>
          {blok.description ? (
            <p className="max-w-xl text-sm leading-relaxed text-brand-text">
              {blok.description}
            </p>
          ) : null}
        </div>

        <div className="mb-4 overflow-hidden rounded-brand border border-brand-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-brand-bg">
                  <th className="border-b border-brand-border px-5 py-3.5 text-left text-[13px] font-medium text-brand-text">
                    {colClass}
                  </th>
                  <th className="border-b border-brand-border px-3 py-3.5 text-left text-[13px] font-medium text-brand-text">
                    {colBasic}
                  </th>
                  <th className="border-b border-brand-border px-3 py-3.5 text-left text-[13px] font-medium text-brand-text">
                    {colTheory}
                  </th>
                  <th className="border-b border-brand-border px-3 py-3.5 text-left text-[13px] font-medium text-brand-text">
                    {colPractice}
                  </th>
                  <th className="border-b border-brand-border px-5 py-3.5 text-right text-[13px] font-medium text-brand-text">
                    {colTotal}
                  </th>
                </tr>
              </thead>
              <tbody>
                {blok.rows?.map((row, idx) => (
                  <tr
                    key={row._uid}
                    className={`${idx < blok.rows.length - 1 ? "border-b border-brand-border" : ""} ${row.highlighted ? "bg-brand-bg" : ""}`}
                  >
                    <td className="px-5 py-4 font-medium">{row.licenseClass}</td>
                    <td className="px-3 py-4 text-brand-text">{row.basicFee || "—"}</td>
                    <td className="px-3 py-4 text-brand-text">{row.theoryFee || "—"}</td>
                    <td className="px-3 py-4 text-brand-text">{row.practiceFee || "—"}</td>
                    <td className="px-5 py-4 text-right font-medium">{row.totalFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {blok.footnote ? (
          <p className="mb-6 text-[11px] italic text-brand-text">{blok.footnote}</p>
        ) : null}

        {promo ? (
          <div className="flex flex-wrap items-center gap-5 rounded-brand border border-brand-green-accent bg-brand-green-soft p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                  stroke="#0E0E0E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="mb-1 text-base font-medium">{promo.title}</div>
              {promo.description ? (
                <div className="text-[13px] text-brand-text">{promo.description}</div>
              ) : null}
            </div>
            {promo.ctaLabel ? (
              <Button variant="dark" href={linkHref(promo.ctaLink)}>
                {promo.ctaLabel}
                <ArrowRight className="text-brand-green" />
              </Button>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
