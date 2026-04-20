"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dezenter Scroll-Reveal.
 *
 * Wickelt sich um eine Section/Blok. Beim Scrollen in den Viewport faded
 * der Inhalt sanft ein (opacity 0 → 1) und schiebt sich leicht nach oben
 * (translateY 20px → 0). Einmal sichtbar bleibt der Zustand — kein
 * erneutes Abspielen, wenn man wieder zurückscrollt.
 *
 * Respektiert `prefers-reduced-motion` und rendert den Content dann
 * sofort ohne Animation.
 */
interface RevealProps {
  children: React.ReactNode;
  /** Verzögerung in ms (gestaffeltes Einblenden bei Grids möglich). */
  delay?: number;
  /** Fallback-Render wenn JS deaktiviert: immer sichtbar. */
  as?: "div" | "section" | "article";
}

export function Reveal({ children, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    // Wenn die Section beim Seitenaufruf schon (fast) im Viewport ist,
    // direkt sichtbar setzen — sonst blinkt es bei SSR-Inhalten above-the-fold.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.08,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const style: React.CSSProperties = reducedMotion
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, 20px, 0)",
        transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
      };

  return (
    <Tag ref={ref as never} style={style}>
      {children}
    </Tag>
  );
}
