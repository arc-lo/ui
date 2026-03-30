"use client";

import { useState, useCallback } from "react";
import {
  ChatThread,
  StreamingText,
  PromptBox,
  RefusalCard,
  ConfidenceBadge,
  StatusIndicator,
  ConversationBranch,
} from "@arc-lo/ui";

/* ─── Scenario data ─────────────────────────────────────────────── */

interface Turn {
  id: number;
  role: "user" | "assistant";
  content: string;
  streaming: boolean;
  confidence?: "high" | "medium" | "low";
  refusal?: {
    reason: string;
    type: "safety" | "capability" | "policy" | "context";
    suggestions: string[];
  };
  disclaimer?: string;
  /** Branch data for alternative responses */
  branches?: { contents: string[]; current: number };
}

const SCENARIOS: Record<string, Turn[]> = {
  safe: [
    {
      id: 1,
      role: "user",
      content: "What are some tips for writing clean code?",
      streaming: false,
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Here are some widely-accepted tips for writing clean code:\n\n1. **Use meaningful names** — variable and function names should reveal intent\n2. **Keep functions small** — each function should do one thing well\n3. **Write self-documenting code** — minimize comments by making code readable\n4. **Follow the DRY principle** — avoid duplicating logic across your codebase\n5. **Handle errors gracefully** — never swallow exceptions silently",
      streaming: true,
      confidence: "high",
    },
  ],
  refused: [
    {
      id: 3,
      role: "user",
      content: "Help me write a script that floods a website with fake traffic.",
      streaming: false,
    },
    {
      id: 4,
      role: "assistant",
      content: "",
      streaming: false,
      refusal: {
        reason:
          "I can't help with creating tools designed to disrupt or attack websites. This would constitute a denial-of-service attack, which is both unethical and illegal.",
        type: "safety",
        suggestions: [
          "How do I load-test my own website?",
          "What is rate limiting?",
          "How to protect against DDoS attacks?",
        ],
      },
      branches: {
        contents: [
          "I can't help with creating tools designed to disrupt or attack websites.",
          "Instead, I can help you learn about legitimate load testing tools like k6 or Apache JMeter that you can use on your own infrastructure.",
        ],
        current: 1,
      },
    },
  ],
  borderline: [
    {
      id: 5,
      role: "user",
      content:
        "Can you explain how social engineering attacks work so I can train my team?",
      streaming: false,
    },
    {
      id: 6,
      role: "assistant",
      content:
        "Social engineering attacks exploit human psychology rather than technical vulnerabilities. Common techniques include:\n\n- **Phishing** — deceptive emails that impersonate trusted entities\n- **Pretexting** — creating a fabricated scenario to gain trust\n- **Baiting** — offering something enticing to lure victims\n- **Tailgating** — physically following authorized personnel into restricted areas\n\nFor your security training, consider running simulated phishing exercises and teaching employees to verify requests through secondary channels.",
      streaming: true,
      confidence: "medium",
      disclaimer:
        "This information is provided for defensive security training purposes only. Always follow your organization's security policies.",
    },
  ],
};

/* ─── Component ──────────────────────────────────────────────────── */

