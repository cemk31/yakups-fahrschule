import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-brand-ink text-[#fafaf7]">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-12">
        <div className="mb-8 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="mb-4 max-w-[280px] text-[13px] leading-relaxed text-white/60">
              Deine moderne Fahrschule im Landkreis Osnabrück. Stressfrei zum
              Führerschein seit 2018.
            </p>
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/yakupsfahrschule/"
                aria-label="Instagram"
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="18" cy="6" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/pages/category/Driving-School/Yakups-Fahrschule-472136116526383/"
                aria-label="Facebook"
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.7 0H1.3C.6 0 0 .6 0 1.3v21.3C0 23.4.6 24 1.3 24h11.5v-9.3H9.7v-3.6h3.1V8.4c0-3.1 1.9-4.8 4.7-4.8 1.3 0 2.5.1 2.8.1v3.2h-2c-1.5 0-1.8.7-1.8 1.8v2.4h3.6l-.5 3.6h-3.1V24h6c.7 0 1.3-.6 1.3-1.3V1.3c0-.7-.6-1.3-1.3-1.3z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wider text-brand-green">
              Ausbildung
            </div>
            <ul className="flex flex-col gap-2 text-[13px] text-white/70">
              <li><Link href="/fuehrerschein-klasse-b">Klasse B (PKW)</Link></li>
              <li><Link href="/motorradfuehrerschein">Motorrad A / A1 / A2</Link></li>
              <li><Link href="/lkw-fuehrerschein">LKW C / CE / C1</Link></li>
              <li><Link href="/berufskraftfahrer-ausbildung">Berufskraftfahrer</Link></li>
              <li><Link href="/bkf-weiterbildung">BKF-Weiterbildung</Link></li>
            </ul>
          </div>

          <div>
            <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wider text-brand-green">
              LKW-Themen
            </div>
            <ul className="flex flex-col gap-2 text-[13px] text-white/70">
              <li><Link href="/lkw-fuehrerschein-osnabrueck">LKW Führerschein Osnabrück</Link></li>
              <li><Link href="/lkw-fuehrerschein-bad-iburg">LKW Führerschein Bad Iburg</Link></li>
              <li><Link href="/lkw-fuehrerschein-hilter">LKW Führerschein Hilter</Link></li>
              <li><Link href="/lkw-fuehrerschein-kosten">Kosten &amp; Dauer</Link></li>
              <li><Link href="/lkw-fuehrerschein-foerderung">Förderung Arbeitsagentur</Link></li>
            </ul>
          </div>

          <div>
            <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wider text-brand-green">
              Kontakt
            </div>
            <ul className="flex flex-col gap-2 text-[13px] text-white/70">
              <li>Arkadenstraße 5</li>
              <li>49186 Bad Iburg</li>
              <li><a href="tel:+491743838353" className="text-brand-green">0174 3838353</a></li>
              <li><a href="mailto:info@yakups-fahrschule.de">info@yakups-fahrschule.de</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-white/50">
          <div>© {new Date().getFullYear()} Yakups Fahrschule</div>
          <div className="flex gap-5">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/agb">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
