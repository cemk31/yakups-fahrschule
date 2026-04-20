#!/usr/bin/env node
/**
 * Storyblok Story Push
 * --------------------
 * Lädt eine Beispielstory aus /storyblok-schemas/_example-*.json und legt
 * sie im Storyblok-Space als Draft an. Wenn die Story (gleicher Slug) schon
 * existiert, wird sie aktualisiert.
 *
 * Fügt allen Bloks deterministisch _uid-Werte hinzu, falls sie fehlen.
 *
 * Nutzung:
 *   node scripts/push-story.mjs <schema-file>              # Dry-Run
 *   node scripts/push-story.mjs <schema-file> --apply      # anlegen/aktualisieren
 *   node scripts/push-story.mjs <schema-file> --apply --publish
 *
 * Beispiel:
 *   node scripts/push-story.mjs _example-fuehrerscheine-story.json --apply
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { randomUUID } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = path.resolve(__dirname, "..", "storyblok-schemas");

// --- CLI & env ----------------------------------------------------------

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const PUBLISH = args.includes("--publish");
const schemaFile = args.find((a) => !a.startsWith("--"));

if (!schemaFile) {
  console.error(
    "Nutzung: node scripts/push-story.mjs <schema-file> [--apply] [--publish]",
  );
  process.exit(1);
}

async function loadEnv() {
  const envPath = path.resolve(__dirname, "..", ".env.local");
  try {
    const text = await readFile(envPath, "utf8");
    for (const line of text.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!match) continue;
      const [, key, value] = match;
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

await loadEnv();

const TOKEN = process.env.STORYBLOK_MGMT_TOKEN;
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const REGION = (process.env.STORYBLOK_REGION ?? "eu").toLowerCase();

if (!TOKEN || !SPACE_ID) {
  console.error("✖ STORYBLOK_MGMT_TOKEN und STORYBLOK_SPACE_ID fehlen.");
  process.exit(1);
}

const API_HOST =
  REGION === "us"
    ? "https://api-us.storyblok.com"
    : "https://mapi.storyblok.com";
const API_BASE = `${API_HOST}/v1/spaces/${SPACE_ID}`;

// --- API-Client ---------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, path, body, attempt = 1) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 429 && attempt <= 5) {
    const wait = 1000 * attempt;
    console.log(`  ⏳ Rate-Limit, warte ${wait}ms...`);
    await sleep(wait);
    return api(method, path, body, attempt + 1);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// --- _uid deterministisch ergänzen --------------------------------------

/**
 * Läuft rekursiv durch das Content-Objekt und hängt an jedes Objekt mit
 * einem `component`-Feld ein `_uid` an, falls keins vorhanden ist.
 * Storyblok akzeptiert Stories ohne _uid, generiert dann aber neue IDs —
 * wir wollen aber stabile IDs, damit die Story-JSON idempotent bleibt.
 */
function ensureUids(node) {
  if (Array.isArray(node)) {
    node.forEach(ensureUids);
    return;
  }
  if (node && typeof node === "object") {
    if (typeof node.component === "string" && !node._uid) {
      node._uid = randomUUID();
    }
    for (const value of Object.values(node)) {
      ensureUids(value);
    }
  }
}

/**
 * Stellt sicher, dass alle Elternordner für einen full_slug existieren.
 * Gibt die parent_id für die eigentliche Story zurück (0 = root).
 *
 * Beispiel: full_slug "news/neuer-theoriekurs" → legt (falls nötig) Ordner
 * "news" an und gibt dessen ID zurück.
 */
