import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { themeVars } from "../lib/theme";

/* ─── Context ─────────────────────────────────────────────────────── */

type FeedbackValue = "up" | "down" | null;

interface FeedbackBarContextValue {
  feedback: FeedbackValue;
  setFeedback: (v: FeedbackValue) => void;
  copied: boolean;
  setCopied: (v: boolean) => void;
}

const FeedbackBarContext = createContext<FeedbackBarContextValue | null>(null);

function useFeedbackBarContext() {
  const ctx = useContext(FeedbackBarContext);
  if (!ctx) {
    throw new Error("FeedbackBar parts must be used within <FeedbackBar.Root>");
  }
  return ctx;
}

/* ─── Root ────────────────────────────────────────────────────────── */

export interface FeedbackBarRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Called when thumbs feedback changes */
  onFeedback?: (value: FeedbackValue) => void;
  children?: ReactNode;
}

export const Root = forwardRef<HTMLDivElement, FeedbackBarRootProps>(
  ({ onFeedback, children, className, ...props }, ref) => {
    const [feedback, setFeedbackState] = useState<FeedbackValue>(null);
    const [copied, setCopied] = useState(false);

    const setFeedback = useCallback(
      (v: FeedbackValue) => {
        setFeedbackState(v);
        onFeedback?.(v);
      },
      [onFeedback],
    );

    return (
      <FeedbackBarContext.Provider
        value={{ feedback, setFeedback, copied, setCopied }}
      >
        <div
          ref={ref}
          role="toolbar"
          aria-label="Response actions"
          className={cn(
            "arclo-feedback-bar flex items-center gap-1",
            className,
          )}
          {...props}
        >
          {children ?? (
            <>
              <ThumbsUp />
              <ThumbsDown />
              <Copy />
            </>
          )}
        </div>
      </FeedbackBarContext.Provider>
    );
  },
);
Root.displayName = "FeedbackBar.Root";

/* ─── Shared button style ─────────────────────────────────────────── */

const btnClass =
  "arclo-feedback-btn inline-flex items-center justify-center rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer";

/* ─── ThumbsUp ────────────────────────────────────────────────────── */

export interface FeedbackBarThumbsUpProps
  extends HTMLAttributes<HTMLButtonElement> {}

export const ThumbsUp = forwardRef<HTMLButtonElement, FeedbackBarThumbsUpProps>(
  ({ className, ...props }, ref) => {
    const { feedback, setFeedback } = useFeedbackBarContext();
    const active = feedback === "up";

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Good response"
        aria-pressed={active}
        onClick={() => setFeedback(active ? null : "up")}
        style={active ? { color: themeVars.accent } : undefined}
        className={cn(btnClass, className)}
        {...props}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10v12" />
          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
      </button>
    );
  },
);
ThumbsUp.displayName = "FeedbackBar.ThumbsUp";

/* ─── ThumbsDown ──────────────────────────────────────────────────── */

export interface FeedbackBarThumbsDownProps
  extends HTMLAttributes<HTMLButtonElement> {}

export const ThumbsDown = forwardRef<
  HTMLButtonElement,
  FeedbackBarThumbsDownProps
>(({ className, ...props }, ref) => {
  const { feedback, setFeedback } = useFeedbackBarContext();
  const active = feedback === "down";

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Bad response"
      aria-pressed={active}
      onClick={() => setFeedback(active ? null : "down")}
      className={cn(btnClass, active && "text-red-500", className)}
      {...props}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 14V2" />
        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
      </svg>
    </button>
  );
});
ThumbsDown.displayName = "FeedbackBar.ThumbsDown";

/* ─── Copy ────────────────────────────────────────────────────────── */

export interface FeedbackBarCopyProps
  extends HTMLAttributes<HTMLButtonElement> {
  /** Text to copy. If not provided, copies the closest [data-arclo-copyable] ancestor's textContent */
  text?: string;
}

export const Copy = forwardRef<HTMLButtonElement, FeedbackBarCopyProps>(
  ({ text, className, ...props }, ref) => {
    const { copied, setCopied } = useFeedbackBarContext();

    const handleCopy = useCallback(async () => {
      const content =
        text ??
        (ref as React.RefObject<HTMLButtonElement>)?.current
          ?.closest("[data-arclo-copyable]")
          ?.textContent ??
        "";
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, [text, ref, setCopied]);

    return (
      <button
        ref={ref}
        type="button"
        aria-label={copied ? "Copied" : "Copy"}
        onClick={handleCopy}
        className={cn(btnClass, copied && "text-emerald-600", className)}
        {...props}
      >
        {copied ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </button>
    );
  },
);
Copy.displayName = "FeedbackBar.Copy";

/* ─── Regenerate ──────────────────────────────────────────────────── */

export interface FeedbackBarRegenerateProps
  extends HTMLAttributes<HTMLButtonElement> {
  onRegenerate?: () => void;
}

export const Regenerate = forwardRef<
  HTMLButtonElement,
  FeedbackBarRegenerateProps
>(({ onRegenerate, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Regenerate response"
      onClick={onRegenerate}
      className={cn(btnClass, className)}
      {...props}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
    </button>
  );
});
Regenerate.displayName = "FeedbackBar.Regenerate";
