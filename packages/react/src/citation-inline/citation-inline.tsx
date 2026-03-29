import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

/* ─── Citation ────────────────────────────────────────────────────── */

export interface CitationInlineProps extends HTMLAttributes<HTMLSpanElement> {
  /** Citation index number */
  index: number;
  /** Source URL */
  href?: string;
  /** Source title */
  sourceTitle?: string;
  /** Preview content shown on hover */
  preview?: ReactNode;
  /** Visual variant */
  variant?: "superscript" | "bracket" | "pill";
}

export const CitationInline = forwardRef<HTMLSpanElement, CitationInlineProps>(
  (
    {
      index,
      href,
      sourceTitle,
      preview,
      variant = "superscript",
      className,
      ...props
    },
    ref,
  ) => {
    const [showPreview, setShowPreview] = useState(false);

    const label = variant === "bracket" ? `[${index}]` : `${index}`;

    const Tag = href ? "a" : "span";
    const linkProps = href
      ? { href, target: "_blank" as const, rel: "noopener noreferrer" as const }
      : {};

    return (
      <span
        ref={ref}
        className={cn("arclo-citation relative inline-block", className)}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        {...props}
      >
        <Tag
          {...linkProps}
          className={cn(
            "arclo-citation-trigger transition-colors cursor-pointer",
            variant === "superscript" &&
              "align-super text-[0.65em] text-blue-600 hover:text-blue-800",
            variant === "bracket" &&
              "text-sm text-blue-600 hover:text-blue-800",
            variant === "pill" &&
              "inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[0.6rem] font-medium text-blue-700 hover:bg-blue-200",
          )}
          aria-label={sourceTitle ? `Source: ${sourceTitle}` : `Citation ${index}`}
        >
          {label}
        </Tag>

        {/* Hover preview */}
        {preview && showPreview && (
          <div
            role="tooltip"
            className="arclo-citation-preview absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-lg"
          >
            {sourceTitle && (
              <p className="mb-1 font-medium text-gray-900">{sourceTitle}</p>
            )}
            <div className="text-gray-600">{preview}</div>
            {href && (
              <p className="mt-2 truncate text-xs text-blue-500">{href}</p>
            )}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
          </div>
        )}
      </span>
    );
  },
);
CitationInline.displayName = "CitationInline";

/* ─── Citation Group ──────────────────────────────────────────────── */

export interface CitationGroupProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export const CitationGroup = forwardRef<HTMLSpanElement, CitationGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("arclo-citation-group inline-flex gap-0.5", className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);
CitationGroup.displayName = "CitationGroup";
