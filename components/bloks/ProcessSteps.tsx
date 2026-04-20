import { storyblokEditable } from "@storyblok/react/rsc";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok } from "./types";

interface ProcessStep {
  _uid: string;
  title: string;
  description?: string;
  duration?: string;
  highlighted?: boolean;
}

export interface ProcessStepsBlok extends BaseBlok {
  component: "process_steps";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  steps: ProcessStep[];
  variant?: "dark" | "light";
}

interface Props {
  blok: ProcessStepsBlok;
}

/**
 * Zeigt einen mehrstufigen Prozess als vertikale Liste.
 * Wird auf der LKW-Landingpage verwendet ("In 6 Schritten zum LKW-Führerschein").
 * Unterstützt Dark- und Light-Variante.
 */
export function ProcessSteps({ blok }: Props) {
  const isDark = blok.variant === "dark" || blok.variant === undefined;

  return (
    <section
      {...storyblokEditable(blok)}
      className={`relative overflow-hidden py-16 md:py-20 ${
        isDark ? "bg-brand-ink text-white" : "bg-brand-bg"
      }`}
    >
      {isDark ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border-[80px] border-brand-green opacity-[0.04]"
        />
      ) : null}
      <Container className="relative">
        <div className="mb-8">
          {blok.tagline ? (
            <div className="mb-3.5">
              {isDark ? (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-brand-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                  {blok.tagline}
                </div>
              ) : (
                <Tag>{blok.tagline}</Tag>
              )}
            </div>
          ) : null}
          <h2
            className={`text-3xl font-medium leading-tight md:text-[34px] ${
              isDark ? "text-white" : ""
            }`}
          >
            {blok.headline}
            {blok.headlineAccent ? (
              <span className="text-brand-green">.{blok.headlineAccent}</span>
            ) : null}
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {blok.steps?.map((step, idx) => (
            <Row key={step._uid} step={step} index={idx + 1} isDark={isDark} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Row({
  step,
  index,
  isDark,
}: {
  step: ProcessStep;
  index: number;
  isDark: boolean;
}) {
  const num = String(index).padStart(2, "0");

  if (step.highlighted) {
    return (
      <div className="grid grid-cols-[52px_1fr_auto] items-center gap-4 rounded-xl bg-brand-green p-5 text-brand-ink">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-brand-ink text-xl font-medium text-brand-green">
          {num}
        </div>
        <div>
          <div className="mb-0.5 text-base font-medium">{step.title}</div>
          {step.description ? (
            <div className="text-[13px] opacity-75">{step.description}</div>
          ) : null}
        </div>
        <div className="text-xs opacity-65">Geschafft</div>
      </div>
    );
  }

  if (isDark) {
    return (
      <div className="grid grid-cols-[52px_1fr_auto] items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-brand-green text-xl font-medium text-brand-ink">
          {num}
        </div>
        <div>
          <div className="mb-0.5 text-base font-medium text-white">
            {step.title}
          </div>
          {step.description ? (
            <div className="text-[13px] text-white/60">{step.description}</div>
          ) : null}
        </div>
        {step.duration ? (
          <div className="text-xs text-white/40">{step.duration}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[52px_1fr_auto] items-center gap-4 rounded-xl border border-brand-border bg-white p-5">
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-brand-green text-xl font-medium text-brand-ink">
        {num}
      </div>
      <div>
        <div className="mb-0.5 text-base font-medium">{step.title}</div>
        {step.description ? (
          <div className="text-[13px] text-brand-text">{step.description}</div>
        ) : null}
      </div>
      {step.duration ? (
        <div className="text-xs text-brand-text">{step.duration}</div>
      ) : null}
    </div>
  );
}
