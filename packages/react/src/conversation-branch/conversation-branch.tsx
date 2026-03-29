import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

/* ─── ConversationBranch ─────────────────────────────────────────── */

export interface ConversationBranchProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Current branch index (1-indexed) */
  current: number;
  /** Total number of branches */
  total: number;
  /** Called when navigating to the previous branch */
  onPrevious?: () => void;
  /** Called when navigating to the next branch */
  onNext?: () => void;
}

export const ConversationBranch = forwardRef<
  HTMLDivElement,
  ConversationBranchProps
>(({ current, total, onPrevious, onNext, className, ...props }, ref) => {
  const atStart = current <= 1;
  const atEnd = current >= total;

  return (
    <div
      ref={ref}
      className={cn(
        "arclo-conversation-branch inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white",
        className,
      )}
      {...props}
    >
      {/* Previous button */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={atStart}
        aria-label="Previous branch"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-l-lg transition-colors cursor-pointer",
          atStart
            ? "cursor-not-allowed text-gray-200"
            : "text-gray-400 hover:bg-gray-50 hover:text-gray-600",
        )}
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Label */}
      <span className="select-none px-1 text-xs font-medium tabular-nums text-gray-500">
        {current}/{total}
      </span>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        disabled={atEnd}
        aria-label="Next branch"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-r-lg transition-colors cursor-pointer",
          atEnd
            ? "cursor-not-allowed text-gray-200"
            : "text-gray-400 hover:bg-gray-50 hover:text-gray-600",
        )}
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
});
ConversationBranch.displayName = "ConversationBranch";
