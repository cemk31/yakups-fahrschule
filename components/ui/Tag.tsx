interface TagProps {
  children: React.ReactNode;
  variant?: "dark" | "light";
}

export function Tag({ children, variant = "dark" }: TagProps) {
  const classes =
    variant === "dark"
      ? "bg-brand-ink text-brand-green"
      : "bg-brand-green-soft text-[color:var(--color-brand-green-dark)]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider ${classes}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden="true" />
      {children}
    </span>
  );
}
