import { storyblokEditable } from "@storyblok/react/rsc";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok, StoryblokAsset } from "./types";

interface DownloadItem {
  _uid: string;
  title: string;
  description?: string;
  /** Storyblok-Asset-Feld, dahinter liegt typischerweise eine PDF */
  file?: StoryblokAsset;
  /** Dateigröße als Text, z.B. "240 KB" — Storyblok liefert die Größe nicht im Asset-Objekt */
  fileSize?: string;
  /** Dateityp als Text, z.B. "PDF", "DOCX" — fällt auf die Extension der Datei zurück */
  fileType?: string;
}

export interface DownloadSectionBlok extends BaseBlok {
  component: "download_section";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  description?: string;
  items: DownloadItem[];
}

interface Props {
  blok: DownloadSectionBlok;
}

/**
 * Download-Bereich: Listet PDFs/Dokumente als anklickbare Karten.
 * Dateien liegen als Storyblok-Assets vor, Redakteure können sie
 * direkt im Visual Editor hochladen und austauschen.
 */
export function DownloadSection({ blok }: Props) {
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

        <div className="grid gap-3.5 md:grid-cols-2">
          {blok.items?.map((item) => (
            <DownloadCard key={item._uid} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function DownloadCard({ item }: { item: DownloadItem }) {
  const href = item.file?.filename;
  if (!href) {
    // Ohne Datei wäre die Karte ein toter Link — im Visual Editor sichtbar,
    // aber im Live-Build lieber gar nicht rendern.
    return null;
  }

  const fileType = item.fileType ?? guessFileType(href);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-brand border border-brand-border bg-white p-5 transition-colors hover:border-brand-green-accent hover:bg-brand-green-soft/30"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-green-soft text-[color:var(--color-brand-green-dark)]">
        <DocumentIcon />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="text-[15px] font-medium leading-tight">
            {item.title}
          </span>
        </div>
        {item.description ? (
          <p className="mb-2 text-[13px] leading-relaxed text-brand-text">
            {item.description}
          </p>
        ) : null}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-brand-text">
          <span className="font-medium">{fileType}</span>
          {item.fileSize ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{item.fileSize}</span>
            </>
          ) : null}
        </div>
      </div>
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-border text-brand-text transition-colors group-hover:border-brand-green group-hover:bg-brand-green group-hover:text-brand-ink"
        aria-hidden="true"
      >
        <DownloadIcon />
      </div>
    </a>
  );
}

function guessFileType(filename: string): string {
  const ext = filename.split(".").pop();
  if (!ext) return "Datei";
  return ext.toUpperCase();
}

function DocumentIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6M9 13h6M9 17h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
