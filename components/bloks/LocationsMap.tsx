import { storyblokEditable } from "@storyblok/react/rsc";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok, StoryblokAsset, StoryblokLink } from "./types";
import { linkHref } from "./types";

interface LocationItem {
  _uid: string;
  name: string;
  address: string;
  phone?: string;
  mapImage?: StoryblokAsset;
  mapLink?: StoryblokLink;
  badge?: string;
  badgeVariant?: "primary" | "secondary";
}

export interface LocationsMapBlok extends BaseBlok {
  component: "locations_map";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  locations: LocationItem[];
}

interface Props {
  blok: LocationsMapBlok;
}

export function LocationsMap({ blok }: Props) {
  return (
    <section {...storyblokEditable(blok)} className="py-16 md:py-20">
      <Container>
        <div className="mb-8">
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
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {blok.locations?.map((location) => (
            <LocationCard key={location._uid} location={location} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function LocationCard({ location }: { location: LocationItem }) {
  return (
    <article className="overflow-hidden rounded-brand border border-brand-border bg-white">
      <div className="aspect-[16/8] bg-brand-bg">
        {location.mapImage?.filename ? (
          <img
            src={location.mapImage.filename}
            alt={location.mapImage.alt ?? `Karte ${location.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-brand-text">
            Karte {location.name}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2.5 flex items-start justify-between gap-3">
          <h3 className="text-lg font-medium">{location.name}</h3>
          {location.badge ? (
            <span className="rounded-full bg-brand-green-soft px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-brand-green-dark)]">
              {location.badge}
            </span>
          ) : null}
        </div>
        <div className="mb-4 text-[13px] text-brand-text">{location.address}</div>
        <div className="flex items-center gap-2 text-[13px]">
          {location.mapLink ? (
            <a
              href={linkHref(location.mapLink)}
              className="font-medium hover:text-brand-green"
              rel="noopener"
              target="_blank"
            >
              Route →
            </a>
          ) : null}
          {location.phone ? (
            <>
              <span className="text-brand-border">•</span>
              <a href={`tel:${location.phone}`} className="font-medium hover:text-brand-green">
                {location.phone}
              </a>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
