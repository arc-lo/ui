# arc lo

**AI-native design system for React**

18 components for building AI interfaces — streaming, prompts, confidence, feedback, citations, refusals, reasoning, tool calls, and more. Built on Radix conventions. Themeable. Works with shadcn/ui.

## Install

```bash
npm install @arc-lo/ui
```

## Quick start

```tsx
import {
  StreamingText,
  FeedbackBar,
  ThinkingBlock,
  PromptBox,
} from "@arc-lo/ui";

function Chat({ stream }) {
  return (
    <>
      <ThinkingBlock.Root state="done" duration={3} collapseOnDone>
        <ThinkingBlock.Trigger />
        <ThinkingBlock.Content>Analyzing...</ThinkingBlock.Content>
      </ThinkingBlock.Root>

      <StreamingText.Root stream={stream} speed={30}>
        <StreamingText.Content />
        <StreamingText.Cursor />
        <StreamingText.Toolbar>
          <FeedbackBar.Root>
            <FeedbackBar.ThumbsUp />
            <FeedbackBar.ThumbsDown />
            <FeedbackBar.Copy />
          </FeedbackBar.Root>
        </StreamingText.Toolbar>
      </StreamingText.Root>

      <PromptBox.Root onSubmit={send}>
        <PromptBox.Input />
        <PromptBox.Footer>
          <PromptBox.SubmitButton />
        </PromptBox.Footer>
      </PromptBox.Root>
    </>
  );
}
```

## Components

### Streaming & rendering

| Component | Description |
|---|---|
| `StreamingText` | Token-by-token rendering with 6 lifecycle states |
| `MarkdownRenderer` | Streaming-aware markdown with code blocks, lists, links |
| `StatusIndicator` | Animated AI status with letter-by-letter light sweep |
| `CodeBlock` | Code display with copy button, line numbers, language badge |

### Input & interaction

| Component | Description |
|---|---|
| `PromptBox` | Auto-growing textarea with chips, suggestions, Enter-to-submit |
| `FeedbackBar` | Thumbs up/down, copy, regenerate toolbar |
| `ModelSelector` | Dropdown selector for AI models with badges |
| `SuggestTopics` | Starter prompt cards for empty chat states |
| `ConversationBranch` | Branch navigation for regenerated responses |
| `FileAttachment` | File preview chips/cards with type icons and upload progress |

### Trust & transparency

| Component | Description |
|---|---|
| `ConfidenceBadge` | Visual confidence indicators (badge, dot, inline) |
| `CitationInline` | Inline source references with hover previews |
| `RefusalCard` | Declined request handling with alternatives |

### Reasoning & agents

| Component | Description |
|---|---|
| `ThinkingBlock` | Collapsible chain-of-thought reasoning display |
| `ToolCall` | Tool invocation with status, inputs, and outputs |
| `ChatThread` | Conversation container with user/assistant/system messages |

### Analytics & data

| Component | Description |
|---|---|
| `TokenUsage` | Visual token/cost meter with input/output proportions |
| `SourceCard` | RAG retrieval result with relevance scoring |

## Theming

Override CSS custom properties to match your brand:

```css
@import "@arc-lo/ui/theme.css"; /* includes light + dark mode */

/* Or set manually */
:root {
  --arclo-accent: #6C5CE7;
  --arclo-surface: #ffffff;
  --arclo-border: #e5e7eb;
  --arclo-text: #1a1a1a;
}

.dark {
  --arclo-accent: #a78bfa;
  --arclo-surface: #1a1a2e;
  --arclo-border: #2d2d44;
  --arclo-text: #e2e8f0;
}
```

## Philosophy

- **Radix-style composable API** — compound components with Root + parts
- **Built for AI states** — pending, streaming, done, interrupted, error, ratelimit
- **Works with shadcn/ui** — same Tailwind + Radix conventions
- **Trust & uncertainty** — visual language for confidence, citations, refusals
- **Agent-ready** — ThinkingBlock and ToolCall for reasoning and tool use
- **Themeable** — CSS variables with light/dark mode support

## Links

- [Docs](https://arclo.dev)
- [npm](https://www.npmjs.com/package/@arc-lo/ui)

## License

MIT
