"use client";

import { useState } from "react";
import { highlight } from "sugar-high";

export function ExampleSource({ code, title = "Source code" }: { code: string; title?: string }) {
  const [open, setOpen] = useState(false);
  const html = highlight(code);

  return (
    <div
      className="mt-6 rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--docs-card-border)",
        backgroundColor: "var(--docs-card-bg)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium cursor-pointer"
        style={{ color: "var(--docs-heading)" }}
      >
        <span>{title}</span>
        <span
          className="text-xs"
          style={{ color: "var(--docs-muted)" }}
        >
          {open ? "Hide" : "Show"} code
        </span>
      </button>
      {open && (
        <div
          className="border-t overflow-x-auto"
          style={{
            borderColor: "var(--docs-card-border)",
            backgroundColor: "var(--docs-code-block-bg)",
          }}
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(code)}
              className="absolute right-3 top-3 rounded-md border px-2 py-1 text-[11px] cursor-pointer"
              style={{
                backgroundColor: "var(--docs-card-bg)",
                borderColor: "var(--docs-card-border)",
                color: "var(--docs-muted)",
              }}
            >
              Copy
            </button>
            <pre className="p-4 text-[13px] leading-relaxed">
              <code dangerouslySetInnerHTML={{ __html: html }} />
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
