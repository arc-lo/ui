"use client";

import { useState, useCallback } from "react";
import {
  ChatThread,
  StreamingText,
  ThinkingBlock,
  ToolCall,
  FeedbackBar,
} from "@arclo/react";
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
