"use client";

import { useState, type ReactNode } from "react";
import { highlight } from "sugar-high";

export function DemoWrapper({
  title,
  code,
  children,
}: {
  title: string;
  code?: string;
  children: ReactNode;
}) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div
      className="not-prose my-6 rounded-xl border"
      style={{ borderColor: "var(--docs-card-border)" }}
    >
      <div
        className="flex items-center justify-between rounded-t-xl px-4 py-2 border-b"
        style={{
          backgroundColor: "var(--docs-demo-header-bg)",
          borderColor: "var(--docs-card-border)",
          color: "var(--docs-muted)",
        }}
      >
        <span className="text-xs font-medium">{title}</span>
        {code && (
          <button
            type="button"
            onClick={() => setShowCode((s) => !s)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer hover:opacity-80"
            aria-label={showCode ? "Hide code" : "Show code"}
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
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span>{showCode ? "Hide" : "Code"}</span>
          </button>
        )}
      </div>
      <div className="p-6">{children}</div>
      {code && showCode && (
        <div
          className="border-t rounded-b-xl overflow-x-auto"
          style={{
            backgroundColor: "var(--docs-code-block-bg)",
            borderColor: "var(--docs-card-border)",
          }}
        >
          <pre className="p-4 text-[13px] leading-relaxed">
            <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
          </pre>
        </div>
      )}
    </div>
  );
}
