import { CodeBlock } from "@/components/code-block";
import { InfoTable } from "@/components/props-table";

export default function DocsIndex() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>Getting Started</h1>
      <p>
        arclo is an AI-native design system for React. It provides 13
        primitives every AI product needs — components that don&apos;t exist in
        MUI, Tailwind, Radix, or shadcn/ui.
      </p>

      <h2>Installation</h2>
      <CodeBlock lang="bash" code={`npm install @arc-lo/ui`} />

      <h3>Peer dependencies</h3>
      <p>arclo requires React 18+ and Tailwind CSS 4+.</p>
      <CodeBlock lang="bash" code={`npm install react react-dom tailwindcss`} />

      <h2>Quick start</h2>
      <CodeBlock
        lang="tsx"
        code={`import {
  StreamingText,
  FeedbackBar,
  ThinkingBlock,
  StatusIndicator,
} from "@arc-lo/ui";

function ChatMessage({ stream, thinkingState }) {
  return (
    <div>
      <StatusIndicator state={thinkingState} />

      <ThinkingBlock.Root state={thinkingState} collapseOnDone>
        <ThinkingBlock.Trigger />
        <ThinkingBlock.Content>
          <p>Analyzing the request...</p>
        </ThinkingBlock.Content>
      </ThinkingBlock.Root>

      <StreamingText.Root stream={stream} speed={30}>
        <StreamingText.Skeleton lines={3} />
        <StreamingText.Content />
        <StreamingText.Cursor />
        <StreamingText.Stop />
        <StreamingText.Toolbar>
          <FeedbackBar.Root>
            <FeedbackBar.ThumbsUp />
            <FeedbackBar.ThumbsDown />
            <FeedbackBar.Copy />
            <FeedbackBar.Regenerate />
          </FeedbackBar.Root>
        </StreamingText.Toolbar>
      </StreamingText.Root>
    </div>
  );
}`}
      />

      <h2>Philosophy</h2>
      <ul>
        <li>
          <strong>Radix-style composable API</strong> — compound components with
          Root + parts. Use only what you need.
        </li>
        <li>
          <strong>Built for AI states</strong> — pending, streaming, done,
          interrupted, error, and ratelimit are first-class states, not
          afterthoughts.
        </li>
        <li>
          <strong>Works with shadcn/ui</strong> — same Tailwind + Radix
          conventions. Drop arclo components into an existing shadcn project.
        </li>
        <li>
          <strong>Trust &amp; uncertainty</strong> — visual language for
          confidence levels, citations, and refusals. The layer no other DS has.
        </li>
        <li>
          <strong>Agent-ready</strong> — ThinkingBlock and ToolCall handle
          chain-of-thought reasoning and tool invocations out of the box.
        </li>
        <li>
          <strong>Themeable</strong> — CSS custom properties for colors,
          surfaces, and borders. Supports light and dark mode.
        </li>
      </ul>

      <h2>Theming</h2>
      <p>
        Override CSS custom properties to match your brand. All accent colors,
        surfaces, and borders are customizable. Import the theme preset for
        automatic dark mode support:
      </p>
      <CodeBlock
        lang="css"
        code={`/* Option 1: Import the preset (includes light + dark mode) */
@import "@arc-lo/ui/theme.css";

/* Option 2: Set variables manually */
:root {
  --arclo-accent: #6C5CE7;
  --arclo-accent-hover: #5A4BD1;
  --arclo-surface: #ffffff;
  --arclo-surface-secondary: #f9fafb;
  --arclo-border: #e5e7eb;
  --arclo-text: #1a1a1a;
  --arclo-text-secondary: #6b7280;
  --arclo-text-muted: #9ca3af;
  --arclo-error: #ef4444;
  --arclo-error-surface: #fef2f2;
  --arclo-warning: #f59e0b;
  --arclo-warning-surface: #fffbeb;
  --arclo-radius: 0.75rem;
}

/* Dark mode — via class or media query */
.dark {
  --arclo-accent: #a78bfa;
  --arclo-surface: #1a1a2e;
  --arclo-surface-secondary: #16213e;
  --arclo-border: #2d2d44;
  --arclo-text: #e2e8f0;
  --arclo-text-secondary: #94a3b8;
  --arclo-text-muted: #64748b;
  --arclo-error: #f87171;
  --arclo-error-surface: #451a1a;
}`}
      />

      <h2>Components</h2>
      <h3>Streaming &amp; rendering</h3>
      <InfoTable
        headers={["Component", "Purpose"]}
        rows={[
          { cells: ["StreamingText", "Token-by-token rendering with 6 lifecycle states"] },
          { cells: ["MarkdownRenderer", "Streaming-aware markdown with code blocks, lists, and links"] },
          { cells: ["StatusIndicator", "Animated AI status label with letter-by-letter light sweep"] },
        ]}
      />

      <h3>Input &amp; interaction</h3>
      <InfoTable
        headers={["Component", "Purpose"]}
        rows={[
          { cells: ["PromptBox", "AI prompt input with auto-grow, chips, and suggestions"] },
          { cells: ["FeedbackBar", "Response actions toolbar — thumbs, copy, regenerate"] },
          { cells: ["ModelSelector", "Dropdown selector for AI models with badges"] },
        ]}
      />

      <h3>Trust &amp; transparency</h3>
      <InfoTable
        headers={["Component", "Purpose"]}
        rows={[
          { cells: ["ConfidenceBadge", "Visual confidence indicators (badge, dot, inline)"] },
          { cells: ["CitationInline", "Inline source references with hover previews"] },
          { cells: ["RefusalCard", "Declined request handling with alternatives"] },
        ]}
      />

      <h3>Reasoning &amp; agents</h3>
      <InfoTable
        headers={["Component", "Purpose"]}
        rows={[
          { cells: ["ThinkingBlock", "Collapsible chain-of-thought reasoning display"] },
          { cells: ["ToolCall", "Tool invocation with status, inputs, and outputs"] },
        ]}
      />

      <h3>Analytics &amp; data</h3>
      <InfoTable
        headers={["Component", "Purpose"]}
        rows={[
          { cells: ["TokenUsage", "Visual token/cost meter with input/output proportions"] },
          { cells: ["SourceCard", "RAG retrieval result with relevance scoring"] },
        ]}
      />
    </article>
  );
}
