import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

/* ─── Component ───────────────────────────────────────────────────── */

export interface SourceCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Source title */
  title: string;
  /** Source URL (optional) */
  url?: string;
  /** Preview text content */
  content: string;
  /** Relevance score from 0 to 1 */
  relevance: number;
  /** Display variant */
  variant?: "compact" | "full";
}

function relevanceColor(score: number): { bar: string; text: string } {
  if (score >= 0.8) return { bar: "bg-emerald-400", text: "text-emerald-600" };
  if (score >= 0.5) return { bar: "bg-amber-400", text: "text-amber-600" };
  return { bar: "bg-red-400", text: "text-red-600" };
}

function relevanceLabel(score: number): string {
  if (score >= 0.8) return "High";
  if (score >= 0.5) return "Medium";
  return "Low";
}

export const SourceCard = forwardRef<HTMLDivElement, SourceCardProps>(
  (
    { title, url, content, relevance, variant = "full", className, ...props },
    ref,
  ) => {
    const colors = relevanceColor(relevance);
    const pct = Math.round(relevance * 100);

    if (variant === "compact") {
      return (
        <div
          ref={ref}
          data-variant="compact"
          className={cn(
            "arclo-source-card flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5",
            className,
          )}
          {...props}
        >
          {/* Relevance dot */}
          <span
            className={cn("mt-1 inline-block h-2 w-2 shrink-0 rounded-full", colors.bar)}
            title={`${pct}% relevance`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm font-medium text-gray-800 hover:text-[#6C5CE7] hover:underline"
                >
                  {title}
                </a>
              ) : (
                <span className="truncate text-sm font-medium text-gray-800">
                  {title}
                </span>
              )}
              <span className={cn("shrink-0 text-[10px] font-semibold", colors.text)}>
                {pct}%
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-gray-400">{content}</p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-variant="full"
        className={cn(
          "arclo-source-card overflow-hidden rounded-lg border border-gray-200 bg-white",
          className,
        )}
        {...props}
      >
        {/* Relevance bar */}
        <div className="relative h-1.5 w-full bg-gray-100">
          <div
            className={cn("absolute inset-y-0 left-0 transition-all duration-300", colors.bar)}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-800 hover:text-[#6C5CE7] hover:underline"
                >
                  {title}
                </a>
              ) : (
                <span className="text-sm font-medium text-gray-800">
                  {title}
                </span>
              )}
              {url && (
                <p className="mt-0.5 truncate text-xs text-gray-400">{url}</p>
              )}
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                relevance >= 0.8 && "border-emerald-200 bg-emerald-50 text-emerald-700",
                relevance >= 0.5 && relevance < 0.8 && "border-amber-200 bg-amber-50 text-amber-700",
                relevance < 0.5 && "border-red-200 bg-red-50 text-red-700",
              )}
            >
              {relevanceLabel(relevance)} {pct}%
            </span>
          </div>

          {/* Content preview */}
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
            {content}
          </p>
        </div>
      </div>
    );
  },
);
SourceCard.displayName = "SourceCard";
