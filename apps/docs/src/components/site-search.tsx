"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface SearchItem {
  name: string
  href: string
  description: string
  category: string
}

const searchData: SearchItem[] = [
  // Getting Started
  { name: "Introduction", href: "/docs", description: "Installation, quick start, and philosophy", category: "Getting Started" },
  { name: "Theming", href: "/docs/theming", description: "Color themes, CSS variables, dark mode", category: "Getting Started" },
  // Components
  { name: "StreamingText", href: "/docs/streaming-text", description: "Token-by-token text rendering with 6 states", category: "Components" },
  { name: "PromptBox", href: "/docs/prompt-box", description: "Auto-growing textarea with chips and suggestions", category: "Components" },
  { name: "ConfidenceBadge", href: "/docs/confidence-badge", description: "Visual confidence level indicators", category: "Components" },
  { name: "FeedbackBar", href: "/docs/feedback-bar", description: "Thumbs up/down, copy, and regenerate toolbar", category: "Components" },
  { name: "CitationInline", href: "/docs/citation-inline", description: "Inline source attribution with hover previews", category: "Components" },
  { name: "RefusalCard", href: "/docs/refusal-card", description: "Graceful declined request handling", category: "Components" },
  { name: "ThinkingBlock", href: "/docs/thinking-block", description: "Collapsible chain-of-thought reasoning", category: "Components" },
  { name: "ToolCall", href: "/docs/tool-call", description: "Tool invocation display with status", category: "Components" },
  { name: "MarkdownRenderer", href: "/docs/markdown-renderer", description: "Streaming-aware markdown rendering", category: "Components" },
  { name: "StatusIndicator", href: "/docs/status-indicator", description: "Animated AI status label", category: "Components" },
  { name: "TokenUsage", href: "/docs/token-usage", description: "Token and cost usage meter", category: "Components" },
  { name: "ModelSelector", href: "/docs/model-selector", description: "AI model dropdown selector", category: "Components" },
  { name: "SourceCard", href: "/docs/source-card", description: "RAG retrieval result card", category: "Components" },
  { name: "ChatThread", href: "/docs/chat-thread", description: "Conversation container with messages", category: "Components" },
  { name: "FileAttachment", href: "/docs/file-attachment", description: "File preview chips and cards", category: "Components" },
  { name: "CodeBlock", href: "/docs/code-block", description: "Code display with copy and line numbers", category: "Components" },
  { name: "ConversationBranch", href: "/docs/conversation-branch", description: "Branch navigation for regenerated responses", category: "Components" },
  { name: "SuggestTopics", href: "/docs/suggest-topics", description: "Starter prompt cards for empty states", category: "Components" },
  { name: "ImageGen", href: "/docs/image-gen", description: "Image generation with blur reveal and progress", category: "Components" },
  { name: "VideoGen", href: "/docs/video-gen", description: "Video generation progress with 6 states", category: "Components" },
  // Examples
  { name: "Simple Chatbot", href: "/docs/examples/simple-chatbot", description: "Conversational AI with streaming", category: "Examples" },
  { name: "Research Assistant", href: "/docs/examples/research-assistant", description: "RAG with citations and sources", category: "Examples" },
  { name: "Coding Agent", href: "/docs/examples/coding-agent", description: "Agent with thinking and tool calls", category: "Examples" },
  { name: "Content Moderator", href: "/docs/examples/content-moderator", description: "Safety with refusals", category: "Examples" },
  { name: "Multi-Model Playground", href: "/docs/examples/multi-model-playground", description: "Side-by-side model comparison", category: "Examples" },
]

const categoryOrder = ["Getting Started", "Components", "Examples"]

