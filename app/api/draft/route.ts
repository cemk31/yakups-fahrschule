import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Der Storyblok Visual Editor zeigt Inhalte als <iframe> an. Damit er die
 * Draft-Version (nicht die live Version) sieht, triggert er beim Öffnen
 * diesen Endpoint. Er aktiviert Next.js' Draft-Mode-Cookie und leitet
 * zurück auf die angeforderte Seite.
 *
 * In Storyblok unter Settings > Visual Editor eintragen:
 *   https://yakups-fahrschule.de/api/draft?secret=DEIN_SECRET&slug=/
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") ?? "/";

  if (secret !== process.env.STORYBLOK_WEBHOOK_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(slug);
}
