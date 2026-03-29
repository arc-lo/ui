"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn";

/* ─── Types ───────────────────────────────────────────────────────── */

export interface ModelOption {
  /** Unique model identifier */
  id: string;
  /** Display name */
  name: string;
  /** Optional description shown in dropdown */
  description?: string;
  /** Optional badge text (e.g. "New", "Fast") */
  badge?: string;
}

/* ─── Component ───────────────────────────────────────────────────── */

export interface ModelSelectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Available models */
  models: ModelOption[];
  /** Currently selected model id */
  value: string;
  /** Called when user selects a model */
  onChange: (modelId: string) => void;
}

export const ModelSelector = forwardRef<HTMLDivElement, ModelSelectorProps>(
  ({ models, value, onChange, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selected = models.find((m) => m.id === value);

    // Close on outside click
    useEffect(() => {
      if (!open) return;
      function handleClick(e: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // Close on Escape
    useEffect(() => {
      if (!open) return;
      function handleKey(e: KeyboardEvent) {
        if (e.key === "Escape") setOpen(false);
      }
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }, [open]);

    return (
      <div
        ref={ref}
        className={cn("arclo-model-selector relative inline-block", className)}
        {...props}
      >
        <div ref={containerRef}>
          {/* Trigger */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="listbox"
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-gray-400"
            >
              <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6L12 2z" />
            </svg>
            <span>{selected?.name ?? value}</span>
            {selected?.badge && (
              <span className="rounded-full bg-[#6C5CE7]/10 px-2 py-0.5 text-[10px] font-semibold text-[#6C5CE7]">
                {selected.badge}
              </span>
            )}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "shrink-0 text-gray-400 transition-transform",
                open && "rotate-180",
              )}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {open && (
            <div
              role="listbox"
              className="absolute left-0 z-50 mt-1 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
            >
              {models.map((model) => {
                const isSelected = model.id === value;
                return (
                  <button
                    key={model.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(model.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "cursor-pointer flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50",
                      isSelected && "bg-gray-50",
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">
                          {model.name}
                        </span>
                        {model.badge && (
                          <span className="rounded-full bg-[#6C5CE7]/10 px-2 py-0.5 text-[10px] font-semibold text-[#6C5CE7]">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      {model.description && (
                        <p className="mt-0.5 text-xs text-gray-400 truncate">
                          {model.description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 shrink-0 text-[#6C5CE7]"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  },
);
ModelSelector.displayName = "ModelSelector";
