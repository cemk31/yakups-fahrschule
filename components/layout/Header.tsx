"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button, ArrowRight } from "@/components/ui/Button";

/**
 * Navigation ist bewusst noch statisch. Für maximale Flexibilität kannst du
 * später eine "Settings"-Story in Storyblok anlegen und die Nav-Struktur
 * dort pflegen. Für den Start reicht das hier.
 *
 * Der aktive Link wird über `usePathname()` erkannt. Ein Link gilt als aktiv,
 * wenn der aktuelle Pfad mit seinem href übereinstimmt — oder mit einem
 * übergeordneten Pfad startet (z.B. /news/foo → News).
 */
const NAV_ITEMS: Array<{ href: string; label: string; matches?: string[] }> = [
  { href: "/", label: "Start" },
  { href: "/fuehrerscheine", label: "Führerscheine" },
  {
    href: "/lkw-fuehrerschein",
    label: "LKW & Beruf",
    matches: ["/lkw-fuehrerschein", "/lkw-fuehrerschein-foerderung"],
  },
  { href: "/team", label: "Team" },
  { href: "/news", label: "News" },
  {
    href: "/standorte",
    label: "Standorte",
    matches: ["/standorte", "/bad-iburg", "/hilter"],
  },
];

function isActive(pathname: string, item: (typeof NAV_ITEMS)[number]) {
  if (item.href === "/") return pathname === "/";
  const candidates = item.matches ?? [item.href];
  return candidates.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`),
  );
}

export function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="bg-brand-ink text-[#fafaf7]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5 md:px-12">
        <Link href="/" aria-label="Yakups Fahrschule Startseite">
          <Logo />
        </Link>

        <nav
          aria-label="Hauptnavigation"
          className="hidden items-center gap-6 text-sm md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "font-medium text-brand-green"
                    : "text-[#fafaf7] transition-colors hover:text-brand-green"
                }
              >
                {item.label}
              </Link>
            );
          })}
          <Button
            variant="primary"
            href="https://fs0943.fso360-svc.de"
            className="px-4 py-2 text-[13px]"
          >
            Jetzt anmelden
            <ArrowRight />
          </Button>
        </nav>
      </div>
    </header>
  );
}
