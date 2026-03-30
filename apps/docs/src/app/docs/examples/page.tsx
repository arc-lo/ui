import Link from "next/link";

const examples = [
  {
    name: "Simple Chatbot",
    description:
      "A conversational AI assistant with streaming responses, suggested prompts, and feedback controls.",
    href: "/docs/examples/simple-chatbot",
    components: ["ChatThread", "StreamingText", "PromptBox", "FeedbackBar", "SuggestTopics"],
  },
  {
    name: "Research Assistant",
    description:
      "RAG-powered assistant that retrieves sources, shows inline citations, and displays confidence levels.",
    href: "/docs/examples/research-assistant",
    components: ["ChatThread", "CitationInline", "SourceCard", "ConfidenceBadge", "MarkdownRenderer"],
  },
  {
    name: "Coding Agent",
    description:
      "An agentic coding assistant with chain-of-thought reasoning, tool calls, and code output.",
    href: "/docs/examples/coding-agent",
    components: ["ChatThread", "ThinkingBlock", "ToolCall", "CodeBlock", "TokenUsage", "ModelSelector"],
  },
  {
    name: "Content Moderator",
    description:
      "A safety-focused interface where the AI classifies content and gracefully handles refusals.",
    href: "/docs/examples/content-moderator",
    components: ["ChatThread", "RefusalCard", "ConfidenceBadge", "StatusIndicator", "ConversationBranch"],
  },
  {
    name: "Multi-Model Playground",
    description:
      "Compare multiple model responses side by side with token usage and feedback scoring.",
    href: "/docs/examples/multi-model-playground",
    components: ["ModelSelector", "StreamingText", "TokenUsage", "FeedbackBar", "PromptBox"],
  },
];

export default function ExamplesPage() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>Examples</h1>
      <p>
        Real-world chatbot patterns built with arclo components. Each example
        combines multiple primitives into a complete, interactive interface.
      </p>

      <div className="not-prose mt-8 grid gap-4 sm:grid-cols-2">
        {examples.map((ex) => (
          <Link
            key={ex.name}
            href={ex.href}
            className="group rounded-xl border p-5 transition-all hover:scale-[1.01]"
            style={{
              borderColor: "var(--docs-card-border)",
              backgroundColor: "var(--docs-card-bg)",
            }}
          >
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--docs-heading)" }}
            >
              <span className="group-hover:hidden">{ex.name}</span>
              <span
                className="hidden group-hover:inline"
                style={{ color: "var(--arclo-accent, #6C5CE7)" }}
              >
                {ex.name}
              </span>
            </h3>
            <p
              className="mt-1.5 text-sm leading-relaxed"
              style={{ color: "var(--docs-body)" }}
            >
              {ex.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {ex.components.map((c) => (
                <span
                  key={c}
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: "var(--docs-code-bg)",
                    color: "var(--docs-muted)",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
