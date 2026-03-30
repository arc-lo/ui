"use client";

import { useState, useCallback } from "react";
import {
  ChatThread,
  StreamingText,
  ThinkingBlock,
  ToolCall,
  FeedbackBar,
} from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const assistantResponse =
  "Based on my analysis, the Fibonacci sequence implementation can be optimized using memoization. Here's the key insight: by caching previously computed values, we reduce the time complexity from O(2^n) to O(n).\n\nThis is a significant improvement for large inputs.";

const liveCode = `<ChatThread.Root>
  <ChatThread.Messages>
    <ChatThread.SystemMessage>
      Today's conversation — Claude 3.5 Sonnet
    </ChatThread.SystemMessage>

    <ChatThread.UserMessage name="You" timestamp="2:34 PM">
      Can you optimize this Fibonacci function?
    </ChatThread.UserMessage>

    <ChatThread.AssistantMessage name="Claude" timestamp="2:34 PM">
      <ThinkingBlock.Root state="done">
        <ThinkingBlock.Trigger>Reasoning</ThinkingBlock.Trigger>
        <ThinkingBlock.Content>Analyzing complexity...</ThinkingBlock.Content>
      </ThinkingBlock.Root>
      <ToolCall.Root name="analyze_code" status="done">...</ToolCall.Root>
      <StreamingText.Root text={response} speed={20} chunkSize="char">
        <StreamingText.Content />
        <StreamingText.Cursor />
      </StreamingText.Root>
      <FeedbackBar.Root onFeedback={console.log}>
        <FeedbackBar.ThumbsUp />
        <FeedbackBar.ThumbsDown />
        <FeedbackBar.Copy />
      </FeedbackBar.Root>
    </ChatThread.AssistantMessage>

    <ChatThread.ScrollAnchor />
  </ChatThread.Messages>
</ChatThread.Root>`;

export function ChatThreadDemo() {
  const [started, setStarted] = useState(false);
  const [key, setKey] = useState(0);

  const start = useCallback(() => {
    setStarted(false);
    setKey((k) => k + 1);
    setTimeout(() => setStarted(true), 0);
  }, []);

  return (
    <DemoWrapper title="ChatThread — Live Demo" code={liveCode}>
      <div className="space-y-4">
        <button
          onClick={start}
          className="rounded-full bg-[#6C5CE7] px-4 py-1 text-xs font-medium text-white hover:bg-[#5A4BD1] cursor-pointer"
        >
          {started ? "Restart" : "Start conversation"}
        </button>

        <div
          className="rounded-lg border overflow-hidden"
          style={{
            borderColor: "var(--arclo-border, #e5e7eb)",
            backgroundColor: "var(--arclo-surface, #ffffff)",
          }}
        >
          <ChatThread.Root className="h-[480px]">
            <ChatThread.Messages>
              {/* System message */}
              <ChatThread.SystemMessage>
                Today&apos;s conversation — Claude 3.5 Sonnet
              </ChatThread.SystemMessage>

              {/* User message */}
              <ChatThread.UserMessage
                name="You"
                timestamp="2:34 PM"
                avatar={
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: "var(--docs-code-bg)", color: "var(--docs-body)" }}
                  >
                    Y
                  </div>
                }
              >
                Can you optimize this Fibonacci function? It&apos;s running really
                slow for large inputs.
              </ChatThread.UserMessage>

              {/* Assistant message with all the bells and whistles */}
              {started && (
                <ChatThread.AssistantMessage
                  key={key}
                  name="Claude"
                  timestamp="2:34 PM"
                  avatar={
                    <div className="w-7 h-7 rounded-full bg-[#6C5CE7] flex items-center justify-center text-xs font-bold text-white">
                      C
                    </div>
                  }
                >
                  <div className="space-y-3">
                    {/* Thinking block */}
                    <ThinkingBlock.Root state="done" duration={2} collapseOnDone={false}>
                      <ThinkingBlock.Trigger>Analyzing code complexity</ThinkingBlock.Trigger>
                      <ThinkingBlock.Content>
                        The user has a recursive Fibonacci implementation. The naive
                        recursive approach has O(2^n) time complexity because it
                        recomputes the same subproblems many times. I should suggest
                        memoization or an iterative approach.
                      </ThinkingBlock.Content>
                    </ThinkingBlock.Root>

                    {/* Tool call */}
                    <ToolCall.Root
                      toolName="analyze_code"
                      status="success"
                      defaultOpen
                    >
                      <ToolCall.Header />
                      <ToolCall.Input>
                        {JSON.stringify(
                          { language: "python", function: "fibonacci" },
                          null,
                          2,
                        )}
                      </ToolCall.Input>
                      <ToolCall.Output>
                        {JSON.stringify(
                          {
                            complexity: "O(2^n)",
                            suggestion: "memoization",
                          },
                          null,
                          2,
                        )}
                      </ToolCall.Output>
                    </ToolCall.Root>

                    {/* Streaming response */}
                    <StreamingText.Root
                      text={assistantResponse}
                      speed={20}
                      chunkSize="char"
                    >
                      <StreamingText.Content />
                      <StreamingText.Cursor />
                      <StreamingText.Toolbar>
                        <FeedbackBar.Root
                          onFeedback={(v) => console.log("Feedback:", v)}
                        >
                          <FeedbackBar.ThumbsUp />
                          <FeedbackBar.ThumbsDown />
                          <FeedbackBar.Copy />
                        </FeedbackBar.Root>
                      </StreamingText.Toolbar>
                    </StreamingText.Root>
                  </div>
                </ChatThread.AssistantMessage>
              )}

              {!started && (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-gray-400">
                    Click &quot;Start conversation&quot; to see the assistant reply
                  </p>
                </div>
              )}

              <ChatThread.ScrollAnchor />
            </ChatThread.Messages>
          </ChatThread.Root>
        </div>
      </div>
    </DemoWrapper>
  );
}

