"use client";

import { useState, useCallback } from "react";
import { StreamingText, FeedbackBar } from "@arclo/react";
import { DemoWrapper } from "../demo-wrapper";

const sampleTexts = [
  "The transformer architecture revolutionized natural language processing by introducing self-attention mechanisms. Unlike recurrent neural networks, transformers process all tokens in parallel, enabling much faster training on modern hardware.\n\nThis breakthrough led to models like GPT, BERT, and Claude — each pushing the boundaries of what AI systems can understand and generate.",
  "Here are three principles for building great AI products:\n\n1. Design for uncertainty — AI outputs are non-deterministic. Your UI must communicate confidence levels.\n\n2. Make feedback loops first-class — thumbs up/down, regenerate, and edit are how users teach the product what \"good\" means.\n\n3. Stream everything — waiting 10 seconds for a wall of text is terrible UX. Token-by-token rendering feels alive.",
  "function useStreamingText(options: StreamingOptions) {\n  const [state, setState] = useState<StreamingState>(\"pending\");\n  const [text, setText] = useState(\"\");\n  \n  // Buffer incoming tokens and drain them\n  // at a controlled speed for smooth animation\n  const bufferRef = useRef<string[]>([]);\n  \n  return { text, state, interrupt, reset };\n}",
];

const liveCode = `<StreamingText.Root text={sampleText} speed={20} chunkSize="char">
  <StreamingText.Skeleton lines={3} />
  <StreamingText.Content />
  <StreamingText.Cursor />
  <StreamingText.Stop />
  <StreamingText.ErrorFallback message="Something went wrong." />
  <StreamingText.Toolbar>
    <FeedbackBar.Root onFeedback={(v) => console.log(v)}>
      <FeedbackBar.ThumbsUp />
      <FeedbackBar.ThumbsDown />
      <FeedbackBar.Copy />
      <FeedbackBar.Regenerate onRegenerate={restart} />
    </FeedbackBar.Root>
  </StreamingText.Toolbar>
</StreamingText.Root>`;

export function StreamingTextBasicDemo() {
  const [activeText, setActiveText] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  const [selectedText, setSelectedText] = useState(0);

  const start = useCallback(() => {
    setActiveText(null);
    setKey((k) => k + 1);
    setTimeout(() => setActiveText(sampleTexts[selectedText]), 0);
  }, [selectedText]);

  return (
    <DemoWrapper title="StreamingText — Live Demo" code={liveCode}>
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {["Prose", "List", "Code"].map((label, i) => (
            <button
              key={label}
              onClick={() => setSelectedText(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                selectedText === i
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={start}
            className="rounded-full bg-[#6C5CE7] px-4 py-1 text-xs font-medium text-white hover:bg-[#5A4BD1] cursor-pointer"
          >
            {activeText != null ? "Restart" : "Start streaming"}
          </button>
        </div>

        <div className="min-h-[120px] rounded-lg bg-gray-50 p-4" data-arclo-copyable>
          {activeText != null ? (
            <StreamingText.Root
              key={key}
              text={activeText}
              speed={20}
              chunkSize="char"
            >
              <StreamingText.Skeleton lines={3} />
              <StreamingText.Content className={`text-sm leading-relaxed ${selectedText === 2 ? "font-mono text-xs" : ""}`} />
              <StreamingText.Cursor />
              <StreamingText.Stop />
              <StreamingText.ErrorFallback message="Something went wrong." />
              <StreamingText.Toolbar>
                <FeedbackBar.Root onFeedback={(v) => console.log("Feedback:", v)}>
                  <FeedbackBar.ThumbsUp />
                  <FeedbackBar.ThumbsDown />
                  <FeedbackBar.Copy />
                  <FeedbackBar.Regenerate onRegenerate={start} />
                </FeedbackBar.Root>
              </StreamingText.Toolbar>
            </StreamingText.Root>
          ) : (
            <p className="text-sm text-gray-400">
              Pick a content type and click &quot;Start streaming&quot;
            </p>
          )}
        </div>
      </div>
    </DemoWrapper>
  );
}

export function StreamingTextStatesDemo() {
  const [state, setState] = useState<string>("pending");

  return (
    <DemoWrapper title="StreamingText — All 6 States">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {["pending", "streaming", "done", "interrupted", "error", "ratelimit"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setState(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  state === s
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ),
          )}
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          {state === "pending" && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-4 rounded bg-gray-200 animate-pulse ${i === 3 ? "w-2/3" : "w-full"}`}
                />
              ))}
            </div>
          )}
          {state === "streaming" && (
            <p className="text-sm">
              The transformer architecture revolutionized natural language
              processing by introducing self-attention
              <span className="inline-block animate-pulse">▋</span>
            </p>
          )}
          {state === "done" && (
            <div>
              <p className="text-sm">
                The transformer architecture revolutionized natural language
                processing by introducing self-attention mechanisms.
              </p>
              <div className="mt-3 flex gap-1">
                <span className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 cursor-pointer text-xs">👍</span>
                <span className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 cursor-pointer text-xs">👎</span>
                <span className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 cursor-pointer text-xs">📋</span>
              </div>
            </div>
          )}
          {state === "interrupted" && (
            <div>
              <p className="text-sm text-gray-600">
                The transformer architecture revolutionized natural—
              </p>
              <p className="mt-2 text-xs text-gray-400 italic">
                Generation stopped by user
              </p>
            </div>
          )}
          {state === "error" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p>Something went wrong.</p>
              <button className="mt-2 text-red-600 underline hover:text-red-800 cursor-pointer">
                Try again
              </button>
            </div>
          )}
          {state === "ratelimit" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p>Rate limit reached. Please wait.</p>
              <p className="mt-1 text-amber-600">Retry in 30s</p>
            </div>
          )}
        </div>
      </div>
    </DemoWrapper>
  );
}
