"use client";

import { useState, useCallback, useRef } from "react";
import {
  ChatThread,
  StreamingText,
  PromptBox,
  FeedbackBar,
  CitationInline,
  SourceCard,
  ConfidenceBadge,
  MarkdownRenderer,
  StatusIndicator,
} from "@arc-lo/ui";

/* ─── Source data ────────────────────────────────────────────────── */

const SOURCES = [
  {
    title: "Attention Is All You Need",
    url: "https://arxiv.org/abs/1706.03762",
    content:
      "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
    relevance: 0.95,
  },
  {
    title: "Long Short-Term Memory",
    url: "https://www.bioinf.jku.at/publications/older/2604.pdf",
    content:
      "LSTM networks introduce a gating mechanism to control the flow of information, addressing the vanishing gradient problem inherent in standard RNNs.",
    relevance: 0.82,
  },
  {
    title: "Sequence to Sequence Learning with Neural Networks",
    url: "https://arxiv.org/abs/1409.3215",
    content:
      "We present a general end-to-end approach to sequence learning using a multilayered LSTM to map the input sequence to a fixed-length vector.",
    relevance: 0.74,
  },
];

/* ─── Canned response ───────────────────────────────────────────── */

const RESPONSE_MD = `## Transformers vs RNNs

The key differences between transformers and RNNs come down to **architecture**, **parallelism**, and **long-range dependencies**.

### Architecture

Transformers rely entirely on self-attention mechanisms to compute representations of input sequences, eliminating the need for recurrence altogether [1]. RNNs, by contrast, process tokens sequentially, maintaining a hidden state that is updated at each time step [2].

### Parallelism

Because transformers process all positions simultaneously through attention, they are highly parallelizable and train significantly faster on modern hardware [1]. RNNs must process tokens one at a time, creating a sequential bottleneck that limits training speed [3].

### Handling Long-Range Dependencies

Standard RNNs struggle with long-range dependencies due to vanishing gradients. LSTMs partially address this with gating mechanisms [2], but transformers handle arbitrarily long dependencies through direct attention connections between any two positions [1].

### Summary

- **Transformers**: parallel, scale well, excel at long-range dependencies
- **RNNs/LSTMs**: sequential, simpler for short sequences, well-understood gating [2] [3]`;

/* ─── Types ─────────────────────────────────────────────────────── */

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  streaming: boolean;
  showSources?: boolean;
}

/* ─── Component ─────────────────────────────────────────────────── */