const avatarCode = `{/* Image avatar */}
<ChatThread.Avatar src="/bot.png" />

{/* Initials with custom color */}
<ChatThread.Avatar initials="AI" color="#6C5CE7" textColor="#fff" />

{/* Custom icon */}
<ChatThread.Avatar icon={<BotIcon />} color="#10b981" />

{/* Different sizes */}
<ChatThread.Avatar initials="SM" size={24} />
<ChatThread.Avatar initials="LG" size={40} />

{/* Usage in messages */}
<ChatThread.UserMessage
  name="You"
  avatar={<ChatThread.Avatar initials="Y" color="#e5e7eb" textColor="#374151" />}
>
  Hello!
</ChatThread.UserMessage>

<ChatThread.AssistantMessage
  name="Claude"
  avatar={<ChatThread.Avatar initials="C" color="#6C5CE7" />}
>
  Hi there!
</ChatThread.AssistantMessage>`;

export function ChatThreadAvatarDemo() {
  return (
    <DemoWrapper title="ChatThread.Avatar — Variants" code={avatarCode}>
      <div className="space-y-6">
        {/* Avatar variants */}
        <div>
          <p
            className="mb-3 text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--docs-muted)" }}
          >
            Avatar styles
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-col items-center gap-1">
              <ChatThread.Avatar initials="AI" />
              <span className="text-[10px]" style={{ color: "var(--docs-muted)" }}>Initials</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ChatThread.Avatar initials="C" color="#6C5CE7" textColor="#fff" />
              <span className="text-[10px]" style={{ color: "var(--docs-muted)" }}>Custom color</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ChatThread.Avatar initials="O" color="#0ea5e9" textColor="#fff" />
              <span className="text-[10px]" style={{ color: "var(--docs-muted)" }}>Ocean</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ChatThread.Avatar initials="F" color="#10b981" textColor="#fff" />
              <span className="text-[10px]" style={{ color: "var(--docs-muted)" }}>Forest</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ChatThread.Avatar initials="S" color="#f97316" textColor="#fff" />
              <span className="text-[10px]" style={{ color: "var(--docs-muted)" }}>Sunset</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ChatThread.Avatar
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8V4H8" /><rect x="8" y="8" width="8" height="8" rx="1" /><path d="M12 16v4h4" />
                  </svg>
                }
                color="#f43f5e"
                textColor="#fff"
              />
              <span className="text-[10px]" style={{ color: "var(--docs-muted)" }}>Icon</span>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p
            className="mb-3 text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--docs-muted)" }}
          >
            Sizes
          </p>
          <div className="flex items-end gap-3">
            <div className="flex flex-col items-center gap-1">
              <ChatThread.Avatar initials="S" size={20} />
              <span className="text-[10px]" style={{ color: "var(--docs-muted)" }}>20</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ChatThread.Avatar initials="M" size={28} />
              <span className="text-[10px]" style={{ color: "var(--docs-muted)" }}>28</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ChatThread.Avatar initials="L" size={36} />
              <span className="text-[10px]" style={{ color: "var(--docs-muted)" }}>36</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ChatThread.Avatar initials="XL" size={48} />
              <span className="text-[10px]" style={{ color: "var(--docs-muted)" }}>48</span>
            </div>
          </div>
        </div>

        {/* In context */}
        <div>
          <p
            className="mb-3 text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--docs-muted)" }}
          >
            In conversation
          </p>
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              borderColor: "var(--arclo-border, #e5e7eb)",
              backgroundColor: "var(--arclo-surface, #ffffff)",
            }}
          >
            <ChatThread.Root>
              <ChatThread.Messages>
                <ChatThread.UserMessage
                  name="You"
                  avatar={
                    <ChatThread.Avatar
                      initials="Y"
                      color="var(--arclo-surface-secondary, #f3f4f6)"
                      textColor="var(--arclo-text-secondary, #4b5563)"
                    />
                  }
                >
                  What models do you support?
                </ChatThread.UserMessage>
                <ChatThread.AssistantMessage
                  name="Claude"
                  avatar={<ChatThread.Avatar initials="C" color="#6C5CE7" textColor="#fff" />}
                >
                  I support Claude Sonnet, Opus, and Haiku — each optimized for different use cases.
                </ChatThread.AssistantMessage>
                <ChatThread.AssistantMessage
                  name="GPT-4"
                  avatar={<ChatThread.Avatar initials="G" color="#10b981" textColor="#fff" />}
                >
                  I&apos;m GPT-4, trained by OpenAI. I excel at reasoning and creative tasks.
                </ChatThread.AssistantMessage>
              </ChatThread.Messages>
            </ChatThread.Root>
          </div>
        </div>
      </div>
    </DemoWrapper>
  );
}
