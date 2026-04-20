import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "dark" | "ghost" | "white";

interface ButtonProps {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-green text-brand-ink hover:bg-brand-green-dark",
  dark:
    "bg-brand-ink text-white hover:bg-black",
  ghost:
    "bg-transparent text-brand-ink border border-brand-ink hover:bg-brand-ink hover:text-white",
  white:
    "bg-white text-brand-ink hover:bg-brand-bg",
};

const baseClasses =
  "inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors";

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...rest
}: ButtonProps & Omit<ComponentPropsWithoutRef<"button">, "children">) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
