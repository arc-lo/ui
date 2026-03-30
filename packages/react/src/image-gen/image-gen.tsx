import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { themeVars } from "../lib/theme";
import type { ImageGenState } from "../lib/types";

/* ─── Context ─────────────────────────────────────────────────────── */

interface ImageGenContextValue {
  state: ImageGenState;
  src?: string | null;
  alt?: string;
  aspectRatio: string;
  prompt?: string;
  onRetry?: () => void;
  onDownload?: () => void;
  blurReveal: boolean;
}

const ImageGenContext = createContext<ImageGenContextValue | null>(null);

function useImageGenContext() {
  const ctx = useContext(ImageGenContext);
  if (!ctx) {
    throw new Error(
      "useImageGenContext must be used within <ImageGen.Root>",
    );
  }
  return ctx;
}

/* ─── Root ────────────────────────────────────────────────────────── */

export interface ImageGenRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  state: ImageGenState;
  src?: string | null;
  alt?: string;
  aspectRatio?: string;
  prompt?: string;
  onRetry?: () => void;
  onDownload?: () => void;
  blurReveal?: boolean;
  children?: ReactNode;
}

export const Root = forwardRef<HTMLDivElement, ImageGenRootProps>(
  (
    {
      state,
      src,
      alt,
      aspectRatio = "1/1",
      prompt,
      onRetry,
      onDownload,
      blurReveal = true,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const ctx: ImageGenContextValue = {
      state,
      src,
      alt,
      aspectRatio,
      prompt,
      onRetry,
      onDownload,
      blurReveal,
    };

    return (
      <ImageGenContext.Provider value={ctx}>
        <div
          ref={ref}
          data-state={state}
          style={{ position: "relative" }}
          className={cn("arclo-image-gen", className)}
          {...props}
        >
          {children}
        </div>
      </ImageGenContext.Provider>
    );
  },
);
Root.displayName = "ImageGen.Root";

/* ─── Placeholder ────────────────────────────────────────────────── */

export interface ImageGenPlaceholderProps
  extends HTMLAttributes<HTMLDivElement> {}

export const Placeholder = forwardRef<HTMLDivElement, ImageGenPlaceholderProps>(
  ({ className, ...props }, ref) => {
    const { state, src, aspectRatio } = useImageGenContext();

    const visible =
      state === "idle" || state === "pending" || (state === "generating" && !src);

    if (!visible) return null;

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading image"
        style={{
          aspectRatio,
          backgroundColor: themeVars.surfaceSecondary,
          borderRadius: themeVars.radius,
          overflow: "hidden",
          position: "relative",
        }}
        className={cn("arclo-image-gen-placeholder", className)}
        {...props}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: `<style>
@keyframes arclo-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${themeVars.border} 50%, transparent 100%)`,
            animation: "arclo-shimmer 1.5s ease-in-out infinite",
          }}
        />
      </div>
    );
  },
);
Placeholder.displayName = "ImageGen.Placeholder";

/* ─── Preview ────────────────────────────────────────────────────── */

export interface ImageGenPreviewProps
  extends Omit<HTMLAttributes<HTMLImageElement>, "src" | "alt"> {}

export const Preview = forwardRef<HTMLImageElement, ImageGenPreviewProps>(
  ({ className, style, ...props }, ref) => {
    const { state, src, alt, aspectRatio, blurReveal } = useImageGenContext();

    if (!src) return null;

    const isDone = state === "done";
    const blurValue = blurReveal && !isDone ? "blur(20px)" : "blur(0)";

    return (
      <img
        ref={ref}
        src={src}
        alt={alt ?? ""}
        data-state={state}
        style={{
          aspectRatio,
          width: "100%",
          display: "block",
          borderRadius: themeVars.radius,
          objectFit: "cover",
          filter: blurValue,
          transition: "filter 0.6s ease-out",
          ...style,
        }}
        className={cn("arclo-image-gen-preview", className)}
        {...props}
      />
    );
  },
);
Preview.displayName = "ImageGen.Preview";

/* ─── Progress ───────────────────────────────────────────────────── */

export interface ImageGenProgressProps
  extends HTMLAttributes<HTMLDivElement> {
  progress?: number;
}

