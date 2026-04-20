#!/usr/bin/env node
/**
 * Storyblok Component Sync
 * ------------------------
 * Liest die JSON-Schemas in /storyblok-schemas und legt sie als Components
 * im Storyblok-Space an. Bestehende Components werden aktualisiert.
 *
 * WICHTIG: Dieses Skript schreibt keine Stories und löscht nichts.
 * Es fasst nur Components an.
 *
 * Benötigte Env-Variablen:
 *   STORYBLOK_MGMT_TOKEN - Personal Access Token mit Management-API-Zugriff
 *   STORYBLOK_SPACE_ID   - Space-ID (Zahl, aus Storyblok URL)
 *   STORYBLOK_REGION     - 'eu' (default) oder 'us'
 *
 * Nutzung:
 *   node scripts/sync-storyblok.mjs              # Dry-Run (zeigt nur an, was passiert wäre)
 *   node scripts/sync-storyblok.mjs --apply      # Echte Änderungen
 */

import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = path.resolve(__dirname, "..", "storyblok-schemas");

// --- CLI & env ----------------------------------------------------------

const APPLY = process.argv.includes("--apply");

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
    // optional - CI nutzt echte env-Variablen
  }
}

await loadEnv();

const TOKEN = process.env.STORYBLOK_MGMT_TOKEN;
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const REGION = (process.env.STORYBLOK_REGION ?? "eu").toLowerCase();

if (!TOKEN || !SPACE_ID) {
  console.error(
    "✖ STORYBLOK_MGMT_TOKEN und STORYBLOK_SPACE_ID müssen in .env.local (oder env) gesetzt sein.",
  );
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
    // Storyblok erlaubt nur 6 Requests/s — Backoff & retry
    const wait = 1000 * attempt;
    console.log(`  ⏳ Rate-Limit, warte ${wait}ms und versuche erneut...`);
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

// --- Schema-Dateien laden ----------------------------------------------

/**
 * Eine Schema-Datei kann entweder ein einzelner Component sein (Top-Level-Keys
 * "name", "schema") oder ein Dictionary mehrerer Components (jeder Eintrag
 * hat sein eigenes { name, schema }).
 */
function extractComponents(json) {
  if (json && typeof json === "object" && "name" in json && "schema" in json) {
    return [json];
  }
  const components = [];
  for (const [key, value] of Object.entries(json ?? {})) {
    if (value && typeof value === "object" && "name" in value && "schema" in value) {
      components.push(value);
    } else if (value && typeof value === "object" && "schema" in value) {
      components.push({ name: key, ...value });
    }
  }
  return components;
}

async function loadAllComponents() {
  // _example-*.json sind Story-Beispiele, nicht Component-Definitionen
  const files = (await readdir(SCHEMA_DIR)).filter(
    (f) => f.endsWith(".json") && !f.startsWith("_example"),
  );
  const all = new Map();
  for (const file of files) {
    const text = await readFile(path.join(SCHEMA_DIR, file), "utf8");
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      throw new Error(`${file}: ungültiges JSON — ${err.message}`);
    }
    for (const c of extractComponents(parsed)) {
      if (!c.name) continue;
      all.set(c.name, { file, component: c });
    }
  }
  return all;
}

// --- Diff / Apply -------------------------------------------------------

function normalizeSchema(schema) {
  // Storyblok liefert Schema-Einträge mit zusätzlichen Feldern (pos, id,
  // created_at). Für den Vergleich filtern wir darauf, was wir definiert haben.
  const out = {};
  for (const [key, value] of Object.entries(schema ?? {})) {
    const {
      // von Storyblok zurückgegeben, aber für uns nicht relevant
      id: _id,
      pos: _pos,
      created_at: _c,
      updated_at: _u,
      ...rest
    } = value ?? {};
    out[key] = rest;
  }
  return out;
}

function shallowEqualComponent(local, remote) {
  if (local.display_name !== remote.display_name) return false;
  if ((local.is_root ?? false) !== (remote.is_root ?? false)) return false;
  if ((local.is_nestable ?? true) !== (remote.is_nestable ?? true)) return false;
  const a = JSON.stringify(normalizeSchema(local.schema ?? {}));
  const b = JSON.stringify(normalizeSchema(remote.schema ?? {}));
  return a === b;
}

async function fetchExistingComponents() {
  const data = await api("GET", "/components");
  const byName = new Map();
  for (const c of data.components ?? []) byName.set(c.name, c);
  return byName;
}

async function sync() {
  console.log(
    `• Storyblok Sync (${APPLY ? "APPLY" : "DRY-RUN"}) gegen Space ${SPACE_ID} (${REGION.toUpperCase()})`,
  );

  const localComponents = await loadAllComponents();
  console.log(`• ${localComponents.size} lokale Components gefunden`);

  const remote = await fetchExistingComponents();
  console.log(`• ${remote.size} Components bereits in Storyblok`);

  const toCreate = [];
  const toUpdate = [];
  const unchanged = [];

  for (const [name, { file, component }] of localComponents) {
    const existing = remote.get(name);
    if (!existing) {
      toCreate.push({ name, file, component });
    } else if (!shallowEqualComponent(component, existing)) {
      toUpdate.push({ name, file, component, existing });
    } else {
      unchanged.push({ name, file });
    }
  }

  console.log("");
  console.log(`→ Unverändert:   ${unchanged.length}`);
  console.log(`→ Neu anlegen:   ${toCreate.length}`);
  console.log(`→ Aktualisieren: ${toUpdate.length}`);
  console.log("");

  for (const item of toCreate) {
    console.log(`  + ${item.name}  (aus ${item.file})`);
  }
  for (const item of toUpdate) {
    console.log(`  ~ ${item.name}  (aus ${item.file})`);
  }

  if (!APPLY) {
    console.log("\n(Dry-Run: keine Änderungen durchgeführt. Mit --apply ausführen.)");
    return;
  }

  console.log("\n• Änderungen werden geschrieben (mit 200ms-Pause gegen Rate-Limit)...");
  for (const { name, component } of toCreate) {
    await api("POST", "/components", {
      component: {
        name: component.name,
        display_name: component.display_name,
        schema: component.schema ?? {},
        is_root: component.is_root ?? false,
        is_nestable: component.is_nestable ?? true,
      },
    });
    console.log(`  ✓ angelegt: ${name}`);
    await sleep(200);
  }

  for (const { name, component, existing } of toUpdate) {
    await api("PUT", `/components/${existing.id}`, {
      component: {
        name: component.name,
        display_name: component.display_name,
        schema: component.schema ?? {},
        is_root: component.is_root ?? existing.is_root ?? false,
        is_nestable: component.is_nestable ?? existing.is_nestable ?? true,
      },
    });
    console.log(`  ✓ aktualisiert: ${name}`);
    await sleep(200);
  }

  console.log("\n✓ Sync abgeschlossen.");
}

sync().catch((err) => {
  console.error("\n✖ Fehler beim Sync:", err.message);
  process.exit(1);
});