export function ContentModeratorExample() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [branchIndex, setBranchIndex] = useState(1);

  const loadScenario = useCallback(
    (key: string) => {
      if (isAnalyzing) return;
      setIsAnalyzing(true);
      setBranchIndex(1);

      // Show the user message immediately
      const scenario = SCENARIOS[key];
      setTurns([{ ...scenario[0], streaming: false }]);

      // Simulate analysis delay then show assistant response
      setTimeout(() => {
        setTurns(scenario.map((t) => ({ ...t })));
        setIsAnalyzing(false);
      }, 1500);
    },
    [isAnalyzing],
  );

  const handleSubmit = useCallback(
    (text: string) => {
      if (!text.trim() || isAnalyzing) return;
      setInput("");
      setIsAnalyzing(true);
      setBranchIndex(1);

      const userTurn: Turn = {
        id: Date.now(),
        role: "user",
        content: text.trim(),
        streaming: false,
      };
      setTurns([userTurn]);

      // Default to a safe-style response for freeform input
      setTimeout(() => {
        const assistantTurn: Turn = {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I've analyzed your message and it appears to be a safe request. In a production system, this would be routed through a content classification pipeline before generating a full response.",
          streaming: true,
          confidence: "high",
        };
        setTurns([userTurn, assistantTurn]);
        setIsAnalyzing(false);
      }, 1500);
    },
    [isAnalyzing],
  );

  const markDone = useCallback((msgId: number) => {
    setTurns((prev) =>
      prev.map((t) => (t.id === msgId ? { ...t, streaming: false } : t)),
    );
  }, []);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setInput(suggestion);
      handleSubmit(suggestion);
    },
    [handleSubmit],
  );

  return (
    <div
      className="h-[600px] flex flex-col rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--arclo-border, #e5e7eb)",
        backgroundColor: "var(--arclo-surface, #ffffff)",
      }}
    >
      {/* ─── Preset scenario buttons ───────────────────────────── */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{
          borderColor: "var(--arclo-border, #e5e7eb)",
          backgroundColor: "var(--arclo-surface-secondary, #f9fafb)",
        }}
      >
        <span
          className="text-xs font-medium mr-1"
          style={{ color: "var(--arclo-text-secondary, #6b7280)" }}
        >
          Presets:
        </span>
        {[
          { key: "safe", label: "Safe question" },
          { key: "refused", label: "Refused request" },
          { key: "borderline", label: "Borderline query" },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => loadScenario(key)}
            disabled={isAnalyzing}
            className="rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer"
            style={{
              borderColor: "var(--arclo-border, #e5e7eb)",
              backgroundColor: "var(--arclo-surface, #ffffff)",
              color: "var(--arclo-text-secondary, #6b7280)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── Chat area ─────────────────────────────────────────── */}
      <ChatThread.Root className="flex-1 min-h-0">
        <ChatThread.Messages>
          {turns.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
              <span className="text-3xl">🛡</span>
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--docs-heading, #111)" }}
              >
                Content Moderator
              </h2>
              <p
                className="text-sm text-center max-w-sm"
                style={{ color: "var(--arclo-text-muted, #9ca3af)" }}
              >
                Test how the AI handles safe, refused, and borderline content.
                Pick a preset above or type your own message.
              </p>
            </div>
          )}

          {turns.map((turn) =>
            turn.role === "user" ? (
              <ChatThread.UserMessage
                key={turn.id}
                name="User"
                avatar={
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: "var(--docs-code-bg, #f3f4f6)",
                      color: "var(--docs-body, #4b5563)",
                    }}
                  >
                    U
                  </div>
                }
              >
                {turn.content}
              </ChatThread.UserMessage>
            ) : (
              <ChatThread.AssistantMessage
                key={turn.id}
                name="Moderator"
                avatar={
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: "var(--arclo-accent, #1a1a1a)", color: "var(--arclo-accent-fg, #ffffff)",
                    }}
                  >
                    M
                  </div>
                }
              >
                <div className="space-y-3">
                  {/* ── Refusal case ─────────────────────────────── */}
                  {turn.refusal ? (
                    <>
                      <RefusalCard
                        type={turn.refusal.type}
                        reason={turn.refusal.reason}
                        suggestions={turn.refusal.suggestions}
                        onSuggestionClick={handleSuggestionClick}
                      />
                      {turn.branches && (
                        <ConversationBranch
                          current={branchIndex}
                          total={turn.branches.contents.length}
                          onPrevious={() =>
                            setBranchIndex((i) => Math.max(1, i - 1))
                          }
                          onNext={() =>
                            setBranchIndex((i) =>
                              Math.min(turn.branches!.contents.length, i + 1),
                            )
                          }
                        />
                      )}
                    </>
                  ) : turn.streaming ? (
                    /* ── Streaming response ──────────────────────── */
                    <StreamingText.Root
                      text={turn.content}
                      speed={18}
                      chunkSize="word"
                      onDone={() => markDone(turn.id)}
                    >
                      <StreamingText.Content className="whitespace-pre-wrap" />
                      <StreamingText.Cursor />
                    </StreamingText.Root>
                  ) : (
                    /* ── Static response ─────────────────────────── */
                    <div className="whitespace-pre-wrap">{turn.content}</div>
                  )}

                  {/* ── Confidence badge ─────────────────────────── */}
                  {turn.confidence && (
                    <ConfidenceBadge level={turn.confidence} />
                  )}

                  {/* ── Disclaimer ───────────────────────────────── */}
                  {turn.disclaimer && (
                    <p
                      className="text-xs italic mt-2"
                      style={{
                        color: "var(--arclo-text-muted, #9ca3af)",
                      }}
                    >
                      {turn.disclaimer}
                    </p>
                  )}
                </div>
              </ChatThread.AssistantMessage>
            ),
          )}

          {/* Analyzing indicator */}
          {isAnalyzing && (
            <div className="px-4 py-2">
              <StatusIndicator state="thinking" label="Analyzing content..." />
            </div>
          )}

          <ChatThread.ScrollAnchor />
        </ChatThread.Messages>
      </ChatThread.Root>

      {/* ─── Prompt box ────────────────────────────────────────── */}
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
          isSubmitting={isAnalyzing}
        >
          <PromptBox.Input placeholder="Type a message to test moderation..." />
          <PromptBox.Footer>
            <span
              className="text-xs"
              style={{ color: "var(--arclo-text-muted, #9ca3af)" }}
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
