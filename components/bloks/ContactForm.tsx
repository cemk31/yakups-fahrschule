"use client";

import { storyblokEditable } from "@storyblok/react/rsc";
import { useState } from "react";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import type { BaseBlok } from "./types";

interface TopicOption {
  _uid: string;
  /** Label im Dropdown, z.B. "PKW-Führerschein Klasse B" */
  label: string;
  /** Wert, der in der E-Mail erscheint - meist identisch mit label */
  value?: string;
}

export interface ContactFormBlok extends BaseBlok {
  component: "contact_form";
  tagline?: string;
  headline: string;
  headlineAccent?: string;
  description?: string;
  /** Anker-ID für Verlinkung (z.B. "foerderung" für href="#foerderung") */
  anchorId?: string;
  /** Texte für die Felder - überschreibbar je Kontext (PKW-Anfrage, LKW, Standort, ...) */
  nameLabel?: string;
  emailLabel?: string;
  phoneLabel?: string;
  topicLabel?: string;
  messageLabel?: string;
  submitLabel?: string;
  /** Optionale, vordefinierte Themen für ein Dropdown */
  topics?: TopicOption[];
  /** Hinweis-Text unter dem Formular (z.B. Antwortzeit) */
  helperText?: string;
  /** Erfolgs-Nachricht nach Versand */
  successHeadline?: string;
  successText?: string;
  /** DSGVO-Checkbox-Text. {{link}} wird durch einen Datenschutz-Link ersetzt. */
  consentLabel?: string;
  privacyUrl?: string;
}

interface Props {
  blok: ContactFormBlok;
}

interface FieldErrors {
  [field: string]: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ blok }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const labels = {
    name: blok.nameLabel ?? "Name",
    email: blok.emailLabel ?? "E-Mail",
    phone: blok.phoneLabel ?? "Telefon (optional)",
    topic: blok.topicLabel ?? "Thema",
    message: blok.messageLabel ?? "Deine Nachricht",
    submit: blok.submitLabel ?? "Nachricht senden",
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setGlobalError(null);
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""), // honeypot
      consent: formData.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: Array<{ field: string; message: string }>;
      };

      if (!res.ok || !json.ok) {
        if (json.errors) {
          const fieldErrors: FieldErrors = {};
          for (const e of json.errors) fieldErrors[e.field] = e.message;
          setErrors(fieldErrors);
        }
        setGlobalError(
          json.error ??
            "Versand fehlgeschlagen. Bitte versuche es erneut oder ruf uns an.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setGlobalError(
        "Versand fehlgeschlagen. Bitte versuche es erneut oder ruf uns an.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section
        {...storyblokEditable(blok)}
        id={blok.anchorId}
        className="py-16 md:py-20"
      >
        <Container>
          <div className="mx-auto max-w-xl rounded-brand border border-brand-green-accent bg-brand-green-soft p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-brand-ink">
              <CheckIcon />
            </div>
            <h2 className="mb-2 text-2xl font-medium">
              {blok.successHeadline ?? "Danke für deine Nachricht!"}
            </h2>
            <p className="text-sm text-brand-text">
              {blok.successText ??
                "Wir melden uns innerhalb von 24 Stunden bei dir zurück."}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      {...storyblokEditable(blok)}
      id={blok.anchorId}
      className="py-16 md:py-20"
    >
      <Container>
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
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
              <p className="text-sm leading-relaxed text-brand-text">
                {blok.description}
              </p>
            ) : null}
            {blok.helperText ? (
              <p className="mt-6 text-[12px] text-brand-text">{blok.helperText}</p>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-brand border border-brand-border bg-white p-6 md:p-8"
          >
            {/* Honeypot: visuell und für Screenreader versteckt */}
            <div aria-hidden="true" className="hidden">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <Field
                id="name"
                name="name"
                label={labels.name}
                required
                error={errors.name}
              />
              <Field
                id="email"
                name="email"
                label={labels.email}
                type="email"
                required
                error={errors.email}
              />
            </div>

            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <Field
                id="phone"
                name="phone"
                label={labels.phone}
                type="tel"
                error={errors.phone}
              />
              {blok.topics && blok.topics.length > 0 ? (
                <SelectField
                  id="topic"
                  name="topic"
                  label={labels.topic}
                  options={blok.topics}
                  error={errors.topic}
                />
              ) : (
                <Field
                  id="topic"
                  name="topic"
                  label={labels.topic}
                  error={errors.topic}
                />
              )}
            </div>

            <div className="mb-4">
              <TextAreaField
                id="message"
                name="message"
                label={labels.message}
                required
                error={errors.message}
              />
            </div>

            <ConsentField
              error={errors.consent}
              text={blok.consentLabel}
              privacyUrl={blok.privacyUrl}
            />

            {globalError ? (
              <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {globalError}
              </div>
            ) : null}

            <div className="mt-6 flex items-center gap-3">
              <Button variant="primary" className="!cursor-pointer">
                {status === "submitting" ? "Sende..." : labels.submit}
                <ArrowRight />
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}

function fieldClassName(error?: string) {
  return [
    "w-full rounded-md border bg-white px-3 py-2.5 text-sm transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-brand-green/40",
    error ? "border-red-400" : "border-brand-border focus:border-brand-green",
  ].join(" ");
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-brand-ink"
      >
        {label}
        {required ? <span className="text-brand-green"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClassName(error)}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-[12px] text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  options,
  error,
}: {
  id: string;
  name: string;
  label: string;
  options: TopicOption[];
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-brand-ink"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClassName(error)}
      >
        <option value="" disabled>
          Bitte auswählen
        </option>
        {options.map((option) => (
          <option key={option._uid} value={option.value ?? option.label}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-[12px] text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextAreaField({
  id,
  name,
  label,
  required,
  error,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-brand-ink"
      >
        {label}
        {required ? <span className="text-brand-green"> *</span> : null}
      </label>
      <textarea
        id={id}
        name={name}
        rows={5}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClassName(error)}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-[12px] text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ConsentField({
  text,
  privacyUrl,
  error,
}: {
  text?: string;
  privacyUrl?: string;
  error?: string;
}) {
  const fallback =
    "Ich willige ein, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden. Mehr in der {{link}}.";
  const template = text ?? fallback;
  const linkLabel = "Datenschutzerklärung";
  const parts = template.split("{{link}}");

  return (
    <div>
      <label className="flex items-start gap-2.5 text-[12px] leading-relaxed text-brand-text">
        <input
          type="checkbox"
          name="consent"
          aria-invalid={Boolean(error) || undefined}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-border accent-brand-green"
        />
        <span>
          {parts[0]}
          {parts.length > 1 ? (
            <>
              <a
                href={privacyUrl ?? "/datenschutz"}
                className="underline decoration-brand-green underline-offset-2 hover:text-brand-ink"
              >
                {linkLabel}
              </a>
              {parts[1]}
            </>
          ) : null}
        </span>
      </label>
      {error ? (
        <p className="mt-1 text-[12px] text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12l5 5L20 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