export const Progress = forwardRef<HTMLDivElement, ImageGenProgressProps>(
  ({ progress, className, ...props }, ref) => {
    const { state } = useImageGenContext();

    if (state !== "pending" && state !== "generating") return null;

    const isIndeterminate = progress === undefined;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : progress}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          backgroundColor: themeVars.surfaceSecondary,
          borderRadius: "0 0 3px 3px",
          overflow: "hidden",
        }}
        className={cn("arclo-image-gen-progress", className)}
        {...props}
      >
        {isIndeterminate ? (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: `<style>
@keyframes arclo-progress-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
</style>`,
              }}
            />
            <div
              style={{
                width: "40%",
                height: "100%",
                backgroundColor: themeVars.accent,
                animation: "arclo-progress-shimmer 1.2s ease-in-out infinite",
              }}
            />
          </>
        ) : (
          <div
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              height: "100%",
              backgroundColor: themeVars.accent,
              transition: "width 0.3s ease-out",
            }}
          />
        )}
      </div>
    );
  },
);
Progress.displayName = "ImageGen.Progress";

/* ─── Overlay ────────────────────────────────────────────────────── */

const stateLabels: Record<ImageGenState, string> = {
  idle: "Waiting",
  pending: "Preparing...",
  generating: "Generating...",
  done: "Done",
  error: "Error",
};

export interface ImageGenOverlayProps
  extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const Overlay = forwardRef<HTMLDivElement, ImageGenOverlayProps>(
  ({ label, className, ...props }, ref) => {
    const { state } = useImageGenContext();

    if (state !== "pending" && state !== "generating") return null;

    const displayLabel = label ?? stateLabels[state];

    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderRadius: themeVars.radius,
          color: "#ffffff",
        }}
        className={cn("arclo-image-gen-overlay", className)}
        {...props}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          style={{ animation: "spin 1s linear infinite" }}
        >
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="31.4 31.4"
            strokeLinecap="round"
          />
        </svg>
        {displayLabel && (
          <span style={{ fontSize: "14px", fontWeight: 500 }}>
            {displayLabel}
          </span>
        )}
      </div>
    );
  },
);
Overlay.displayName = "ImageGen.Overlay";

/* ─── ErrorFallback ──────────────────────────────────────────────── */

export interface ImageGenErrorFallbackProps
  extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const ErrorFallback = forwardRef<HTMLDivElement, ImageGenErrorFallbackProps>(
  ({ message = "Failed to generate image.", className, ...props }, ref) => {
    const { state, onRetry } = useImageGenContext();

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
          "arclo-image-gen-error rounded-lg border p-4 text-sm",
          className,
        )}
        {...props}
      >
        <p>{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{ color: themeVars.error }}
            className="mt-2 underline cursor-pointer"
          >
            Try again
          </button>
        )}
      </div>
    );
  },
);
ErrorFallback.displayName = "ImageGen.ErrorFallback";

/* ─── Toolbar ────────────────────────────────────────────────────── */

export interface ImageGenToolbarProps
  extends HTMLAttributes<HTMLDivElement> {}

export const Toolbar = forwardRef<HTMLDivElement, ImageGenToolbarProps>(
  ({ children, className, ...props }, ref) => {
    const { state } = useImageGenContext();

    if (state !== "done") return null;

    return (
      <div
        ref={ref}
        className={cn(
          "arclo-image-gen-toolbar mt-2 flex items-center gap-2 animate-in fade-in duration-150",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Toolbar.displayName = "ImageGen.Toolbar";

/* ─── Download ───────────────────────────────────────────────────── */

export interface ImageGenDownloadProps
  extends HTMLAttributes<HTMLButtonElement> {}

export const Download = forwardRef<HTMLButtonElement, ImageGenDownloadProps>(
  ({ children, className, ...props }, ref) => {
    const { onDownload } = useImageGenContext();

    return (
      <button
        ref={ref}
        type="button"
        onClick={onDownload}
        style={{
          backgroundColor: themeVars.accent,
          color: themeVars.accentFg,
          borderRadius: themeVars.radius,
        }}
        className={cn(
          "arclo-image-gen-download px-3 py-1.5 text-sm cursor-pointer",
          className,
        )}
        {...props}
      >
        {children ?? "Download"}
      </button>
    );
  },
);
Download.displayName = "ImageGen.Download";

/* ─── Retry ──────────────────────────────────────────────────────── */

export interface ImageGenRetryProps
  extends HTMLAttributes<HTMLButtonElement> {}

export const Retry = forwardRef<HTMLButtonElement, ImageGenRetryProps>(
  ({ children, className, ...props }, ref) => {
    const { onRetry } = useImageGenContext();

    return (
      <button
        ref={ref}
        type="button"
        onClick={onRetry}
        style={{
          borderColor: themeVars.border,
          color: themeVars.text,
          borderRadius: themeVars.radius,
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        className={cn(
          "arclo-image-gen-retry px-3 py-1.5 text-sm cursor-pointer",
          className,
        )}
        {...props}
      >
        {children ?? "Retry"}
      </button>
    );
  },
);
Retry.displayName = "ImageGen.Retry";
