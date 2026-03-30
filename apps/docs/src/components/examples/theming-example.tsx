"use client";

import { useState } from "react";
import {
  ChatThread,
  FeedbackBar,
  PromptBox,
  ConfidenceBadge,
  StatusIndicator,
} from "@arc-lo/ui";
import { CodeBlock } from "@/components/code-block";

/* ─── Theme definitions ─────────────────────────────────────────── */

const themes = {
  noir: { accent: "#1a1a1a", hover: "#333333", fg: "#ffffff", label: "Noir" },
  violet: { accent: "#6C5CE7", hover: "#5A4BD1", fg: "#ffffff", label: "Violet" },
  ocean: { accent: "#0ea5e9", hover: "#0284c7", fg: "#ffffff", label: "Ocean" },
  forest: { accent: "#10b981", hover: "#059669", fg: "#ffffff", label: "Forest" },
  sunset: { accent: "#f97316", hover: "#ea580c", fg: "#ffffff", label: "Sunset" },
  rose: { accent: "#f43f5e", hover: "#e11d48", fg: "#ffffff", label: "Rose" },
} as const;

type ThemeKey = keyof typeof themes;

/* ─── Component ─────────────────────────────────────────────────── */

export function ThemingExample() {
  const [active, setActive] = useState<ThemeKey>("violet");
  const theme = themes[active];

  const handleSelect = (key: ThemeKey) => {
    setActive(key);
    document.documentElement.setAttribute("data-theme", key);
  };

  const cssCode = `/* Add to your CSS or HTML */
<html data-theme="${active}">

/* Or override variables directly */
:root {
  --arclo-accent: ${theme.accent};
  --arclo-accent-hover: ${theme.hover};
  --arclo-accent-fg: ${theme.fg};
}`;

  return (
    <div
      className="not-prose my-6 overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--docs-card-border)" }}
    >
      {/* ─── Swatch row ────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 border-b px-5 py-4"
        style={{
          backgroundColor: "var(--docs-demo-header-bg)",
          borderColor: "var(--docs-card-border)",
        }}
      >
        {(Object.entries(themes) as [ThemeKey, (typeof themes)[ThemeKey]][]).map(
          ([key, t]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div
                className="w-8 h-8 rounded-full transition-all"
                style={{
                  backgroundColor: t.accent,
                  boxShadow:
                    active === key
                      ? `0 0 0 2px var(--docs-bg, #fff), 0 0 0 4px ${t.accent}`
                      : "none",
                }}
              />
              <span
                className="text-[11px] font-medium"
                style={{
                  color:
                    active === key
                      ? "var(--docs-heading)"
                      : "var(--docs-muted)",
                }}
              >
                {t.label}
              </span>
            </button>
          ),
        )}
      </div>

      {/* ─── Preview panel ─────────────────────────────────────── */}
      <div
        className="p-5"
        style={{ backgroundColor: "var(--docs-card-bg)" }}
      >
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            borderColor: "var(--arclo-border, #e5e7eb)",
            backgroundColor: "var(--arclo-surface, #ffffff)",
          }}
        >
          {/* Mini chat */}
          <ChatThread.Root className="max-h-[260px]">
            <ChatThread.Messages>
              <ChatThread.UserMessage
                name="You"
                avatar={
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: "var(--docs-code-bg, #f3f4f6)",
                      color: "var(--docs-body, #4b5563)",
                    }}
                  >
                    Y
                  </div>
                }
              >
                What is a design token?
              </ChatThread.UserMessage>

              <ChatThread.AssistantMessage
                name="Assistant"
                avatar={
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: "var(--arclo-accent, #1a1a1a)",
                      color: "var(--arclo-accent-fg, #ffffff)",
                    }}
                  >
                    A
                  </div>
                }
              >
                <div className="space-y-2">
                  <div className="whitespace-pre-wrap">
                    A design token is a named value that captures a single design
                    decision — like a color, spacing unit, or font size. Tokens
                    make it easy to keep your UI consistent and rebrand in
                    minutes.
                  </div>
                  <FeedbackBar.Root>
                    <FeedbackBar.ThumbsUp />
                    <FeedbackBar.ThumbsDown />
                    <FeedbackBar.Copy text="A design token is a named value that captures a single design decision." />
                  </FeedbackBar.Root>
                </div>
              </ChatThread.AssistantMessage>
            </ChatThread.Messages>
          </ChatThread.Root>

          {/* Prompt box */}
          <div
            className="border-t p-3"
            style={{
              borderColor: "var(--arclo-border, #e5e7eb)",
              backgroundColor: "var(--arclo-surface, #ffffff)",
            }}
          >
            <PromptBox.Root
              value=""
              onValueChange={() => {}}
              onSubmit={() => {}}
            >
              <PromptBox.Input placeholder="Ask a follow-up..." />
              <PromptBox.Footer>
                <span
                  className="text-xs"
                  style={{ color: "var(--docs-muted, #9ca3af)" }}
                >
                  Enter to send
                </span>
                <PromptBox.SubmitButton />
              </PromptBox.Footer>
            </PromptBox.Root>
          </div>

          {/* Status row */}
          <div
            className="flex items-center gap-4 border-t px-4 py-3"
            style={{
              borderColor: "var(--arclo-border, #e5e7eb)",
              backgroundColor: "var(--arclo-surface, #ffffff)",
            }}
          >
            <ConfidenceBadge level="high" />
            <StatusIndicator state="idle" />
          </div>
        </div>
      </div>

      {/* ─── CSS code output ───────────────────────────────────── */}
      <div
        className="border-t px-5 pb-5"
        style={{
          borderColor: "var(--docs-card-border)",
          backgroundColor: "var(--docs-card-bg)",
        }}
      >
        <CodeBlock code={cssCode} lang="css" />
      </div>
    </div>
  );
}
