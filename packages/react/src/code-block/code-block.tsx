"use client";

import { forwardRef, useCallback, useState, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

/* ─── CodeBlock ──────────────────────────────────────────────────── */

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** The code string to display */
  code: string;
  /** Language label shown in the header */
  language?: string;
  /** Show line numbers. Default: false */
  showLineNumbers?: boolean;
  /** Max height before scroll. Default: "400px" */
  maxHeight?: string;
  /** Called when the copy button is clicked */
  onCopy?: () => void;
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language,
      showLineNumbers = false,
      maxHeight = "400px",
      onCopy,
      className,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        onCopy?.();
        setTimeout(() => setCopied(false), 2000);
      });
    }, [code, onCopy]);

    const lines = code.split("\n");

    return (
      <div
        ref={ref}
        className={cn(
          "arclo-code-block overflow-hidden rounded-xl border",
          className,
        )}
        style={{ backgroundColor: "#1e1e2e", borderColor: "#313244" }}
        {...props}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid #313244" }}>
          <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "#a6adc8" }}>
            {language ?? "code"}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] transition-colors cursor-pointer"
            style={{ color: "#a6adc8" }}
          >
            {copied ? (
              <>
                <svg
                  className="h-3.5 w-3.5 text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

        {/* Code area */}
        <div className="overflow-auto [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.700)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-700" style={{ maxHeight }}>
          <pre className="p-4 text-[13px] leading-relaxed">
            <code className="font-mono" style={{ color: "#cdd6f4" }}>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  {showLineNumbers && (
                    <span className="mr-4 inline-block w-8 shrink-0 select-none text-right" style={{ color: "#585b70" }}>
                      {i + 1}
                    </span>
                  )}
                  <span className="flex-1">{line || "\n"}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    );
  },
);
CodeBlock.displayName = "CodeBlock";
