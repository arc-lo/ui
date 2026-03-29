"use client";

import { useState } from "react";
import { MarkdownRenderer } from "@arclo/react";
import { DemoWrapper } from "../demo-wrapper";

const usageCode = `import { MarkdownRenderer } from "@arclo/react";

// Basic
<MarkdownRenderer content={markdownString} />

// With StreamingText
<StreamingText.Root stream={stream}>
  <StreamingText.Content
    render={(text) => <MarkdownRenderer content={text} />}
  />
</StreamingText.Root>`;

const sampleMarkdown = `# AI-Native Design Systems

Building interfaces for AI products requires **fundamentally different** thinking than traditional web apps.

## Key Principles

Here are the core ideas:

1. **Design for uncertainty** — AI outputs are non-deterministic
2. **Stream everything** — token-by-token rendering feels alive
3. **Trust signals** — users need to know *when to verify*

## Code Example

\`\`\`typescript
import { StreamingText } from "@arclo/react";

function ChatMessage({ stream }) {
  return (
    <StreamingText.Root stream={stream}>
      <StreamingText.Content />
      <StreamingText.Cursor />
    </StreamingText.Root>
  );
}
\`\`\`

## Why This Matters

> The best AI products don't just show answers — they communicate confidence and invite collaboration.

Traditional design systems give you \`Button\`, \`Input\`, and \`Modal\`. But none of them have a \`ConfidenceBadge\` or a \`RefusalCard\`.

That's the gap [arclo](https://arclo.dev) fills.

---

- Works with **shadcn/ui**
- Built on **Radix** conventions
- Fully **TypeScript** + **Tailwind**`;

const shortMarkdown = `## Quick Note

This is a *simple* example with **bold text**, \`inline code\`, and a [link](https://arclo.dev).

- Item one
- Item two
- Item three`;

export function MarkdownRendererDemo() {
  const [selected, setSelected] = useState(0);
  const samples = [
    { label: "Full example", content: sampleMarkdown },
    { label: "Short", content: shortMarkdown },
  ];

  return (
    <DemoWrapper title="MarkdownRenderer — Live Demo" code={usageCode}>
      <div className="space-y-4">
        <div className="flex gap-2">
          {samples.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSelected(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                selected === i
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-gray-100 p-6">
          <MarkdownRenderer content={samples[selected].content} />
        </div>
      </div>
    </DemoWrapper>
  );
}
