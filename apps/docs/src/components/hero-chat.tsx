"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ChatThread,
  StreamingText,
  FeedbackBar,
  ThinkingBlock,
  ConfidenceBadge,
  StatusIndicator,
  PromptBox,
} from "@arc-lo/ui";

/* ─── Conversation script ────────────────────────────────────────── */

interface ScriptMessage {
  role: "user" | "assistant";
  text: string;
  thinking?: boolean;
  confidence?: "high" | "medium" | "low";
}

const SCRIPT: ScriptMessage[] = [
  { role: "user", text: "What is a design system?" },
  {
    role: "assistant",
    text: "A design system is a collection of reusable components, guidelines, and standards that help teams build consistent user interfaces efficiently. It serves as a single source of truth for design and development.",
  },
  { role: "user", text: "How does arclo differ from shadcn/ui?" },
  {
    role: "assistant",
    text: "arclo extends the shadcn/Radix model with AI-specific primitives — streaming text, thinking blocks, tool calls, confidence badges, and more. These are patterns every AI product needs but no general-purpose library provides.",
    confidence: "high",
  },
  { role: "user", text: "Can you show me a streaming example?" },
  {
    role: "assistant",
    text: "Sure! StreamingText renders tokens progressively with a cursor animation. It supports 6 states: pending, streaming, done, interrupted, error, and ratelimit — each with distinct visual feedback.",
  },
  { role: "user", text: "What about tool use in agents?" },
  {
    role: "assistant",
    text: "The ToolCall component displays tool invocations with status indicators, collapsible inputs and outputs. Combined with ThinkingBlock for chain-of-thought, you get a complete agent UI.",
    thinking: true,
  },
  { role: "user", text: "Is it easy to theme?" },
  {
    role: "assistant",
    text: "Absolutely. arclo uses CSS custom properties for all colors. Override --arclo-accent, --arclo-surface, and a few others to match your brand. Light and dark modes work out of the box.",
  },
];

/* ─── Timing ─────────────────────────────────────────────────────── */

const TYPING_SPEED = 40; // ms per character for simulated typing
const THINKING_PAUSE = 800;
const TURN_PAUSE = 1000;
const RESTART_PAUSE = 3000;
const STREAM_SPEED = 25;

/* ─── Types ──────────────────────────────────────────────────────── */

interface DisplayedMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  streaming: boolean;
  thinking?: boolean;
  confidence?: "high" | "medium" | "low";
}

/* ─── Avatars ────────────────────────────────────────────────────── */

