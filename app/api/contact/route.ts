import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint für das Kontakt-Formular.
 * Validiert die Eingaben serverseitig und schickt eine E-Mail über Resend
 * (https://resend.com — DSGVO-konform, EU-Region wählbar).
 *
 * Erwartete Environment-Variablen:
 *   RESEND_API_KEY        - API-Key aus dem Resend-Dashboard
 *   CONTACT_FROM_EMAIL    - Absender (verifizierte Domain bei Resend)
 *   CONTACT_TO_EMAIL      - Empfänger (Yakups Postfach)
 *
 * Solange RESEND_API_KEY fehlt, läuft die Route in einen "Dry-Run" und
 * loggt die Anfrage nur — praktisch für Entwicklung und für den ersten
 * Live-Deploy ohne Resend-Setup.
 */

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
  /** Honeypot - menschliche Nutzer füllen das nie aus */
  website?: string;
  /** Zustimmung zur Datenverarbeitung (DSGVO) */
  consent?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

const MAX_LENGTHS = {
  name: 120,
  email: 200,
  phone: 40,
  topic: 80,
  message: 4000,
};

function validate(payload: ContactPayload): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!payload.name || payload.name.trim().length < 2) {
    errors.push({ field: "name", message: "Bitte gib deinen Namen an." });
  } else if (payload.name.length > MAX_LENGTHS.name) {
    errors.push({ field: "name", message: "Name ist zu lang." });
  }

  const email = payload.email?.trim() ?? "";
  // Bewusst pragmatischer Regex - 100% RFC-Validierung ist im Browser sinnlos
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: "email", message: "Bitte gib eine gültige E-Mail an." });
  } else if (email.length > MAX_LENGTHS.email) {
    errors.push({ field: "email", message: "E-Mail-Adresse ist zu lang." });
  }

  if (payload.phone && payload.phone.length > MAX_LENGTHS.phone) {
    errors.push({ field: "phone", message: "Telefonnummer ist zu lang." });
  }

  if (payload.topic && payload.topic.length > MAX_LENGTHS.topic) {
    errors.push({ field: "topic", message: "Thema ist zu lang." });
  }

  if (!payload.message || payload.message.trim().length < 10) {
    errors.push({ field: "message", message: "Bitte schreib uns ein paar Zeilen mehr." });
  } else if (payload.message.length > MAX_LENGTHS.message) {
    errors.push({ field: "message", message: "Nachricht ist zu lang." });
  }

  if (!payload.consent) {
    errors.push({
      field: "consent",
      message: "Bitte stimme der Datenverarbeitung zu.",
    });
  }

  return errors;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmailHtml(payload: ContactPayload): string {
  const rows: Array<[string, string]> = [
    ["Name", payload.name ?? ""],
    ["E-Mail", payload.email ?? ""],
    ["Telefon", payload.phone ?? "—"],
    ["Thema", payload.topic ?? "—"],
  ];
  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#4a4a4a;font-size:13px">${escapeHtml(
          label,
        )}</td><td style="padding:6px 12px;font-size:14px">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const message = escapeHtml(payload.message ?? "").replace(/\n/g, "<br>");
  return `
    <div style="font-family:Inter,Arial,sans-serif;color:#0e0e0e">
      <h2 style="margin:0 0 16px 0">Neue Anfrage über das Kontakt-Formular</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">${rowsHtml}</table>
      <div style="border-top:1px solid #e8e8e3;padding-top:16px;font-size:14px;line-height:1.5">
        ${message}
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ungültiger Request-Body." },
      { status: 400 },
    );
  }

  // Honeypot - wenn ausgefüllt, ist es mit hoher Wahrscheinlichkeit ein Bot.
  // Wir antworten freundlich mit 200, damit der Bot keinen Hinweis bekommt.
  if (payload.website && payload.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const errors = validate(payload);
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    // Dry-Run für lokale Entwicklung — Daten werden nur geloggt, nicht versendet.
    console.warn(
      "[contact] RESEND_API_KEY/CONTACT_FROM_EMAIL/CONTACT_TO_EMAIL fehlt. Anfrage wird nur geloggt.",
      { name: payload.name, email: payload.email, topic: payload.topic },
    );
    return NextResponse.json({ ok: true, dryRun: true });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: payload.topic
          ? `Anfrage: ${payload.topic} (${payload.name})`
          : `Neue Anfrage von ${payload.name}`,
        html: renderEmailHtml(payload),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[contact] Resend Fehler", response.status, text);
      return NextResponse.json(
        { ok: false, error: "E-Mail konnte nicht versendet werden." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unerwarteter Fehler", err);
    return NextResponse.json(
      { ok: false, error: "Unerwarteter Fehler." },
      { status: 500 },
    );
  }
}