export function SiteSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return searchData
    const q = query.toLowerCase()
    return searchData.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    )
  }, [query])

  const grouped = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {}
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    }
    return categoryOrder
      .filter((cat) => groups[cat]?.length)
      .map((cat) => ({ category: cat, items: groups[cat] }))
  }, [filtered])

  const flatItems = useMemo(() => grouped.flatMap((g) => g.items), [grouped])

  const navigate = useCallback(
    (item: SearchItem) => {
      setOpen(false)
      setQuery("")
      setSelectedIndex(0)
      router.push(item.href)
    },
    [router]
  )

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const selected = listRef.current.querySelector("[data-selected='true']")
    if (selected) {
      selected.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (flatItems[selectedIndex]) navigate(flatItems[selectedIndex])
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      setQuery("")
      setSelectedIndex(0)
    }
  }

  let flatIndex = -1

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "1px solid var(--arclo-border, #e5e7eb)",
          background: "var(--arclo-surface, #ffffff)",
          color: "var(--arclo-text-muted, #9ca3af)",
          fontSize: "14px",
          cursor: "pointer",
          minWidth: "200px",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span style={{ flex: 1, textAlign: "left" }}>Search...</span>
        <kbd
          style={{
            fontSize: "11px",
            fontFamily: "inherit",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid var(--arclo-border, #e5e7eb)",
            background: "var(--arclo-hover-bg, rgba(0,0,0,0.06))",
            color: "var(--arclo-text-muted, #9ca3af)",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "min(20vh, 120px)",
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false)
              setQuery("")
              setSelectedIndex(0)
            }
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              maxHeight: "min(60vh, 480px)",
              borderRadius: "12px",
              border: "1px solid var(--arclo-border, #e5e7eb)",
              background: "var(--arclo-surface, #ffffff)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                borderBottom: "1px solid var(--arclo-border, #e5e7eb)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--arclo-text-muted, #9ca3af)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search documentation..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "15px",
                  color: "var(--arclo-text, #1a1a1a)",
                }}
              />
              <kbd
                style={{
                  fontSize: "11px",
                  fontFamily: "inherit",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  border: "1px solid var(--arclo-border, #e5e7eb)",
                  background: "var(--arclo-hover-bg, rgba(0,0,0,0.06))",
                  color: "var(--arclo-text-muted, #9ca3af)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpen(false)
                  setQuery("")
                  setSelectedIndex(0)
                }}
              >
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px",
              }}
            >
              {grouped.length === 0 ? (
                <div
                  style={{
                    padding: "32px 16px",
                    textAlign: "center",
                    color: "var(--arclo-text-muted, #9ca3af)",
                    fontSize: "14px",
                  }}
                >
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                grouped.map((group) => (
                  <div key={group.category} style={{ marginBottom: "8px" }}>
                    <div
                      style={{
                        padding: "8px 8px 4px",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--arclo-text-muted, #9ca3af)",
                      }}
                    >
                      {group.category}
                    </div>
                    {group.items.map((item) => {
                      flatIndex++
                      const isSelected = flatIndex === selectedIndex
                      const idx = flatIndex
                      return (
                        <button
                          key={item.href}
                          type="button"
                          data-selected={isSelected}
                          onClick={() => navigate(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            background: isSelected
                              ? "var(--arclo-accent, #1a1a1a)"
                              : "transparent",
                            color: isSelected
                              ? "var(--arclo-accent-fg, #ffffff)"
                              : "var(--arclo-text, #1a1a1a)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              marginTop: "2px",
                              color: isSelected
                                ? "var(--arclo-accent-fg, #ffffff)"
                                : "var(--arclo-text-secondary, #6b7280)",
                              opacity: isSelected ? 0.8 : 1,
                            }}
                          >
                            {item.description}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "8px 16px",
                borderTop: "1px solid var(--arclo-border, #e5e7eb)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "11px",
                color: "var(--arclo-text-muted, #9ca3af)",
              }}
            >
              <span>
                <kbd style={{ fontWeight: 600 }}>↑↓</kbd> navigate
              </span>
              <span>
                <kbd style={{ fontWeight: 600 }}>↵</kbd> select
              </span>
              <span>
                <kbd style={{ fontWeight: 600 }}>esc</kbd> close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
