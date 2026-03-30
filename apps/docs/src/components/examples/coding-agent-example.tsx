"use client";

import { useState, useCallback, useRef } from "react";
import {
  ChatThread,
  StreamingText,
  PromptBox,
  FeedbackBar,
  ThinkingBlock,
  ToolCall,
  CodeBlock,
  TokenUsage,
  ModelSelector,
  type ModelOption,
} from "@arc-lo/ui";

/* ─── Models ─────────────────────────────────────────────────────── */

const MODELS: ModelOption[] = [
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    description: "Fast and capable for most coding tasks",
    badge: "Fast",
  },
  {
    id: "claude-opus",
    name: "Claude Opus",
    description: "Most powerful for complex reasoning",
    badge: "New",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "OpenAI flagship model",
  },
];

/* ─── Sample data ────────────────────────────────────────────────── */

const THINKING_TEXT = `The user is reporting a JWT validation bug in their auth middleware. Let me think through the common issues:

1. The middleware might not be verifying the token signature correctly
2. Token expiration checks could be missing or improperly configured
3. The issuer/audience claims might not be validated
4. The secret key could be loaded incorrectly

I should read the current middleware file first, then identify the specific bug and propose a fix.`;

const READ_FILE_INPUT = `{
  "path": "src/middleware/auth.ts"
}`;

const READ_FILE_OUTPUT = `export function validateToken(token: string) {
  const decoded = jwt.decode(token);
  // BUG: using decode() instead of verify()
  // This does NOT validate the signature!
  if (!decoded) return null;
  return decoded;
}`;

const EDIT_FILE_INPUT = `{
  "path": "src/middleware/auth.ts",
  "old_string": "const decoded = jwt.decode(token);",
  "new_string": "const decoded = jwt.verify(token, process.env.JWT_SECRET);"
}`;

const EDIT_FILE_OUTPUT = `File edited successfully.
- src/middleware/auth.ts: 1 replacement made`;

const RESPONSE_TEXT = `I found and fixed the bug in your auth middleware. The issue was that \`jwt.decode()\` was being used instead of \`jwt.verify()\`.

**The problem:** \`jwt.decode()\` only parses the token payload without checking the cryptographic signature. This means any forged token would be accepted as valid.

**The fix:** Replaced it with \`jwt.verify(token, process.env.JWT_SECRET)\` which properly validates the signature, expiration, and claims against your secret key.

I also added proper error handling for expired and malformed tokens.`;

const FIXED_CODE = `import jwt from "jsonwebtoken";

export function validateToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: process.env.JWT_ISSUER,
    });
    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AuthError("Token has expired", 401);
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new AuthError("Invalid token", 401);
    }
    throw err;
  }
}`;

/* ─── Types ──────────────────────────────────────────────────────── */

type Phase =
  | "idle"
  | "thinking"
  | "tool-read"
  | "tool-edit"
  | "streaming"
  | "done";

/* ─── Component ──────────────────────────────────────────────────── */

