import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { InfoTable } from "@/components/props-table";

export default function DocsIndex() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>Getting Started</h1>
      <p>
        arclo is an AI-native design system for React. It provides 20
        components every AI product needs — primitives that don&apos;t exist in
        MUI, Tailwind, Radix, or shadcn/ui.
      </p>

      <h2>Installation</h2>
      <CodeBlock lang="bash" code={`npm install @arc-lo/ui`} />

      <h2>Setup</h2>
      <p>Add the styles import to your CSS file:</p>
      <CodeBlock
        lang="css"
        code={`@import "tailwindcss";
@import "@arc-lo/ui/styles.css";`}
      />
      <p>
        That&apos;s it — theme variables, dark mode, and Tailwind utility
        scanning are all included. See <Link href="/docs/theming">Theming</Link>{" "}
        for color customization.
      </p>

      <h2>Quick start</h2>
      <CodeBlock
        lang="tsx"
        code={`import {
  ChatThread,
  StreamingText,
  FeedbackBar,
  ThinkingBlock,
  PromptBox,
} from "@arc-lo/ui";

function Chat({ response }) {
  return (
    <ChatThread.Root className="h-[500px]">
      <ChatThread.Messages>
        <ChatThread.UserMessage name="You">
          How does this work?
        </ChatThread.UserMessage>

        <ChatThread.AssistantMessage name="Claude">
          <ThinkingBlock.Root state="done" duration={3} collapseOnDone>
            <ThinkingBlock.Trigger />
            <ThinkingBlock.Content>Analyzing...</ThinkingBlock.Content>
          </ThinkingBlock.Root>

          <StreamingText.Root text={response} speed={30}>
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
        </ChatThread.AssistantMessage>

        <ChatThread.ScrollAnchor />
      </ChatThread.Messages>
    </ChatThread.Root>
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
          <strong>Media generation</strong> — ImageGen and VideoGen for
          AI-generated images and videos with progress, states, and playback.
        </li>
        <li>
          <strong><Link href="/docs/theming">Themeable</Link></strong> — 6
          built-in color themes, CSS custom properties, light + dark mode.
        </li>
      </ul>

      <h2>Components</h2>
      <h3>Streaming &amp; rendering</h3>
      <InfoTable
        headers={["Component", "Purpose"]}
        rows={[
          { cells: ["StreamingText", "Token-by-token rendering with 6 lifecycle states"] },
          { cells: ["MarkdownRenderer", "Streaming-aware markdown with code blocks, lists, and links"] },
          { cells: ["StatusIndicator", "Animated AI status label with letter-by-letter light sweep"] },
          { cells: ["CodeBlock", "Code display with copy button, line numbers, and language badge"] },
        ]}
      />

      <h3>Input &amp; interaction</h3>
      <InfoTable
        headers={["Component", "Purpose"]}
        rows={[
          { cells: ["PromptBox", "AI prompt input with auto-grow, chips, and suggestions"] },
          { cells: ["FeedbackBar", "Response actions toolbar — thumbs, copy, regenerate"] },
          { cells: ["ModelSelector", "Dropdown selector for AI models with badges"] },
          { cells: ["SuggestTopics", "Starter prompt cards for empty chat states"] },
          { cells: ["ConversationBranch", "Branch navigation for regenerated responses"] },
          { cells: ["FileAttachment", "File preview chips/cards with type icons and upload progress"] },
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
          { cells: ["ChatThread", "Conversation container with user/assistant/system messages"] },
        ]}
      />

      <h3>Media generation</h3>
      <InfoTable
        headers={["Component", "Purpose"]}
        rows={[
          { cells: ["ImageGen", "Image generation with blur reveal, progress, and 5 states"] },
          { cells: ["VideoGen", "Video generation with stages, player, progress, and 6 states"] },
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
