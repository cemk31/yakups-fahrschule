import { storyblokEditable } from "@storyblok/react/rsc";
import { Container } from "@/components/ui/Container";
import type { BaseBlok } from "./types";

interface UspItem {
  _uid: string;
  icon: "calendar" | "location" | "screen" | "sparkle";
  title: string;
  subtitle?: string;
}

export interface UspStripBlok extends BaseBlok {
  component: "usp_strip";
  items: UspItem[];
}

const icons: Record<UspItem["icon"], React.ReactElement> = {
  calendar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="15" rx="2" stroke="#0E0E0E" strokeWidth="1.8" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="#0E0E0E" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="14" r="2" fill="#A5C620" />
    </svg>
  ),
  location: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" stroke="#0E0E0E" strokeWidth="1.8" />
      <circle cx="12" cy="9" r="2.5" fill="#A5C620" />
    </svg>
  ),
  screen: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="13" rx="2" stroke="#0E0E0E" strokeWidth="1.8" />
      <path d="M8 20h8M12 17v3" stroke="#0E0E0E" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="5" y="7" width="7" height="5" rx="1" fill="#A5C620" />
    </svg>
  ),
  sparkle: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"
        stroke="#0E0E0E"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" fill="#A5C620" />
    </svg>
  ),
};

interface Props {
  blok: UspStripBlok;
}

export function UspStrip({ blok }: Props) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="border-y border-brand-border bg-white py-8"
    >
      <Container>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {blok.items?.map((item) => (
            <div key={item._uid} className="flex items-start gap-3.5">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand-green-soft">
                {icons[item.icon]}
              </div>
              <div>
                <div className="mb-0.5 text-sm font-medium">{item.title}</div>
                {item.subtitle ? (
                  <div className="text-xs text-brand-text">{item.subtitle}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
