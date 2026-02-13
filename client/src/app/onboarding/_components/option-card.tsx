"use client";

interface OptionCardProps {
  label: string;
  icon?: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({
  label,
  icon,
  subtitle,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex items-center gap-3 w-full rounded-xl border px-4 py-3
        text-left transition-all duration-200 ease-out cursor-pointer
        ${
          selected
            ? "border-primary bg-primary-light ring-1 ring-primary"
            : "border-border bg-surface-elevated hover:border-border-strong hover:shadow-xs"
        }
      `}
    >
      {icon && <span className="text-xl shrink-0">{icon}</span>}
      <div className="min-w-0">
        <span
          className={`block text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}
        >
          {label}
        </span>
        {subtitle && (
          <span className="block text-xs text-foreground-muted mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
      {selected && (
        <div className="ml-auto shrink-0">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
