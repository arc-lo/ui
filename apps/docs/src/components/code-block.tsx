"use client";

import { highlight } from "sugar-high";

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const html = highlight(code);

  return (
    <div
      className="not-prose group relative my-4 overflow-hidden rounded-xl border"
      style={{
        backgroundColor: "var(--docs-code-block-bg)",
        borderColor: "var(--docs-card-border)",
      }}
    >
      {lang && (
        <div
          className="border-b px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider"
          style={{
            backgroundColor: "var(--docs-demo-header-bg)",
            borderColor: "var(--docs-card-border)",
            color: "var(--docs-muted)",
          }}
        >
          {lang}
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className="p-4 text-[13px] leading-relaxed">
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(code)}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md border px-2 py-1 text-[11px] cursor-pointer"
        style={{
          backgroundColor: "var(--docs-card-bg)",
          borderColor: "var(--docs-card-border)",
          color: "var(--docs-muted)",
        }}
      >
        Copy
      </button>
    </div>
  );
}
