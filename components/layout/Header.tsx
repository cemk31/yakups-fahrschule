"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button, ArrowRight } from "@/components/ui/Button";

/**
 * Navigation ist bewusst noch statisch. Für maximale Flexibilität kannst du
 * später eine "Settings"-Story in Storyblok anlegen und die Nav-Struktur
 * dort pflegen. Für den Start reicht das hier.
 *
 * Desktop: horizontale Nav ab md-Breakpoint.
 * Mobile: Burger-Button öffnet ein Vollbild-Overlay mit großen Links.
 * Aktiver Link wird über `usePathname()` erkannt und grün dargestellt.
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Menü bei Routenwechsel schließen
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Body-Scroll sperren wenn Menü offen + Escape schließt
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="bg-brand-ink text-[#fafaf7]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 md:px-12">
        <Link href="/" aria-label="Yakups Fahrschule Startseite">
          <Logo />
        </Link>

        {/* Desktop-Nav */}
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

        {/* Mobile Burger-Button */}
        <button
          type="button"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
          className="relative flex h-10 w-10 items-center justify-center rounded-md text-[#fafaf7] transition-colors hover:bg-white/10 md:hidden"
        >
          <span className="sr-only">
            {menuOpen ? "Menü schließen" : "Menü öffnen"}
          </span>
          <BurgerIcon open={menuOpen} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Hauptnavigation"
        className={`fixed inset-0 z-[60] flex flex-col bg-brand-ink text-[#fafaf7] transition-opacity duration-200 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Top-Bar im Overlay */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            href="/"
            aria-label="Yakups Fahrschule Startseite"
            onClick={() => setMenuOpen(false)}
          >
            <Logo />
          </Link>
          <button
            type="button"
            aria-label="Menü schließen"
            onClick={() => setMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-[#fafaf7] hover:bg-white/10"
          >
            <CloseIcon />
          </button>
        </div>

        <nav
          aria-label="Hauptnavigation mobil"
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 pb-10 pt-4"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-2 py-3 text-2xl transition-colors ${
                  active
                    ? "font-medium text-brand-green"
                    : "text-[#fafaf7] hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
            <Button
              variant="primary"
              href="https://fs0943.fso360-svc.de"
              className="w-full justify-center px-4 py-3 text-base"
            >
              Jetzt anmelden
              <ArrowRight />
            </Button>
            <a
              href="tel:+491743838353"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-white/20 px-4 py-3 text-base text-[#fafaf7] hover:bg-white/5"
            >
              <PhoneIcon />
              0174 3838353
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-6" aria-hidden="true">
      <span
        className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-200 ${
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
        }`}
      />
      <span
        className={`absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-current transition-opacity duration-200 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-200 ${
          open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
        }`}
      />
    </span>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