async function ensureFolderPath(fullSlug) {
  const parts = fullSlug.split("/");
  if (parts.length <= 1) return 0;

  let parentId = 0;
  let cumulativeSlug = "";

  for (let i = 0; i < parts.length - 1; i++) {
    const slugPart = parts[i];
    cumulativeSlug = cumulativeSlug ? `${cumulativeSlug}/${slugPart}` : slugPart;

    const lookup = await api(
      "GET",
      `/stories?with_slug=${encodeURIComponent(cumulativeSlug)}&per_page=1`,
    );
    const existing = lookup.stories?.find((s) => s.full_slug === cumulativeSlug);

    if (existing) {
      parentId = existing.id;
    } else {
      // Ordner anlegen — Storyblok-Ordner sind Stories mit is_folder=true
      const created = await api("POST", "/stories", {
        story: {
          name: slugPart.charAt(0).toUpperCase() + slugPart.slice(1),
          slug: slugPart,
          is_folder: true,
          parent_id: parentId,
        },
      });
      parentId = created.story?.id;
      console.log(`  + Ordner angelegt: ${cumulativeSlug} (id=${parentId})`);
    }
  }
  return parentId;
}

// --- Main ---------------------------------------------------------------

async function main() {
  const fullPath = path.isAbsolute(schemaFile)
    ? schemaFile
    : path.join(SCHEMA_DIR, schemaFile);

  const text = await readFile(fullPath, "utf8");
  const storyJson = JSON.parse(text);

  const slug = storyJson.slug;
  const name = storyJson.name;
  if (!slug || !name || !storyJson.content) {
    throw new Error(
      "Schema-Datei braucht 'slug', 'name' und 'content' auf Top-Level",
    );
  }

  // _uid an allen Bloks sicherstellen
  ensureUids(storyJson.content);
  // _comment ist nur Doku, gehört nicht ins Content-Feld
  const { _comment, ...rest } = storyJson;

  console.log(
    `• Story-Push (${APPLY ? "APPLY" : "DRY-RUN"}${PUBLISH ? " + PUBLISH" : ""})`,
  );
  console.log(`  Space: ${SPACE_ID} (${REGION.toUpperCase()})`);
  console.log(`  Slug:  ${slug}`);
  console.log(`  Name:  ${name}`);

  // Prüfen, ob die Story bereits existiert
  const existing = await api(
    "GET",
    `/stories?with_slug=${encodeURIComponent(slug)}&per_page=1`,
  );
  const match = existing.stories?.find((s) => s.full_slug === slug);

  if (match) {
    console.log(`  Status: existiert bereits (id=${match.id})`);
  } else {
    console.log(`  Status: neu anlegen`);
  }

  // Für Stories unter einem Pfad (z.B. news/xy) Elternordner sicherstellen.
  // Der API-Story-slug ist nur der letzte Part, parent_id zeigt auf den Folder.
  const slugParts = slug.split("/");
  const storySlug = slugParts[slugParts.length - 1];
  const parentId = APPLY ? await ensureFolderPath(slug) : 0;

  const payload = {
    story: {
      name,
      slug: storySlug,
      content: storyJson.content,
      is_startpage: Boolean(storyJson.is_startpage),
      parent_id: parentId,
    },
    publish: PUBLISH ? 1 : 0,
  };

  if (!APPLY) {
    const blokCount = countBloks(storyJson.content);
    console.log(`\n  Inhalt: ${blokCount} Bloks insgesamt`);
    console.log(
      "\n(Dry-Run: keine Änderungen durchgeführt. Mit --apply ausführen.)",
    );
    return;
  }

  if (match) {
    await api("PUT", `/stories/${match.id}`, payload);
    console.log(`\n  ✓ Story aktualisiert (id=${match.id})`);
  } else {
    const result = await api("POST", "/stories", payload);
    console.log(`\n  ✓ Story angelegt (id=${result.story?.id})`);
  }

  if (PUBLISH) {
    console.log("  ✓ published");
  } else {
    console.log("  (als Draft — im Visual Editor prüfen und dann publishen)");
  }
}

function countBloks(node) {
  let n = 0;
  if (Array.isArray(node)) {
    for (const item of node) n += countBloks(item);
  } else if (node && typeof node === "object") {
    if (typeof node.component === "string") n += 1;
    for (const value of Object.values(node)) n += countBloks(value);
  }
  return n;
}

main().catch((err) => {
  console.error("\n✖ Fehler:", err.message);
  process.exit(1);
});
