import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

/* ─── Types ───────────────────────────────────────────────────────── */

export type FileAttachmentType =
  | "image"
  | "pdf"
  | "code"
  | "text"
  | "csv"
  | "other";

/* ─── Icons ──────────────────────────────────────────────────────── */

function FileIcon({
  type,
  className,
}: {
  type: FileAttachmentType;
  className?: string;
}) {
  const base = cn("shrink-0", className);

  if (type === "image") {
    return (
      <svg
        className={base}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    );
  }

  if (type === "pdf") {
    return (
      <svg
        className={base}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M9 15v-1h2a1 1 0 0 1 0 2H9" />
      </svg>
    );
  }

  if (type === "code") {
    return (
      <svg
        className={base}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="m10 13-2 2 2 2" />
        <path d="m14 17 2-2-2-2" />
      </svg>
    );
  }

  if (type === "csv") {
    return (
      <svg
        className={base}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M8 15h8" />
        <path d="M8 11h8" />
        <path d="M12 11v8" />
      </svg>
    );
  }

  if (type === "text") {
    return (
      <svg
        className={base}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    );
  }

  // "other"
  return (
    <svg
      className={base}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

/* ─── FileAttachment ─────────────────────────────────────────────── */

export interface FileAttachmentProps extends HTMLAttributes<HTMLDivElement> {
  /** File name */
  name: string;
  /** Human-readable file size, e.g. "2.4 MB" */
  size?: string;
  /** File type — determines the icon */
  type?: FileAttachmentType;
  /** Image URL for thumbnail preview (card variant) */
  preview?: string;
  /** Upload progress 0-100 — shows progress bar when present */
  progress?: number;
  /** Called when remove button is clicked */
  onRemove?: () => void;
  /** Display variant */
  variant?: "chip" | "card";
}

export const FileAttachment = forwardRef<HTMLDivElement, FileAttachmentProps>(
  (
    {
      name,
      size,
      type = "other",
      preview,
      progress,
      onRemove,
      variant = "chip",
      className,
      ...props
    },
    ref,
  ) => {
    if (variant === "card") {
      return (
        <div
          ref={ref}
          className={cn(
            "arclo-file-attachment-card group relative inline-flex w-48 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white",
            className,
          )}
          {...props}
        >
          {/* Preview area */}
          <div className="relative flex h-28 items-center justify-center bg-gray-50">
            {preview ? (
              <img
                src={preview}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <FileIcon type={type} className="h-10 w-10 text-gray-300" />
            )}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${name}`}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100 cursor-pointer"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="m18 6-12 12M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-0.5 px-3 py-2">
            <span className="truncate text-xs font-medium text-gray-700">
              {name}
            </span>
            {size && (
              <span className="text-[10px] text-gray-400">{size}</span>
            )}
          </div>

          {/* Progress bar */}
          {progress != null && (
            <div className="h-1 w-full bg-gray-100">
              <div
                className="h-full rounded-r-full bg-[#6C5CE7] transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
        </div>
      );
    }

    // chip variant (default)
    return (
      <div
        ref={ref}
        className={cn(
          "arclo-file-attachment-chip group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2",
          className,
        )}
        {...props}
      >
        <FileIcon type={type} className="h-4 w-4 text-gray-400" />

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-medium text-gray-700">
            {name}
          </span>
          {(size || progress != null) && (
            <div className="flex items-center gap-2">
              {size && (
                <span className="text-[10px] text-gray-400">{size}</span>
              )}
              {progress != null && (
                <div className="h-1 w-16 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#6C5CE7] transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(0, progress))}%`,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${name}`}
            className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-500 cursor-pointer"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
FileAttachment.displayName = "FileAttachment";