export function ResearchAssistantExample() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [retrievingSources, setRetrievingSources] = useState(false);
  const nextId = useRef(1);

  const handleSubmit = useCallback(
    (text: string) => {
      if (!text.trim() || isThinking) return;

      const userMsg: Message = {
        id: nextId.current++,
        role: "user",
        content: text.trim(),
        streaming: false,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsThinking(true);
      setRetrievingSources(true);

      // Phase 1: Simulate source retrieval
      setTimeout(() => {
        setRetrievingSources(false);

        // Phase 2: Show streaming assistant response with sources
        const assistantMsg: Message = {
          id: nextId.current++,
          role: "assistant",
          content: RESPONSE_MD,
          streaming: true,
          showSources: true,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsThinking(false);
      }, 1400);
    },
    [isThinking],
  );

  const markDone = useCallback((msgId: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, streaming: false } : m)),
    );
  }, []);

  const isEmpty = messages.length === 0;

  return (
    <div
      className="h-[600px] flex flex-col rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--arclo-border, #e5e7eb)",
        backgroundColor: "var(--arclo-surface, #ffffff)",
      }}
    >
      {/* ─── Chat area ────────────────────────────────────────── */}
      <ChatThread.Root className="flex-1 min-h-0">
        <ChatThread.Messages>
          {/* Empty state */}
          {isEmpty && !isThinking && (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
              <div className="text-center">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--docs-heading, #111)" }}
                >
                  Research Assistant
                </h2>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--docs-muted, #9ca3af)" }}
                >
                  Ask a question and I will retrieve relevant sources, cite them
                  inline, and indicate my confidence.
                </p>
              </div>
            </div>
          )}

          {/* Conversation messages */}
          {messages.map((msg) =>
            msg.role === "user" ? (
              <ChatThread.UserMessage
                key={msg.id}
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
                {msg.content}
              </ChatThread.UserMessage>
            ) : (
              <ChatThread.AssistantMessage
                key={msg.id}
                name="Research Assistant"
                avatar={
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: "var(--arclo-accent, #1a1a1a)",
                      color: "var(--arclo-accent-fg, #ffffff)",
                    }}
                  >
                    R
                  </div>
                }
              >
                <div className="space-y-3">
                  {/* Retrieved sources */}
                  {msg.showSources && (
                    <div className="space-y-2">
                      <p
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{
                          color: "var(--arclo-text-secondary, #6b7280)",
                        }}
                      >
                        Retrieved Sources
                      </p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {SOURCES.map((src, i) => (
                          <SourceCard
                            key={i}
                            title={src.title}
                            url={src.url}
                            content={src.content}
                            relevance={src.relevance}
                            variant="compact"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Streaming or static response */}
                  {msg.streaming ? (
                    <StreamingText.Root
                      text={msg.content}
                      speed={12}
                      chunkSize="word"
                      onDone={() => markDone(msg.id)}
                    >
                      <StreamingText.Content className="whitespace-pre-wrap" />
                      <StreamingText.Cursor />
                      <StreamingText.Toolbar>
                        <div className="flex items-center gap-3 flex-wrap">
                          <ConfidenceBadge level="high" />
                          <FeedbackBar.Root>
                            <FeedbackBar.ThumbsUp />
                            <FeedbackBar.ThumbsDown />
                            <FeedbackBar.Copy text={msg.content} />
                            <FeedbackBar.Regenerate />
                          </FeedbackBar.Root>
                        </div>
                      </StreamingText.Toolbar>
                    </StreamingText.Root>
                  ) : (
                    <>
                      <MarkdownRenderer content={msg.content} />

                      {/* Inline citation legend */}
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {SOURCES.map((src, i) => (
                          <CitationInline
                            key={i}
                            index={i + 1}
                            variant="pill"
                            sourceTitle={src.title}
                            href={src.url}
                            preview={src.content}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <ConfidenceBadge level="high" />
                        <FeedbackBar.Root>
                          <FeedbackBar.ThumbsUp />
                          <FeedbackBar.ThumbsDown />
                          <FeedbackBar.Copy text={msg.content} />
                          <FeedbackBar.Regenerate />
                        </FeedbackBar.Root>
                      </div>
                    </>
                  )}
                </div>
              </ChatThread.AssistantMessage>
            ),
          )}

          {/* Retrieving sources indicator */}
          {retrievingSources && (
            <div className="px-4 py-2">
              <StatusIndicator state="thinking" label="Retrieving sources..." />
            </div>
          )}

          {/* Thinking indicator (after sources retrieved) */}
          {isThinking && !retrievingSources && (
            <div className="px-4 py-2">
              <StatusIndicator state="thinking" label="Generating response..." />
            </div>
          )}

          <ChatThread.ScrollAnchor />
        </ChatThread.Messages>
      </ChatThread.Root>

      {/* ─── Prompt box ───────────────────────────────────────── */}
      <div
        className="border-t p-3"
        style={{
          borderColor: "var(--arclo-border, #e5e7eb)",
          backgroundColor: "var(--arclo-surface, #ffffff)",
        }}
      >
        <PromptBox.Root
          value={input}
          onValueChange={setInput}
          onSubmit={handleSubmit}
          isSubmitting={isThinking}
        >
          <PromptBox.Input placeholder="Ask a research question..." />
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
    </div>
  );
}
