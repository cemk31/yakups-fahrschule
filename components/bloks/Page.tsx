import { StoryblokServerComponent, storyblokEditable } from "@storyblok/react/rsc";
import { Reveal } from "@/components/ui/Reveal";
import type { BaseBlok, StoryblokAsset } from "./types";

/**
 * SEO-Felder, die als nestable Blok im "seo"-Feld hinterlegt werden.
 */
export interface SeoFields {
  title?: string;
  description?: string;
  ogImage?: StoryblokAsset;
  noindex?: boolean;
}

/**
 * Page-Blok ist der universelle Container für Landingpages.
 * Er hat ein body-Feld, in das beliebige andere Bloks per Drag-and-Drop
 * gezogen werden können. Storyblok erlaubt dem Redakteur also, die
 * gesamte Seitenstruktur im Visual Editor zusammenzustellen.
 *
 * Jeder Top-Level-Blok wird in <Reveal> gewickelt für dezente Scroll-
 * Einblendung. Der erste Blok (Hero) wird nicht animiert, weil er
 * above-the-fold sichtbar ist — sonst flackert es beim Laden.
 */
export interface PageBlok extends BaseBlok {
  component: "page";
  title?: string;
  body?: BaseBlok[];
  seo?: SeoFields;
}

interface Props {
  blok: PageBlok;
}

// Bloks, die nie animiert werden (above-the-fold-Helden).
const SKIP_REVEAL = new Set(["hero_section"]);

export function Page({ blok }: Props) {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((childBlok, index) => {
        const rendered = (
          <StoryblokServerComponent blok={childBlok} key={childBlok._uid} />
        );
        // Hero und allgemein das erste Element: kein Reveal.
        if (index === 0 || SKIP_REVEAL.has(childBlok.component)) {
          return rendered;
        }
        return (
          <Reveal key={childBlok._uid} as="div">
            {rendered}
          </Reveal>
        );
      })}
    </main>
  );
}
