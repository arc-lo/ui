"use client";

import { useState, useCallback, useRef } from "react";
import {
  ChatThread,
  StreamingText,
  FeedbackBar,
  PromptBox,
  SuggestTopics,
  TopicCard,
  StatusIndicator,
} from "@arc-lo/ui";

/* ─── Hardcoded responses ────────────────────────────────────────── */

const RESPONSES = [
  "The transformer architecture revolutionized NLP by introducing self-attention mechanisms. Unlike RNNs, transformers process all tokens in parallel, enabling much faster training.\n\nThis breakthrough led to models like GPT, BERT, and Claude.",
  "Here are three key principles for AI product design:\n\n1. **Design for uncertainty** — AI outputs are non-deterministic\n2. **Make feedback loops first-class** — thumbs up/down teach the product\n3. **Stream everything** — waiting for a wall of text is terrible UX",
  "Machine learning models learn patterns from data through iterative optimization. The training process involves:\n\n- Forward pass: computing predictions\n- Loss calculation: measuring error\n- Backpropagation: computing gradients\n- Parameter update: adjusting weights",
];

/* ─── Types ──────────────────────────────────────────────────────── */

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  /** For assistant messages: whether it is still streaming */
  streaming: boolean;
}

/* ─── Component ──────────────────────────────────────────────────── */

export function SimpleChatbotExample() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const responseIdx = useRef(0);
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

      // Simulate a short "thinking" delay then stream a response
      setTimeout(() => {
        const responseText = RESPONSES[responseIdx.current % RESPONSES.length];
        responseIdx.current++;

        const assistantMsg: Message = {
          id: nextId.current++,
          role: "assistant",
          content: responseText,
          streaming: true,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsThinking(false);
      }, 1200);
    },
    [isThinking],
  );

  const handleTopicSelect = useCallback(
    (title: string) => {
      handleSubmit(title);
    },
    [handleSubmit],
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
      {/* ─── Chat area ──────────────────────────────────────────── */}
      <ChatThread.Root className="flex-1 min-h-0">
        <ChatThread.Messages>
          {/* Empty state with suggested topics */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
              <div className="text-center">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--docs-heading, #111)" }}
                >
                  How can I help you?
                </h2>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--docs-muted, #9ca3af)" }}
                >
                  Ask a question or pick a topic below.
                </p>
              </div>

              <SuggestTopics columns={1} className="w-full max-w-md">
                <TopicCard
                  title="Explain transformer architecture"
                  description="How self-attention changed NLP"
                  icon={<span>🧠</span>}
                  onSelect={handleTopicSelect}
                />
                <TopicCard
                  title="AI product design principles"
                  description="Best practices for building AI UX"
                  icon={<span>🎨</span>}
                  onSelect={handleTopicSelect}
                />
                <TopicCard
                  title="How do ML models learn?"
                  description="Training loop fundamentals"
                  icon={<span>📊</span>}
                  onSelect={handleTopicSelect}
                />
              </SuggestTopics>
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
                name="Assistant"
                avatar={
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: "var(--arclo-accent, #1a1a1a)", color: "var(--arclo-accent-fg, #ffffff)",
                    }}
                  >
                    A
                  </div>
                }
              >
                <div className="space-y-2">
                  {msg.streaming ? (
                    <StreamingText.Root
                      text={msg.content}
                      speed={18}
                      chunkSize="word"
                      onDone={() => markDone(msg.id)}
                    >
                      <StreamingText.Content className="whitespace-pre-wrap" />
                      <StreamingText.Cursor />
                      <StreamingText.Toolbar>
                        <FeedbackBar.Root>
                          <FeedbackBar.ThumbsUp />
                          <FeedbackBar.ThumbsDown />
                          <FeedbackBar.Copy text={msg.content} />
                          <FeedbackBar.Regenerate />
                        </FeedbackBar.Root>
                      </StreamingText.Toolbar>
                    </StreamingText.Root>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <FeedbackBar.Root>
                        <FeedbackBar.ThumbsUp />
                        <FeedbackBar.ThumbsDown />
                        <FeedbackBar.Copy text={msg.content} />
                        <FeedbackBar.Regenerate />
                      </FeedbackBar.Root>
                    </>
                  )}
                </div>
              </ChatThread.AssistantMessage>
            ),
          )}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="px-4 py-2">
              <StatusIndicator state="thinking" />
            </div>
          )}

          <ChatThread.ScrollAnchor />
        </ChatThread.Messages>
      </ChatThread.Root>

      {/* ─── Prompt box ─────────────────────────────────────────── */}
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
          <PromptBox.Input placeholder="Type a message..." />
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
