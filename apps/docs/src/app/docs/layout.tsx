import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { name: "Getting Started", href: "/docs" },
  { name: "StreamingText", href: "/docs/streaming-text" },
  { name: "PromptBox", href: "/docs/prompt-box" },
  { name: "ConfidenceBadge", href: "/docs/confidence-badge" },
  { name: "FeedbackBar", href: "/docs/feedback-bar" },
  { name: "CitationInline", href: "/docs/citation-inline" },
  { name: "RefusalCard", href: "/docs/refusal-card" },
  { name: "ThinkingBlock", href: "/docs/thinking-block" },
  { name: "ToolCall", href: "/docs/tool-call" },
  { name: "MarkdownRenderer", href: "/docs/markdown-renderer" },
  { name: "StatusIndicator", href: "/docs/status-indicator" },
  { name: "TokenUsage", href: "/docs/token-usage" },
  { name: "ModelSelector", href: "/docs/model-selector" },
  { name: "SourceCard", href: "/docs/source-card" },
  { name: "ChatThread", href: "/docs/chat-thread" },
  { name: "FileAttachment", href: "/docs/file-attachment" },
  { name: "CodeBlock", href: "/docs/code-block" },
  { name: "ConversationBranch", href: "/docs/conversation-branch" },
  { name: "SuggestTopics", href: "/docs/suggest-topics" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--docs-bg)" }}>
      {/* Nav */}
      <nav
        className="border-b px-6 py-4"
        style={{
          backgroundColor: "var(--docs-nav-bg)",
          borderColor: "var(--docs-sidebar-border)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-baseline gap-0.5 text-xl tracking-tight">
            <span className="font-semibold" style={{ color: "var(--docs-heading)" }}>arc</span>
            <span className="font-semibold text-[#6C5CE7] dark:text-[#a78bfa]">lo</span>
          </Link>
          <div className="flex items-center gap-4">
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
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="mx-auto flex max-w-6xl">
        {/* Sidebar */}
        <aside
          className="hidden w-56 shrink-0 border-r py-8 pr-6 md:block"
          style={{ borderColor: "var(--docs-sidebar-border)" }}
        >
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-1.5 text-sm transition-colors"
                  style={{ color: "var(--docs-body)" }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
