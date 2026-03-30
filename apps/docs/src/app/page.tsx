import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "arclo — AI-native design system for React",
  description:
    "20 React components for building AI interfaces. Streaming text, prompts, confidence badges, thinking blocks, tool calls, image/video generation. Built on Radix. Works with shadcn/ui.",
};
import { ThemeToggle } from "../components/theme-toggle";
import { ThemePicker } from "../components/theme-picker";
import { SiteSearch } from "../components/site-search";
import { AnimateOnScroll } from "../components/animate-on-scroll";
import { HeroChat } from "../components/hero-chat";

const components = [
  {
    name: "StreamingText",
    description: "Token-by-token text rendering with 6 states: pending, streaming, done, interrupted, error, and ratelimit.",
    href: "/docs/streaming-text",
  },
  {
    name: "PromptBox",
    description: "Auto-growing textarea with context chips, suggestions, and Enter-to-submit.",
    href: "/docs/prompt-box",
  },
  {
    name: "ConfidenceBadge",
    description: "Visual indicator for high, medium, low, or unknown confidence levels.",
    href: "/docs/confidence-badge",
  },
  {
    name: "FeedbackBar",
    description: "Thumbs up/down, copy, and regenerate toolbar for AI responses.",
    href: "/docs/feedback-bar",
  },
  {
    name: "CitationInline",
    description: "Inline source attribution with hover preview tooltips.",
    href: "/docs/citation-inline",
  },
  {
    name: "RefusalCard",
    description: "Graceful handling of declined requests with suggested alternatives.",
    href: "/docs/refusal-card",
  },
  {
    name: "ThinkingBlock",
    description: "Collapsible chain-of-thought display for AI reasoning with auto-collapse.",
    href: "/docs/thinking-block",
  },
  {
    name: "ToolCall",
    description: "Tool invocation display with status, collapsible inputs and outputs for agent UIs.",
    href: "/docs/tool-call",
  },
  {
    name: "MarkdownRenderer",
    description: "Streaming-aware markdown with code blocks, lists, links, and blockquotes.",
    href: "/docs/markdown-renderer",
  },
  {
    name: "StatusIndicator",
    description: "Animated status label with letter-by-letter light sweep for AI states.",
    href: "/docs/status-indicator",
  },
  {
    name: "TokenUsage",
    description: "Visual token and cost meter showing input/output usage against a budget.",
    href: "/docs/token-usage",
  },
  {
    name: "ModelSelector",
    description: "Dropdown selector for AI models with badges and descriptions.",
    href: "/docs/model-selector",
  },
  {
    name: "SourceCard",
    description: "RAG retrieval result card with relevance scoring, title, and content preview.",
    href: "/docs/source-card",
  },
  {
    name: "ChatThread",
    description: "Conversation container with user, assistant, and system messages — auto-scrolling, avatars, and timestamps.",
    href: "/docs/chat-thread",
  },
  {
    name: "FileAttachment",
    description: "File preview chips and cards with type icons, upload progress, and remove button.",
    href: "/docs/file-attachment",
  },
  {
    name: "CodeBlock",
    description: "Standalone code display with copy button, line numbers, and language badge.",
    href: "/docs/code-block",
  },
  {
    name: "ConversationBranch",
    description: "Branch navigation for regenerated responses — compact '2/3 ←→' control.",
    href: "/docs/conversation-branch",
  },
  {
    name: "SuggestTopics",
    description: "Starter prompt cards for empty chat states — help users begin conversations.",
    href: "/docs/suggest-topics",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--docs-bg)" }}>
      {/* Nav */}
      <nav
        className="border-b px-6 py-4"
        style={{ backgroundColor: "var(--docs-nav-bg)", borderColor: "var(--docs-sidebar-border)" }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-baseline gap-0.5 text-xl tracking-tight">
            <span className="font-semibold" style={{ color: "var(--docs-heading)" }}>arc</span>
            <span className="font-semibold" style={{ color: "var(--arclo-accent, #1a1a1a)" }}>lo</span>
          </Link>
          <div className="flex items-center gap-6 text-sm" style={{ color: "var(--docs-muted)" }}>
            <Link href="/docs" className="hover:opacity-80">Docs</Link>
            <a
              href="https://github.com/arc-lo/ui"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              GitHub
            </a>
            <SiteSearch />
            <ThemePicker />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <div className="max-w-lg flex-shrink-0">
            <h1 className="hero-animate-1 text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: "var(--docs-heading)" }}>
              AI-native components
              <br />
              <span style={{ color: "var(--arclo-accent, #1a1a1a)" }}>for React</span>
            </h1>
            <p className="hero-animate-2 mt-6 text-lg leading-relaxed" style={{ color: "var(--docs-body)" }}>
              18 primitives every AI product needs — streaming, prompts,
              confidence, feedback, citations, refusals, thinking blocks, tool
              calls, markdown, status indicators, token usage, model selection,
              source cards, and chat threads. Built on Radix conventions.
              Themeable. Works with shadcn/ui.
            </p>
            <div className="hero-animate-3 mt-8 flex gap-4">
              <Link
                href="/docs"
                className="rounded-lg px-5 py-2.5 text-sm font-medium hover:brightness-90"
                style={{ backgroundColor: "var(--arclo-accent, #1a1a1a)", color: "var(--arclo-accent-fg, #ffffff)" }}
              >
                Get started
              </Link>
              <code
                className="flex items-center rounded-lg border px-4 py-2.5 text-sm"
                style={{
                  backgroundColor: "var(--docs-code-bg)",
                  borderColor: "var(--docs-card-border)",
                  color: "var(--docs-body)",
                }}
              >
                npm i @arc-lo/ui
              </code>
            </div>
          </div>
          <div className="hero-animate-4 hidden lg:block flex-1 min-w-0">
            <HeroChat />
          </div>
        </div>
      </section>

      {/* Components grid */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-8 text-sm font-medium uppercase tracking-wider" style={{ color: "var(--docs-muted)" }}>
          Components
        </h2>
        <AnimateOnScroll className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((c, i) => (
            <Link
              key={c.name}
              href={c.href}
              className="card-reveal group rounded-xl border p-6 transition-all hover:scale-[1.01]"
              style={{ borderColor: "var(--docs-card-border)", backgroundColor: "var(--docs-card-bg)", transitionDelay: `${i * 50}ms` }}
            >
              <h3 className="font-mono text-sm font-semibold" style={{ color: "var(--docs-heading)" }}>
                <span className="group-hover:hidden">{"<"}{c.name}{" />"}</span>
                <span className="hidden group-hover:inline" style={{ color: "var(--arclo-accent, #1a1a1a)" }}>{"<"}{c.name}{" />"}</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--docs-body)" }}>
                {c.description}
              </p>
            </Link>
          ))}
        </AnimateOnScroll>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8" style={{ borderColor: "var(--docs-sidebar-border)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between text-sm" style={{ color: "var(--docs-muted)" }}>
          <div className="flex items-baseline gap-0.5">
            <span className="font-semibold" style={{ color: "var(--docs-body)" }}>arc</span>
            <span className="font-semibold" style={{ color: "var(--arclo-accent, #1a1a1a)", opacity: 0.6 }}>lo</span>
          </div>
          <p>AI-native design system</p>
        </div>
      </footer>
    </div>
  );
}
