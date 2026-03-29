"use client";

import {
  forwardRef,
  useRef,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { cn } from "../lib/cn";
import { themeVars } from "../lib/theme";

/* ─── TopicCard ───────────────────────────────────────────────────── */

export interface TopicCardProps extends Omit<HTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Card title / prompt summary */
  title: string;
  /** Optional description or subtitle (hidden in compact mode) */
  description?: string;
  /** Optional icon element */
  icon?: ReactNode;
  /** Called when the card is clicked */
  onSelect?: (title: string) => void;
  /** Visual variant — set automatically by SuggestTopics, but can be overridden */
  variant?: "card" | "compact";
}

export const TopicCard = forwardRef<HTMLButtonElement, TopicCardProps>(
  ({ title, description, icon, onSelect, variant = "card", className, ...props }, ref) => {
    if (variant === "compact") {
      return (
        <button
          ref={ref}
          type="button"
          onClick={() => onSelect?.(title)}
          className={cn(
            "arclo-topic-card inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-left transition-all cursor-pointer",
            "hover:shadow-sm",
            className,
          )}
          style={{
            backgroundColor: themeVars.surface,
            borderColor: themeVars.border,
          }}
          {...props}
        >
          {icon && (
            <span className="shrink-0 text-sm">{icon}</span>
          )}
          <span
            className="text-xs font-medium whitespace-nowrap"
            style={{ color: themeVars.text }}
          >
            {title}
          </span>
        </button>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onSelect?.(title)}
        className={cn(
          "arclo-topic-card group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer",
          "hover:scale-[1.01] hover:shadow-sm",
          className,
        )}
        style={{
          backgroundColor: themeVars.surface,
          borderColor: themeVars.border,
        }}
        {...props}
      >
        {icon && (
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
            style={{
              backgroundColor: `color-mix(in srgb, ${themeVars.accent} 10%, transparent)`,
              color: themeVars.accent,
            }}
          >
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-medium leading-snug"
            style={{ color: themeVars.text }}
          >
            {title}
          </p>
          {description && (
            <p
              className="mt-1 text-xs leading-relaxed"
              style={{ color: themeVars.textMuted }}
            >
              {description}
            </p>
          )}
        </div>
        <svg
          className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: themeVars.textMuted }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    );
  },
);
TopicCard.displayName = "TopicCard";

/* ─── SuggestTopics ───────────────────────────────────────────────── */

export interface SuggestTopicsProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout variant. "grid" for cards, "compact" for horizontal scroll pills. Default: "grid" */
  variant?: "grid" | "compact";
  /** Number of columns (grid variant only). Default: 2 */
  columns?: 1 | 2 | 3;
  children: ReactNode;
}

export const SuggestTopics = forwardRef<HTMLDivElement, SuggestTopicsProps>(
  ({ variant = "grid", columns = 2, children, className, ...props }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const hasDragged = useRef(false);

    const onMouseDown = useCallback((e: ReactMouseEvent) => {
      const el = scrollRef.current;
      if (!el) return;
      isDragging.current = true;
      hasDragged.current = false;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    }, []);

    const onMouseMove = useCallback((e: ReactMouseEvent) => {
      if (!isDragging.current) return;
      const el = scrollRef.current;
      if (!el) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      if (Math.abs(walk) > 3) hasDragged.current = true;
      el.scrollLeft = scrollLeft.current - walk;
    }, []);

    const onMouseUp = useCallback(() => {
      isDragging.current = false;
      const el = scrollRef.current;
      if (el) {
        el.style.cursor = "grab";
        el.style.userSelect = "";
      }
    }, []);

    const onClickCapture = useCallback((e: ReactMouseEvent) => {
      // Prevent click on children if we were dragging
      if (hasDragged.current) {
        e.stopPropagation();
        e.preventDefault();
        hasDragged.current = false;
      }
    }, []);

    if (variant === "compact") {
      return (
        <div
          ref={(node) => {
            (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className={cn(
            "arclo-suggest-topics",
            className,
          )}
          style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            cursor: "grab",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClickCapture={onClickCapture}
          {...props}
        >
          {children}
          <style dangerouslySetInnerHTML={{ __html: `.arclo-suggest-topics::-webkit-scrollbar { display: none; }` }} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "arclo-suggest-topics grid gap-3",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SuggestTopics.displayName = "SuggestTopics";
