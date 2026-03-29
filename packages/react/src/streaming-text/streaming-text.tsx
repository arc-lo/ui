import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { themeVars } from "../lib/theme";
import type { ChunkSize, StreamingState } from "../lib/types";
import {
  useStreamingText,
  type UseStreamingTextOptions,
} from "./use-streaming-text";

/* ─── Context ─────────────────────────────────────────────────────── */

interface StreamingTextContextValue {
  displayedText: string;
  fullText: string;
  state: StreamingState;
  interrupt: () => void;
  reset: () => void;
  skipAnimation: () => void;
}

const StreamingTextContext = createContext<StreamingTextContextValue | null>(
  null,
);

export function useStreamingTextContext() {
  const ctx = useContext(StreamingTextContext);
  if (!ctx) {
    throw new Error(
      "useStreamingTextContext must be used within <StreamingText.Root>",
    );
  }
  return ctx;
}

/* ─── Root ────────────────────────────────────────────────────────── */

export interface StreamingTextRootProps
  extends UseStreamingTextOptions,
    Omit<HTMLAttributes<HTMLDivElement>, "children" | "onError"> {
  children?: ReactNode;
}

export const Root = forwardRef<HTMLDivElement, StreamingTextRootProps>(
  (
    {
      stream,
      text,
      speed,
      chunkSize,
      onDone,
      onError,
      onInterrupt,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const ctx = useStreamingText({
      stream,
      text,
      speed,
      chunkSize,
      onDone,
      onError,
      onInterrupt,
    });

    return (
      <StreamingTextContext.Provider value={ctx}>
        <div
          ref={ref}
          data-state={ctx.state}
          className={cn("arclo-streaming-text", className)}
          {...props}
        >
          {children ?? (
            <>
              <Content />
              <Cursor />
            </>
          )}
        </div>
      </StreamingTextContext.Provider>
    );
  },
);
Root.displayName = "StreamingText.Root";

/* ─── Content ─────────────────────────────────────────────────────── */

export interface StreamingTextContentProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Custom render function for the text */
  render?: (text: string) => ReactNode;
}

export const Content = forwardRef<HTMLDivElement, StreamingTextContentProps>(
  ({ render, className, ...props }, ref) => {
    const { displayedText, state } = useStreamingTextContext();

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn("arclo-streaming-content whitespace-pre-wrap", className)}
        {...props}
      >
        {render ? render(displayedText) : displayedText}
      </div>
    );
  },
);
Content.displayName = "StreamingText.Content";

/* ─── Cursor ──────────────────────────────────────────────────────── */

export interface StreamingTextCursorProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Character to use as cursor. Default: "▋" */
  char?: string;
}

export const Cursor = forwardRef<HTMLSpanElement, StreamingTextCursorProps>(
  ({ char = "▋", className, ...props }, ref) => {
    const { state } = useStreamingTextContext();
    const visible = state === "streaming" || state === "pending";

    if (!visible) return null;

    return (
      <span
        ref={ref}
        aria-hidden
        style={{ color: themeVars.accent }}
        className={cn(
          "arclo-streaming-cursor inline-block animate-pulse",
          className,
        )}
        {...props}
      >
        {char}
      </span>
    );
  },
);
Cursor.displayName = "StreamingText.Cursor";

/* ─── Skeleton ────────────────────────────────────────────────────── */

export interface StreamingTextSkeletonProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Number of skeleton lines. Default: 3 */
  lines?: number;
}

export const Skeleton = forwardRef<HTMLDivElement, StreamingTextSkeletonProps>(
  ({ lines = 3, className, ...props }, ref) => {
    const { state } = useStreamingTextContext();

    if (state !== "pending") return null;

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn("arclo-streaming-skeleton space-y-2", className)}
        {...props}
      >
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 rounded bg-gray-200 animate-pulse",
              i === lines - 1 && "w-2/3",
            )}
          />
        ))}
      </div>
    );
  },
);
Skeleton.displayName = "StreamingText.Skeleton";

/* ─── Error ───────────────────────────────────────────────────────── */

export interface StreamingTextErrorProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Custom error message */
  message?: string;
  /** Show retry button */
  onRetry?: () => void;
}

export const ErrorFallback = forwardRef<HTMLDivElement, StreamingTextErrorProps>(
  ({ message = "Something went wrong.", onRetry, className, ...props }, ref) => {
    const { state } = useStreamingTextContext();

    if (state !== "error") return null;

    return (
      <div
        ref={ref}
        role="alert"
        style={{
          borderColor: themeVars.error,
          backgroundColor: themeVars.errorSurface,
          color: themeVars.error,
        }}
        className={cn(
          "arclo-streaming-error rounded-lg border p-4 text-sm",
          className,
        )}
        {...props}
      >
        <p>{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-red-600 underline hover:text-red-800 cursor-pointer"
          >
            Try again
          </button>
        )}
      </div>
    );
  },
);
ErrorFallback.displayName = "StreamingText.ErrorFallback";

/* ─── RateLimit ───────────────────────────────────────────────────── */

export interface StreamingTextRateLimitProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Retry delay in seconds */
  retryAfter?: number;
  message?: string;
}

export const RateLimit = forwardRef<HTMLDivElement, StreamingTextRateLimitProps>(
  (
    {
      retryAfter,
      message = "Rate limit reached. Please wait.",
      className,
      ...props
    },
    ref,
  ) => {
    const { state } = useStreamingTextContext();

    if (state !== "ratelimit") return null;

    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          "arclo-streaming-ratelimit rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800",
          className,
        )}
        {...props}
      >
        <p>{message}</p>
        {retryAfter != null && (
          <p className="mt-1 text-amber-600">
            Retry in {retryAfter}s
          </p>
        )}
      </div>
    );
  },
);
RateLimit.displayName = "StreamingText.RateLimit";

/* ─── Toolbar ─────────────────────────────────────────────────────── */

export interface StreamingTextToolbarProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Only show toolbar in these states. Default: ["done", "interrupted"] */
  showIn?: StreamingState[];
}

export const Toolbar = forwardRef<HTMLDivElement, StreamingTextToolbarProps>(
  ({ showIn = ["done", "interrupted"], children, className, ...props }, ref) => {
    const { state } = useStreamingTextContext();

    if (!showIn.includes(state)) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "arclo-streaming-toolbar mt-2 flex items-center gap-2 animate-in fade-in duration-150",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Toolbar.displayName = "StreamingText.Toolbar";

/* ─── Stop Button ─────────────────────────────────────────────────── */

export interface StreamingTextStopProps
  extends HTMLAttributes<HTMLButtonElement> {}

export const Stop = forwardRef<HTMLButtonElement, StreamingTextStopProps>(
  ({ children, className, ...props }, ref) => {
    const { state, interrupt } = useStreamingTextContext();

    if (state !== "streaming") return null;

    return (
      <button
        ref={ref}
        type="button"
        onClick={interrupt}
        className={cn(
          "arclo-streaming-stop rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 cursor-pointer",
          className,
        )}
        {...props}
      >
        {children ?? "Stop generating"}
      </button>
    );
  },
);
Stop.displayName = "StreamingText.Stop";