function UserAvatar() {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
      style={{
        backgroundColor: "var(--arclo-surface-secondary, #f9fafb)",
        color: "var(--arclo-text-secondary, #6b7280)",
        border: "1px solid var(--arclo-border, #e5e7eb)",
      }}
    >
      U
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
      style={{ backgroundColor: "var(--arclo-accent, #1a1a1a)", color: "var(--arclo-accent-fg, #ffffff)" }}
    >
      A
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */

export function HeroChat() {
  const [messages, setMessages] = useState<DisplayedMessage[]>([]);
  const [showThinking, setShowThinking] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scriptIdx = useRef(0);
  const msgId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const later = useCallback(
    (fn: () => void, ms: number) => {
      clear();
      timer.current = setTimeout(() => {
        if (mounted.current) fn();
      }, ms);
    },
    [clear],
  );

  /* Simulate typing a user message character by character */
  const typeUserMessage = useCallback(
    (text: string, onDone: () => void) => {
      setIsTyping(true);
      setTypingText("");
      let i = 0;

      const tick = () => {
        if (!mounted.current) return;
        if (i < text.length) {
          i++;
          setTypingText(text.slice(0, i));
          timer.current = setTimeout(tick, TYPING_SPEED);
        } else {
          // Brief pause then "send"
          timer.current = setTimeout(() => {
            if (!mounted.current) return;
            setIsTyping(false);
            setTypingText("");
            onDone();
          }, 300);
        }
      };
      tick();
    },
    [],
  );

  const handleStreamDone = useCallback(() => {
    if (!mounted.current) return;

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.streaming) {
        return [...prev.slice(0, -1), { ...last, streaming: false }];
      }
      return prev;
    });

    const next = scriptIdx.current;
    if (next < SCRIPT.length) {
      later(() => playNext(), TURN_PAUSE);
    } else {
      later(() => {
        setMessages([]);
        scriptIdx.current = 0;
        msgId.current = 0;
        later(() => playNext(), 500);
      }, RESTART_PAUSE);
    }
  }, [later]);

  const playNext = useCallback(() => {
    if (!mounted.current) return;

    const idx = scriptIdx.current;
    if (idx >= SCRIPT.length) {
      later(() => {
        setMessages([]);
        scriptIdx.current = 0;
        msgId.current = 0;
        later(() => playNext(), 500);
      }, RESTART_PAUSE);
      return;
    }

    const entry = SCRIPT[idx];
    scriptIdx.current = idx + 1;
    const id = ++msgId.current;

    if (entry.role === "user") {
      // Type out the message in the prompt box, then add to chat
      typeUserMessage(entry.text, () => {
        setMessages((prev) => [
          ...prev,
          { id, role: "user", text: entry.text, streaming: false },
        ]);
        // Show thinking indicator, then play assistant
        later(() => {
          setShowThinking(true);
          later(() => {
            setShowThinking(false);
            playNext();
          }, THINKING_PAUSE);
        }, 300);
      });
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id,
          role: "assistant",
          text: entry.text,
          streaming: true,
          thinking: entry.thinking,
          confidence: entry.confidence,
        },
      ]);
    }
  }, [later, typeUserMessage]);

  useEffect(() => {
    mounted.current = true;
    later(() => playNext(), 800);
    return () => {
      mounted.current = false;
      clear();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="hero-chat-glow relative w-full overflow-hidden rounded-2xl flex flex-col"
      style={{
        height: 520,
        backgroundColor: "var(--arclo-surface, #ffffff)",
        border: "1px solid var(--arclo-border, #e5e7eb)",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 shrink-0"
        style={{
          borderBottom: "1px solid var(--arclo-border, #e5e7eb)",
          backgroundColor: "var(--arclo-surface-secondary, #f9fafb)",
        }}
      >
        <span
          className="live-dot inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--arclo-accent, #1a1a1a)" }}
        />
        <span
          className="text-xs font-medium tracking-wide uppercase"
          style={{ color: "var(--arclo-text-muted, #9ca3af)" }}
        >
          Live demo
        </span>
      </div>

      {/* Chat messages */}
      <ChatThread.Root className="flex-1 min-h-0">
        <ChatThread.Messages className="h-full">
          {messages.map((msg) =>
            msg.role === "user" ? (
              <ChatThread.UserMessage key={msg.id} avatar={<UserAvatar />}>
                {msg.text}
              </ChatThread.UserMessage>
            ) : (
              <ChatThread.AssistantMessage
                key={msg.id}
                avatar={<AssistantAvatar />}
              >
                <div className="space-y-2">
                  {msg.thinking && (
                    <ThinkingBlock.Root
                      state="done"
                      defaultOpen={false}
                      duration={2.4}
                    >
                      <ThinkingBlock.Trigger />
                      <ThinkingBlock.Content>
                        <p
                          className="text-sm"
                          style={{
                            color: "var(--arclo-text-secondary, #6b7280)",
                          }}
                        >
                          Analyzing component architecture and comparing
                          patterns for tool use in agent interfaces...
                        </p>
                      </ThinkingBlock.Content>
                    </ThinkingBlock.Root>
                  )}

                  {msg.streaming ? (
                    <StreamingText.Root
                      text={msg.text}
                      speed={STREAM_SPEED}
                      chunkSize="word"
                      onDone={handleStreamDone}
                    >
                      <StreamingText.Content />
                      <StreamingText.Cursor />
                    </StreamingText.Root>
                  ) : (
                    <span>{msg.text}</span>
                  )}

                  {msg.confidence && !msg.streaming && (
                    <div className="mt-2">
                      <ConfidenceBadge level={msg.confidence} />
                    </div>
                  )}

                  {!msg.streaming && (
                    <FeedbackBar.Root>
                      <FeedbackBar.ThumbsUp />
                      <FeedbackBar.ThumbsDown />
                      <FeedbackBar.Copy />
                    </FeedbackBar.Root>
                  )}
                </div>
              </ChatThread.AssistantMessage>
            ),
          )}

          {showThinking && (
            <div className="flex items-center gap-3 pl-10">
              <StatusIndicator state="thinking" />
            </div>
          )}

          <ChatThread.ScrollAnchor />
        </ChatThread.Messages>
      </ChatThread.Root>

      {/* Simulated prompt box */}
      <div
        className="shrink-0 border-t p-3"
        style={{
          borderColor: "var(--arclo-border, #e5e7eb)",
          backgroundColor: "var(--arclo-surface, #ffffff)",
        }}
      >
        <PromptBox.Root value={typingText} isSubmitting={false}>
          <PromptBox.Input
            placeholder="Type a message..."
            readOnly
          />
          <PromptBox.Footer>
            <span
              className="text-xs"
              style={{ color: "var(--arclo-text-muted, #9ca3af)" }}
            >
              {isTyping ? "Typing..." : "Enter to send"}
            </span>
            <PromptBox.SubmitButton />
          </PromptBox.Footer>
        </PromptBox.Root>
      </div>
    </div>
  );
}
