import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

/* ─── Component ───────────────────────────────────────────────────── */

export interface TokenUsageProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of input tokens used */
  inputTokens: number;
  /** Number of output tokens used */
  outputTokens: number;
  /** Maximum token budget */
  maxTokens: number;
  /** Cost in dollars (optional) */
  cost?: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

export const TokenUsage = forwardRef<HTMLDivElement, TokenUsageProps>(
  ({ inputTokens, outputTokens, maxTokens, cost, className, ...props }, ref) => {
    const total = inputTokens + outputTokens;
    const inputPct = maxTokens > 0 ? (inputTokens / maxTokens) * 100 : 0;
    const outputPct = maxTokens > 0 ? (outputTokens / maxTokens) * 100 : 0;
    const totalPct = Math.min(inputPct + outputPct, 100);

    const isHigh = totalPct > 80;
    const isMedium = totalPct > 50 && totalPct <= 80;

    return (
      <div
        ref={ref}
        className={cn(
          "arclo-token-usage rounded-lg border border-gray-200 bg-white p-4",
          className,
        )}
        {...props}
      >
        {/* Labels row */}
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium text-gray-700">
            {formatNumber(total)}{" "}
            <span className="font-normal text-gray-400">
              / {formatNumber(maxTokens)} tokens
            </span>
          </span>
          {cost != null && (
            <span className="font-medium text-gray-600">
              ${cost.toFixed(4)}
            </span>
          )}
        </div>

        {/* Bar */}
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          {/* Input portion */}
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-l-full transition-all duration-300",
              isHigh ? "bg-red-400" : isMedium ? "bg-amber-400" : "bg-blue-400",
            )}
            style={{ width: `${Math.min(inputPct, 100)}%` }}
          />
          {/* Output portion */}
          <div
            className={cn(
              "absolute inset-y-0 transition-all duration-300",
              isHigh
                ? "bg-red-300"
                : isMedium
                  ? "bg-amber-300"
                  : "bg-violet-400",
              outputPct > 0 && inputPct + outputPct >= 100 && "rounded-r-full",
            )}
            style={{
              left: `${Math.min(inputPct, 100)}%`,
              width: `${Math.min(outputPct, 100 - Math.min(inputPct, 100))}%`,
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center gap-4 text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                isHigh ? "bg-red-400" : isMedium ? "bg-amber-400" : "bg-blue-400",
              )}
            />
            Input: {formatNumber(inputTokens)}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                isHigh
                  ? "bg-red-300"
                  : isMedium
                    ? "bg-amber-300"
                    : "bg-violet-400",
              )}
            />
            Output: {formatNumber(outputTokens)}
          </span>
        </div>
      </div>
    );
  },
);
TokenUsage.displayName = "TokenUsage";
