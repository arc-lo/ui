import { forwardRef, useId, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { themeVars } from "../lib/theme";

/* ─── Types ───────────────────────────────────────────────────────── */

export type StatusIndicatorState =
  | "idle"
  | "thinking"
  | "streaming"
  | "tool-calling"
  | "error";

/* ─── Component ───────────────────────────────────────────────────── */

export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Current state */
  state?: StatusIndicatorState;
  /** Custom label. Default: auto from state */
  label?: string;
  /** Custom icon element */
  icon?: ReactNode;
  /** Color scheme. Default: auto from state */
  color?: "purple" | "amber" | "blue" | "red" | "gray";
  /** Animation style. "pulse" = fade in/out, "sweep" = light moves letter by letter. Default: "sweep" */
  animation?: "pulse" | "sweep";
}

const stateDefaults: Record<
  StatusIndicatorState,
  { label: string; colorKey: string }
> = {
  idle: { label: "Ready", colorKey: "gray" },
  thinking: { label: "Thinking...", colorKey: "amber" },
  streaming: { label: "Writing...", colorKey: "purple" },
  "tool-calling": { label: "Using tools...", colorKey: "blue" },
  error: { label: "Error", colorKey: "red" },
};

const colorMap: Record<string, { base: string; bright: string }> = {
  purple: { base: themeVars.accent, bright: "var(--arclo-accent-bright, rgb(167,139,250))" },
  amber: { base: "rgb(217,119,6)", bright: "rgb(251,191,36)" },
  blue: { base: "rgb(37,99,235)", bright: "rgb(96,165,250)" },
  red: { base: "rgb(239,68,68)", bright: "rgb(252,129,129)" },
  gray: { base: "rgb(156,163,175)", bright: "rgb(209,213,219)" },
};

export const StatusIndicator = forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  (
    {
      state = "idle",
      label,
      icon,
      color,
      animation = "sweep",
      className,
      ...props
    },
    ref,
  ) => {
    const id = useId().replace(/:/g, "");
    const defaults = stateDefaults[state];
    const resolvedColor = color ?? defaults.colorKey;
    const colors = colorMap[resolvedColor] ?? colorMap.gray;
    const displayLabel = label ?? defaults.label;
    const isActive = state !== "idle" && state !== "error";

    return (
      <span
        ref={ref}
        data-state={state}
        className={cn(
          "arclo-status-indicator inline-flex items-center gap-1.5 text-sm font-medium",
          className,
        )}
        style={{ color: colors.base }}
        {...props}
      >
        {/* Scoped keyframes */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
@keyframes arclo-sweep-${id} {
  0%, 100% { color: ${colors.base}; opacity: 0.5; }
  50% { color: ${colors.bright}; opacity: 1; }
}
@keyframes arclo-pulse-${id} {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes arclo-spin-${id} {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
          }}
        />

        {/* Icon */}
        <span className="shrink-0">
          {icon ?? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={
                isActive
                  ? { animation: `arclo-spin-${id} 3s linear infinite` }
                  : undefined
              }
            >
              <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6L12 2z" />
            </svg>
          )}
        </span>

        {/* Label */}
        {isActive && animation === "sweep" ? (
          <span aria-label={displayLabel}>
            {displayLabel.split("").map((char, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  animation: `arclo-sweep-${id} 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        ) : (
          <span
            style={
              isActive && animation === "pulse"
                ? {
                    animation: `arclo-pulse-${id} 1.5s ease-in-out infinite`,
                  }
                : undefined
            }
          >
            {displayLabel}
          </span>
        )}
      </span>
    );
  },
);
StatusIndicator.displayName = "StatusIndicator";