export function CodingAgentExample() {
  const [model, setModel] = useState("claude-sonnet");
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [userMessage, setUserMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const runSimulation = useCallback((text: string) => {
    if (!text.trim()) return;
    setUserMessage(text.trim());
    setInput("");
    setPhase("thinking");

    // thinking -> tool-read
    timerRef.current = setTimeout(() => {
      setPhase("tool-read");

      // tool-read -> tool-edit
      timerRef.current = setTimeout(() => {
        setPhase("tool-edit");

        // tool-edit -> streaming
        timerRef.current = setTimeout(() => {
          setPhase("streaming");
        }, 1200);
      }, 1000);
    }, 2000);
  }, []);

  const handleSubmit = useCallback(
    (text: string) => {
      if (phase !== "idle" && phase !== "done") return;
      runSimulation(text);
    },
    [phase, runSimulation],
  );

  const isSubmitting = phase !== "idle" && phase !== "done";
  const showConversation = phase !== "idle";

  return (
    <div
      className="h-[600px] flex flex-col rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--arclo-border, #e5e7eb)",
        backgroundColor: "var(--arclo-surface, #ffffff)",
      }}
    >
      {/* ─── Model selector header ───────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          borderColor: "var(--arclo-border, #e5e7eb)",
          backgroundColor: "var(--arclo-surface-secondary, #f9fafb)",
        }}
      >
        <ModelSelector
          models={MODELS}
          value={model}
          onChange={setModel}
        />
        {phase === "done" && (
          <TokenUsage
            inputTokens={3842}
            outputTokens={1256}
            maxTokens={200000}
            cost={0.0187}
            className="max-w-xs"
          />
        )}
      </div>

      {/* ─── Chat area ───────────────────────────────────────────── */}
      <ChatThread.Root className="flex-1 min-h-0">
        <ChatThread.Messages>
          {/* Empty state */}
          {!showConversation && (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: "var(--arclo-accent, #1a1a1a)", color: "var(--arclo-accent-fg, #ffffff)" }}
              >
                A
              </div>
              <div className="text-center">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--arclo-text, #1a1a1a)" }}
                >
                  Coding Agent
                </h2>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--arclo-text-muted, #9ca3af)" }}
                >
                  I can read, write, and fix code across your project.
                </p>
              </div>
            </div>
          )}

          {/* User message */}
          {showConversation && (
            <ChatThread.UserMessage
              name="You"
              avatar={
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: "var(--arclo-surface-secondary, #f3f4f6)",
                    color: "var(--arclo-text-secondary, #4b5563)",
                  }}
                >
                  Y
                </div>
              }
            >
              {userMessage}
            </ChatThread.UserMessage>
          )}

          {/* Agent response */}
          {showConversation && (
            <ChatThread.AssistantMessage
              name="Agent"
              avatar={
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "var(--arclo-accent, #1a1a1a)", color: "var(--arclo-accent-fg, #ffffff)" }}
                >
                  A
                </div>
              }
            >
              <div className="space-y-3">
                {/* Thinking block */}
                <ThinkingBlock.Root
                  state={phase === "thinking" ? "thinking" : "done"}
                  duration={phase === "thinking" ? undefined : 2}
                  collapseOnDone
                  defaultOpen
                >
                  <ThinkingBlock.Trigger />
                  <ThinkingBlock.Content>
                    <p
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: "var(--arclo-text-secondary, #4b5563)" }}
                    >
                      {THINKING_TEXT}
                    </p>
                  </ThinkingBlock.Content>
                </ThinkingBlock.Root>

                {/* Tool call: read_file */}
                {(phase === "tool-read" ||
                  phase === "tool-edit" ||
                  phase === "streaming" ||
                  phase === "done") && (
                  <ToolCall.Root
                    toolName="read_file"
                    status={phase === "tool-read" ? "running" : "success"}
                    defaultOpen={phase === "tool-read"}
                  >
                    <ToolCall.Header />
                    <ToolCall.Input>{READ_FILE_INPUT}</ToolCall.Input>
                    <ToolCall.Output>{READ_FILE_OUTPUT}</ToolCall.Output>
                  </ToolCall.Root>
                )}

                {/* Tool call: edit_file */}
                {(phase === "tool-edit" ||
                  phase === "streaming" ||
                  phase === "done") && (
                  <ToolCall.Root
                    toolName="edit_file"
                    status={phase === "tool-edit" ? "running" : "success"}
                    defaultOpen={phase === "tool-edit"}
                  >
                    <ToolCall.Header />
                    <ToolCall.Input>{EDIT_FILE_INPUT}</ToolCall.Input>
                    <ToolCall.Output>{EDIT_FILE_OUTPUT}</ToolCall.Output>
                  </ToolCall.Root>
                )}

                {/* Streaming response */}
                {(phase === "streaming" || phase === "done") && (
                  <>
                    {phase === "streaming" ? (
                      <StreamingText.Root
                        text={RESPONSE_TEXT}
                        speed={12}
                        chunkSize="word"
                        onDone={() => setPhase("done")}
                      >
                        <StreamingText.Content className="whitespace-pre-wrap text-sm" />
                        <StreamingText.Cursor />
                      </StreamingText.Root>
                    ) : (
                      <div
                        className="whitespace-pre-wrap text-sm"
                        style={{ color: "var(--arclo-text, #1a1a1a)" }}
                      >
                        {RESPONSE_TEXT}
                      </div>
                    )}
                  </>
                )}

                {/* Code block */}
                {phase === "done" && (
                  <CodeBlock
                    code={FIXED_CODE}
                    language="typescript"
                    showLineNumbers
                  />
                )}

                {/* Feedback bar */}
                {phase === "done" && (
                  <FeedbackBar.Root>
                    <FeedbackBar.ThumbsUp />
                    <FeedbackBar.ThumbsDown />
                    <FeedbackBar.Copy text={RESPONSE_TEXT} />
                    <FeedbackBar.Regenerate />
                  </FeedbackBar.Root>
                )}
              </div>
            </ChatThread.AssistantMessage>
          )}

          <ChatThread.ScrollAnchor />
        </ChatThread.Messages>
      </ChatThread.Root>

      {/* ─── Prompt box ──────────────────────────────────────────── */}
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
          isSubmitting={isSubmitting}
        >
          <PromptBox.Input placeholder="Describe what you want to build..." />
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
