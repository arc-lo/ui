import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { themeVars } from "../lib/theme";
import type { VideoGenState } from "../lib/types";

/* ─── Context ─────────────────────────────────────────────────────── */

interface VideoGenContextValue {
  state: VideoGenState;
  src: string | null;
  poster: string | null;
  progress: number | undefined;
  aspectRatio: string;
  duration: number | null;
  prompt: string | undefined;
  onRetry: (() => void) | undefined;
  onDownload: (() => void) | undefined;
  onPlay: (() => void) | undefined;
}

const VideoGenContext = createContext<VideoGenContextValue | null>(null);

function useVideoGenContext() {
  const ctx = useContext(VideoGenContext);
  if (!ctx) {
    throw new Error(
      "useVideoGenContext must be used within <VideoGen.Root>",
    );
  }
  return ctx;
}

/* ─── Root ────────────────────────────────────────────────────────── */

export interface VideoGenRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  state: VideoGenState;
  src?: string | null;
  poster?: string | null;
  progress?: number;
  aspectRatio?: string;
  duration?: number | null;
  prompt?: string;
  onRetry?: () => void;
  onDownload?: () => void;
  onPlay?: () => void;
  children?: ReactNode;
}

export const Root = forwardRef<HTMLDivElement, VideoGenRootProps>(
  (
    {
      state,
      src = null,
      poster = null,
      progress,
      aspectRatio = "16/9",
      duration = null,
      prompt,
      onRetry,
      onDownload,
      onPlay,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const ctx: VideoGenContextValue = {
      state,
      src,
      poster,
      progress,
      aspectRatio,
      duration,
      prompt,
      onRetry,
      onDownload,
      onPlay,
    };

    return (
      <VideoGenContext.Provider value={ctx}>
        <div
          ref={ref}
          data-state={state}
          className={cn("arclo-video-gen relative overflow-hidden", className)}
          style={{
            aspectRatio,
            borderRadius: themeVars.radius,
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      </VideoGenContext.Provider>
    );
  },
);
Root.displayName = "VideoGen.Root";

/* ─── Placeholder ────────────────────────────────────────────────── */

export interface VideoGenPlaceholderProps
  extends HTMLAttributes<HTMLDivElement> {}

export const Placeholder = forwardRef<HTMLDivElement, VideoGenPlaceholderProps>(
  ({ className, ...props }, ref) => {
    const { state, poster } = useVideoGenContext();
    const id = useId().replace(/:/g, "");

    const visible =
      (state === "idle" || state === "queued" || state === "processing") &&
      !poster;

    if (!visible) return null;

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Preparing video"
        className={cn(
          "arclo-video-gen-placeholder absolute inset-0 flex items-center justify-center",
          className,
        )}
        style={{ backgroundColor: themeVars.surfaceSecondary }}
        {...props}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
@keyframes arclo-vg-shimmer-${id} {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${themeVars.border} 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation: `arclo-vg-shimmer-${id} 2s ease-in-out infinite`,
            opacity: 0.5,
          }}
        />
        {/* Clapperboard icon */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: themeVars.textMuted, position: "relative", zIndex: 1 }}
        >
          <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
          <path d="M4 11h16" />
          <path d="M7 5l2 6" />
          <path d="M11 5l2 6" />
          <path d="M15 5l2 6" />
        </svg>
      </div>
    );
  },
);
Placeholder.displayName = "VideoGen.Placeholder";

/* ─── Thumbnail ──────────────────────────────────────────────────── */

export interface VideoGenThumbnailProps
  extends HTMLAttributes<HTMLImageElement> {}

export const Thumbnail = forwardRef<HTMLImageElement, VideoGenThumbnailProps>(
  ({ className, style: styleProp, ...props }, ref) => {
    const { state, poster } = useVideoGenContext();

    const visible =
      poster &&
      (state === "processing" || state === "rendering" || state === "done");

    if (!visible) return null;

    return (
      <img
        ref={ref}
        src={poster}
        alt="Video thumbnail"
        className={cn(
          "arclo-video-gen-thumbnail absolute inset-0 h-full w-full object-cover",
          className,
        )}
        style={{
          borderRadius: themeVars.radius,
          ...styleProp,
        }}
        {...props}
      />
    );
  },
);
Thumbnail.displayName = "VideoGen.Thumbnail";

/* ─── Player ─────────────────────────────────────────────────────── */

