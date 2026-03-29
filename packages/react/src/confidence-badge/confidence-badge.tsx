import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";
import type { ConfidenceLevel } from "../lib/types";

const levelConfig: Record<
  ConfidenceLevel,
  { label: string; classes: string }
> = {
  high: {
    label: "High confidence",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  medium: {
    label: "Medium confidence",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  low: {
    label: "Low confidence",
    classes: "bg-red-50 text-red-700 border-red-200",
  },
  unknown: {
    label: "Confidence unknown",
    classes: "bg-gray-50 text-gray-500 border-gray-200",
  },
};

/* ─── Badge ───────────────────────────────────────────────────────── */

export interface ConfidenceBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Confidence level */
  level: ConfidenceLevel;
  /** Custom label override */
  label?: string;
  /** Show as a small dot indicator instead of full badge */
  variant?: "badge" | "dot" | "inline";
}

export const ConfidenceBadge = forwardRef<HTMLSpanElement, ConfidenceBadgeProps>(
  ({ level, label, variant = "badge", className, ...props }, ref) => {
    const config = levelConfig[level];
    const displayLabel = label ?? config.label;

    if (variant === "dot") {
      return (
        <span
          ref={ref}
          role="status"
          aria-label={displayLabel}
          title={displayLabel}
          className={cn(
            "arclo-confidence-dot inline-block h-2.5 w-2.5 shrink-0 rounded-full",
            level === "high" && "bg-emerald-500",
            level === "medium" && "bg-amber-500",
            level === "low" && "bg-red-500",
            level === "unknown" && "bg-gray-400",
            className,
          )}
          {...props}
        />
      );
    }

    if (variant === "inline") {
      return (
        <span
          ref={ref}
          role="status"
          className={cn(
            "arclo-confidence-inline text-xs italic",
            level === "high" && "text-emerald-600",
            level === "medium" && "text-amber-600",
            level === "low" && "text-red-600",
            level === "unknown" && "text-gray-400",
            className,
          )}
          {...props}
        >
          {displayLabel}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        role="status"
        className={cn(
          "arclo-confidence-badge inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
          config.classes,
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            level === "high" && "bg-emerald-500",
            level === "medium" && "bg-amber-500",
            level === "low" && "bg-red-500",
            level === "unknown" && "bg-gray-400",
          )}
        />
        {displayLabel}
      </span>
    );
  },
);
ConfidenceBadge.displayName = "ConfidenceBadge";
