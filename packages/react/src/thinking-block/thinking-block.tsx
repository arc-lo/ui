import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { themeVars } from "../lib/theme";

/* ─── Types ───────────────────────────────────────────────────────── */

export type ThinkingState = "thinking" | "done" | "error";

/* ─── Context ─────────────────────────────────────────────────────── */

interface ThinkingBlockContextValue {
  state: ThinkingState;
  isOpen: boolean;
  toggle: () => void;
  duration: number | null;
}

const ThinkingBlockContext = createContext<ThinkingBlockContextValue | null>(
  null,
);

function useThinkingBlockContext() {
  const ctx = useContext(ThinkingBlockContext);
  if (!ctx) {
    throw new Error(
      "ThinkingBlock parts must be used within <ThinkingBlock.Root>",
    );
  }
  return ctx;
}

/* ─── Root ────────────────────────────────────────────────────────── */

export interface ThinkingBlockRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Current thinking state */
  state?: ThinkingState;
  /** Whether the block starts expanded. Default: true */
  defaultOpen?: boolean;
  /** Auto-collapse when state changes to "done". Default: true */
  collapseOnDone?: boolean;
  /** Thinking duration in seconds (shown in header) */
  duration?: number | null;
  children?: ReactNode;
}

export const Root = forwardRef<HTMLDivElement, ThinkingBlockRootProps>(
  (
    {
      state = "thinking",
      defaultOpen = true,
      collapseOnDone = true,
      duration = null,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    useEffect(() => {
      if (state === "done" && collapseOnDone) {
        const timer = setTimeout(() => setIsOpen(false), 500);
        return () => clearTimeout(timer);
      }
    }, [state, collapseOnDone]);

    const toggle = useCallback(() => setIsOpen((o) => !o), []);

    return (
      <ThinkingBlockContext.Provider value={{ state, isOpen, toggle, duration }}>
        <div
          ref={ref}
          data-state={state}
          data-open={isOpen}
          className={cn(
            "arclo-thinking-block rounded-xl border border-gray-200 overflow-hidden transition-all",
            state === "thinking" && "border-[var(--arclo-accent,#6C5CE7)]/20 bg-[var(--arclo-accent,#6C5CE7)]/[0.02]",
            state === "done" && "border-gray-200 bg-white",
            state === "error" && "border-red-200 bg-red-50/30",
            className,
          )}
          {...props}
        >
          {children ?? (
            <>
              <Trigger />
              <Content />
            </>
          )}
        </div>
      </ThinkingBlockContext.Provider>
    );
  },
);
Root.displayName = "ThinkingBlock.Root";

/* ─── Trigger (clickable header) ──────────────────────────────────── */

export interface ThinkingBlockTriggerProps
  extends HTMLAttributes<HTMLButtonElement> {
  /** Custom label. Default: auto from state */
  label?: string;
}

export const Trigger = forwardRef<HTMLButtonElement, ThinkingBlockTriggerProps>(
  ({ label, className, children, ...props }, ref) => {
    const { state, isOpen, toggle, duration } = useThinkingBlockContext();

    const defaultLabel =
      state === "thinking"
        ? "Thinking..."
        : state === "error"
          ? "Thinking failed"
          : duration != null
            ? `Thought for ${duration}s`
            : "Thought process";

    return (
      <button
        ref={ref}
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className={cn(
          "arclo-thinking-trigger flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition-colors cursor-pointer hover:bg-gray-50/50",
          className,
        )}
        {...props}
      >
        {/* Spinner / checkmark / error icon */}
        {state === "thinking" && (
          <svg
            className="h-4 w-4 shrink-0 animate-spin"
            style={{ color: themeVars.accent }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="60"
              strokeDashoffset="20"
              strokeLinecap="round"
            />
          </svg>
        )}
        {state === "done" && (
          <svg
            className="h-4 w-4 shrink-0"
            style={{ color: themeVars.accent }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        )}
        {state === "error" && (
          <svg
            className="h-4 w-4 shrink-0 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6M9 9l6 6" />
          </svg>
        )}

        <span
          className={cn(
            "flex-1 font-medium",
            state === "thinking" && "text-[var(--arclo-accent,#6C5CE7)]",
            state === "done" && "text-gray-500",
            state === "error" && "text-red-600",
          )}
        >
          {children ?? label ?? defaultLabel}
        </span>

        {/* Chevron */}
        <svg
          className={cn(
            "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    );
  },
);
Trigger.displayName = "ThinkingBlock.Trigger";

/* ─── Content ─────────────────────────────────────────────────────── */

export interface ThinkingBlockContentProps
  extends HTMLAttributes<HTMLDivElement> {}

export const Content = forwardRef<HTMLDivElement, ThinkingBlockContentProps>(
  ({ children, className, ...props }, ref) => {
    const { isOpen, state } = useThinkingBlockContext();

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "arclo-thinking-content border-t border-gray-100 px-4 py-3",
          className,
        )}
        {...props}
      >
        {children ?? (
          <p
            className={cn(
              "text-sm leading-relaxed",
              state === "thinking"
                ? "text-gray-600 italic"
                : "text-gray-500",
            )}
          >
            {state === "thinking"
              ? "Analyzing the request..."
              : "No content provided."}
          </p>
        )}
      </div>
    );
  },
);
Content.displayName = "ThinkingBlock.Content";