export interface VideoGenPlayerProps
  extends HTMLAttributes<HTMLVideoElement> {
  /** Additional props passed to the <video> element */
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export const Player = forwardRef<HTMLVideoElement, VideoGenPlayerProps>(
  ({ className, style: styleProp, autoPlay, loop, muted, ...props }, ref) => {
    const { state, src, poster } = useVideoGenContext();

    if (state !== "done" || !src) return null;

    return (
      <video
        ref={ref}
        src={src}
        poster={poster ?? undefined}
        controls
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        className={cn(
          "arclo-video-gen-player absolute inset-0 h-full w-full object-contain",
          className,
        )}
        style={{
          borderRadius: themeVars.radius,
          backgroundColor: themeVars.surface,
          ...styleProp,
        }}
        {...props}
      />
    );
  },
);
Player.displayName = "VideoGen.Player";

/* ─── Progress ───────────────────────────────────────────────────── */

export interface VideoGenProgressProps
  extends HTMLAttributes<HTMLDivElement> {}

export const Progress = forwardRef<HTMLDivElement, VideoGenProgressProps>(
  ({ className, ...props }, ref) => {
    const { state, progress } = useVideoGenContext();
    const id = useId().replace(/:/g, "");

    const visible =
      state === "queued" || state === "processing" || state === "rendering";

    if (!visible) return null;

    const isDeterminate = progress != null;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={isDeterminate ? progress : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "arclo-video-gen-progress absolute bottom-0 left-0 right-0 h-1",
          className,
        )}
        style={{ backgroundColor: `color-mix(in srgb, ${themeVars.accent} 20%, transparent)` }}
        {...props}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
@keyframes arclo-vg-indeterminate-${id} {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}`,
          }}
        />
        <div
          className="h-full"
          style={
            isDeterminate
              ? {
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                  backgroundColor: themeVars.accent,
                  transition: "width 0.3s ease",
                }
              : {
                  width: "25%",
                  backgroundColor: themeVars.accent,
                  animation: `arclo-vg-indeterminate-${id} 1.5s ease-in-out infinite`,
                }
          }
        />
      </div>
    );
  },
);
Progress.displayName = "VideoGen.Progress";

/* ─── StageLabel ─────────────────────────────────────────────────── */

export interface VideoGenStageLabelProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Override the auto-generated label */
  label?: string;
}

function getAutoLabel(state: VideoGenState, progress?: number): string {
  switch (state) {
    case "idle":
      return "";
    case "queued":
      return "Queued...";
    case "processing":
      return progress != null ? `Processing ${Math.round(progress)}%` : "Processing...";
    case "rendering":
      return progress != null ? `Rendering ${Math.round(progress)}%` : "Rendering...";
    case "done":
      return "Complete";
    case "error":
      return "Failed";
    default:
      return "";
  }
}

export const StageLabel = forwardRef<HTMLSpanElement, VideoGenStageLabelProps>(
  ({ label, className, ...props }, ref) => {
    const { state, progress } = useVideoGenContext();
    const id = useId().replace(/:/g, "");

    const displayLabel = label ?? getAutoLabel(state, progress);
    const isActive =
      state === "queued" || state === "processing" || state === "rendering";

    if (!displayLabel) return null;

    const accentColor = themeVars.accent;
    const brightColor = themeVars.accentBright;

    return (
      <span
        ref={ref}
        data-state={state}
        className={cn(
          "arclo-video-gen-stage-label text-sm font-medium",
          className,
        )}
        style={{ color: accentColor }}
        {...props}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
@keyframes arclo-vg-sweep-${id} {
  0%, 100% { color: ${accentColor}; opacity: 0.5; }
  50% { color: ${brightColor}; opacity: 1; }
}`,
          }}
        />
        {isActive ? (
          <span aria-label={displayLabel}>
            {displayLabel.split("").map((char, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  animation: `arclo-vg-sweep-${id} 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        ) : (
          <span>{displayLabel}</span>
        )}
      </span>
    );
  },
);
StageLabel.displayName = "VideoGen.StageLabel";

/* ─── ErrorFallback ──────────────────────────────────────────────── */

export interface VideoGenErrorFallbackProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Custom error message */
  message?: string;
}

export const ErrorFallback = forwardRef<HTMLDivElement, VideoGenErrorFallbackProps>(
  ({ message = "Video generation failed.", className, ...props }, ref) => {
    const { state, onRetry } = useVideoGenContext();

    if (state !== "error") return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "arclo-video-gen-error absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-sm",
          className,
        )}
        style={{
          backgroundColor: themeVars.errorSurface,
          color: themeVars.error,
          borderRadius: themeVars.radius,
        }}
        {...props}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 underline cursor-pointer"
            style={{ color: themeVars.error }}
          >
            Try again
          </button>
        )}
      </div>
    );
  },
);
ErrorFallback.displayName = "VideoGen.ErrorFallback";

/* ─── Toolbar ────────────────────────────────────────────────────── */

export interface VideoGenToolbarProps
  extends HTMLAttributes<HTMLDivElement> {}

export const Toolbar = forwardRef<HTMLDivElement, VideoGenToolbarProps>(
  ({ children, className, ...props }, ref) => {
    const { state } = useVideoGenContext();

    if (state !== "done") return null;

    return (
      <div
        ref={ref}
        className={cn(
          "arclo-video-gen-toolbar absolute bottom-4 right-4 flex items-center gap-2 animate-in fade-in duration-150",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Toolbar.displayName = "VideoGen.Toolbar";

/* ─── PlayButton ─────────────────────────────────────────────────── */

export interface VideoGenPlayButtonProps
  extends HTMLAttributes<HTMLButtonElement> {}

export const PlayButton = forwardRef<HTMLButtonElement, VideoGenPlayButtonProps>(
  ({ className, children, ...props }, ref) => {
    const { state, onPlay, src } = useVideoGenContext();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const visible = state === "done" && src;

    if (!visible) return null;

    const handleClick = () => {
      if (onPlay) {
        onPlay();
      } else {
        // Try to find and play the video element within the root
        const root = (ref as React.RefObject<HTMLElement>)?.current?.closest(
          ".arclo-video-gen",
        );
        const video = root?.querySelector("video");
        if (video) {
          video.play();
        }
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Play video"
        onClick={handleClick}
        className={cn(
          "arclo-video-gen-play-button absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110",
          className,
        )}
        style={{
          backgroundColor: themeVars.accent,
          color: themeVars.accentFg,
        }}
        {...props}
      >
        {children ?? (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    );
  },
);
PlayButton.displayName = "VideoGen.PlayButton";
