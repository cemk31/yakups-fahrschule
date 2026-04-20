export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 8 C13 8 8 14 8 21"
          stroke="#A5C620"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M20 8 C27 8 32 14 32 21"
          stroke="#A5C620"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M24 14 L30 11"
          stroke="#A5C620"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-sm font-medium tracking-wide">
        YAKUPS<span className="text-brand-green"> FAHRSCHULE</span>
      </span>
    </div>
  );
}
