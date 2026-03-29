import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

/* ─── Root ────────────────────────────────────────────────────────── */

export interface RefusalCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Why the request was refused */
  reason?: string;
  /** The type of refusal */
  type?: "safety" | "capability" | "policy" | "context";
  /** Suggested alternative prompts */
  suggestions?: string[];
  /** Called when user clicks a suggestion */
  onSuggestionClick?: (suggestion: string) => void;
  /** Custom icon */
  icon?: ReactNode;
}

const typeConfig: Record<
  NonNullable<RefusalCardProps["type"]>,
  { icon: string; defaultReason: string; accent: string }
> = {
  safety: {
    icon: "🛡",
    defaultReason: "I can't help with that request for safety reasons.",
    accent: "border-red-200 bg-red-50",
  },
  capability: {
    icon: "⚡",
    defaultReason: "I'm not able to do that right now.",
    accent: "border-amber-200 bg-amber-50",
  },
  policy: {
    icon: "📋",
    defaultReason: "That request falls outside my usage policy.",
    accent: "border-orange-200 bg-orange-50",
  },
  context: {
    icon: "🔍",
    defaultReason: "I don't have enough context to help with that.",
    accent: "border-blue-200 bg-blue-50",
  },
};

export const RefusalCard = forwardRef<HTMLDivElement, RefusalCardProps>(
  (
    {
      reason,
      type = "capability",
      suggestions,
      onSuggestionClick,
      icon,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const config = typeConfig[type];
    const displayReason = reason ?? config.defaultReason;

    return (
      <div
        ref={ref}
        role="alert"
        data-refusal-type={type}
        className={cn(
          "arclo-refusal-card rounded-lg border p-4",
          config.accent,
          className,
        )}
        {...props}
      >
        <div className="flex gap-3">
          <span className="text-lg" aria-hidden>
            {icon ?? config.icon}
          </span>
          <div className="flex-1">
            <p className="text-sm text-gray-800">{displayReason}</p>

            {children}

            {suggestions && suggestions.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-medium text-gray-500">
                  Try instead:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onSuggestionClick?.(s)}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50 cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
RefusalCard.displayName = "RefusalCard";
