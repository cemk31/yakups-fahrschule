"use client";

import { storyblokEditable } from "@storyblok/react/rsc";
import { useState } from "react";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok } from "./types";

interface FaqItem {
  _uid: string;
  question: string;
  answer: string;
}

export interface FaqAccordionBlok extends BaseBlok {
  component: "faq_accordion";
  tagline?: string;
  headline: string;
  items: FaqItem[];
}

interface Props {
  blok: FaqAccordionBlok;
}

/**
 * Accordion benötigt Client-Komponente für den State.
 * Für SEO trotzdem wichtig: Wir geben alle Antworten initial im DOM aus
 * (hidden per CSS, nicht per JS), damit Google sie indexieren kann.
 */
export function FaqAccordion({ blok }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section {...storyblokEditable(blok)} className="py-16 md:py-20">
      <Container>
        <div className="mb-8 text-center">
          {blok.tagline ? (
            <div className="mb-3.5 inline-block">
              <Tag>{blok.tagline}</Tag>
            </div>
          ) : null}
          <h2 className="text-3xl font-medium leading-tight md:text-[34px]">
            {blok.headline}
          </h2>
        </div>

        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          {blok.items?.map((item, idx) => (
            <FaqRow
              key={item._uid}
              item={item}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FaqRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-brand border border-brand-border bg-white">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium">{item.question}</span>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium transition-colors ${
            isOpen
              ? "bg-brand-green text-brand-ink"
              : "border border-brand-border text-brand-text"
          }`}
          aria-hidden="true"
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen ? (
        <div className="border-t border-brand-border bg-brand-bg px-5 pb-5 pt-3">
          <p className="text-sm leading-relaxed text-brand-text">{item.answer}</p>
        </div>
      ) : null}
    </div>
  );
}
