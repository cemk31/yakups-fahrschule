import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Storyblok ruft diesen Endpoint auf, wenn im CMS etwas published wird.
 * Wir revalidieren dann gezielt den betroffenen Pfad, damit Besucher
 * innerhalb von Sekunden die neuen Inhalte sehen.
 *
 * Einrichtung in Storyblok:
 *   Settings > Webhooks > Story published / unpublished
 *   URL: https://yakups-fahrschule.de/api/revalidate?secret=DEIN_SECRET
 *
 * Das Secret schützt davor, dass jemand den Webhook spammen kann.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.STORYBLOK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const fullSlug = body?.full_slug as string | undefined;

  if (!fullSlug) {
    // Keine Info welche Story - mindestens Startseite revalidieren.
    // Weitere Seiten werden durch ISR (revalidate = 3600) sowieso
    // spätestens nach einer Stunde aktuell.
    revalidatePath("/", "page");
    return NextResponse.json({ revalidated: "home (fallback)" });
  }

  if (fullSlug === "home") {
    revalidatePath("/", "page");
  } else {
    revalidatePath(`/${fullSlug}`, "page");
  }

  return NextResponse.json({ revalidated: fullSlug });
}
