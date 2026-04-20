import { storyblokEditable } from "@storyblok/react/rsc";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok } from "./types";

interface ComparisonRow {
  _uid: string;
  /** z.B. "Mindestalter" — die Eigenschaft, die verglichen wird */
  feature: string;
  /**
   * Werte je Klasse, in derselben Reihenfolge wie `classes`.
   * Komma-getrennt, damit Redakteure es in Storyblok bequem in einem Textfeld pflegen können.
   * z.B. "17 (BF17), 18, 18, 18"
   */
  values: string;
  /** Optionale Hervorhebung der gesamten Zeile (z.B. "Richtkosten") */
  highlighted?: boolean;
}

interface ComparisonClass {
  _uid: string;
  /** z.B. "B" */
  className: string;
  /** Kurzbeschreibung unter dem Klassennamen, z.B. "PKW bis 3,5 t" */
  shortDescription?: string;
  /** Wenn true, wird die ganze Spalte hervorgehoben (für die "empfohlene" Klasse) */
  highlighted?: boolean;
}

export interface ComparisonTableBlok extends BaseBlok {
  component: "comparison_table";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  description?: string;
  /** Label für die erste Spalte, z.B. "Eigenschaft" */
  featureColumnLabel?: string;
  classes: ComparisonClass[];
  rows: ComparisonRow[];
  footnote?: string;
}

interface Props {
  blok: ComparisonTableBlok;
}

/**
 * Vergleichstabelle: erste Spalte ist die Eigenschaft (z.B. "Mindestalter"),
 * die folgenden Spalten sind die Klassen (B, BE, B96, B197), die verglichen werden.
 *
 * Die Werte je Zeile werden komma-getrennt im `values`-Feld gepflegt — das ist
 * für Redakteure deutlich angenehmer als pro Zelle ein Blok zu erstellen.
 */
export function ComparisonTable({ blok }: Props) {
  const featureLabel = blok.featureColumnLabel ?? "Eigenschaft";

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
            {blok.headlineAccent ? (
              <span className="text-brand-green">.{blok.headlineAccent}</span>
            ) : null}
          </h2>
          {blok.description ? (
            <p className="max-w-xl text-sm leading-relaxed text-brand-text">
              {blok.description}
            </p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-brand border border-brand-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-brand-bg">
                  <th className="border-b border-brand-border px-5 py-4 text-left text-[13px] font-medium text-brand-text">
                    {featureLabel}
                  </th>
                  {blok.classes?.map((cls) => (
                    <th
                      key={cls._uid}
                      className={`border-b border-brand-border px-3 py-4 text-left text-[13px] font-medium ${
                        cls.highlighted
                          ? "bg-brand-green-soft text-brand-ink"
                          : "text-brand-text"
                      }`}
                    >
                      <div className="text-base font-medium text-brand-ink">
                        Klasse {cls.className}
                        <span className="text-brand-green">.</span>
                      </div>
                      {cls.shortDescription ? (
                        <div className="mt-0.5 text-[11px] font-normal text-brand-text">
                          {cls.shortDescription}
                        </div>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blok.rows?.map((row, idx) => {
                  const cells = row.values.split(",").map((v) => v.trim());
                  const isLast = idx === blok.rows.length - 1;
                  return (
                    <tr
                      key={row._uid}
                      className={`${isLast ? "" : "border-b border-brand-border"} ${
                        row.highlighted ? "bg-brand-bg" : ""
                      }`}
                    >
                      <td className="px-5 py-4 font-medium text-brand-ink">
                        {row.feature}
                      </td>
                      {blok.classes?.map((cls, colIdx) => (
                        <td
                          key={cls._uid}
                          className={`px-3 py-4 text-[13px] ${
                            cls.highlighted
                              ? "bg-brand-green-soft/40"
                              : ""
                          } ${
                            row.highlighted
                              ? "font-medium text-brand-ink"
                              : "text-brand-text"
                          }`}
                        >
                          {cells[colIdx] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {blok.footnote ? (
          <p className="mt-4 text-[11px] italic text-brand-text">{blok.footnote}</p>
        ) : null}
      </Container>
    </section>
  );
}
