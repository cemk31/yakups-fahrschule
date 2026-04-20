import type { SbBlokData } from "@storyblok/react/rsc";

/**
 * Basis-Interface für alle Bloks.
 * Storyblok liefert für jeden Blok mindestens _uid, component und _editable.
 */
export interface BaseBlok extends SbBlokData {
  _uid: string;
  component: string;
}

/**
 * Storyblok-Asset (Bild, Datei).
 */
export interface StoryblokAsset {
  filename: string;
  alt?: string;
  title?: string;
  copyright?: string;
  focus?: string;
}

/**
 * Storyblok-Link-Objekt.
 * Kann entweder eine URL, ein interner Story-Link oder ein Email/Tel-Link sein.
 */
export interface StoryblokLink {
  url?: string;
  cached_url?: string;
  linktype?: "url" | "story" | "email" | "asset";
  target?: string;
}

/**
 * Löst einen Storyblok-Link in ein href auf.
 */
export function linkHref(link?: StoryblokLink): string {
  if (!link) return "#";
  if (link.linktype === "email") return `mailto:${link.url}`;
  if (link.linktype === "story") return `/${link.cached_url ?? ""}`;
  return link.url ?? link.cached_url ?? "#";
}
