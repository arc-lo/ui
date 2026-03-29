"use client";

import { useState, useEffect, useCallback } from "react";
import { ThinkingBlock } from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const liveCode = `<ThinkingBlock.Root state={state} duration={duration} collapseOnDone>
  <ThinkingBlock.Trigger />
  <ThinkingBlock.Content>
    <p className="text-sm italic text-gray-600">{thinkingText}</p>
  </ThinkingBlock.Content>
</ThinkingBlock.Root>`;

const thinkingSteps = [
  "Let me analyze this question...",
  "First, I need to consider the key factors involved.",
  "Looking at the available data, there are several patterns worth noting.",
  "The most relevant approach would be to compare historical trends with current metrics.",
  "Based on this analysis, I can now form a comprehensive answer.",
];

export function ThinkingBlockDemo() {
  const [state, setState] = useState<"thinking" | "done" | "error">("done");
  const [content, setContent] = useState(thinkingSteps.join("\n\n"));
  const [duration, setDuration] = useState<number>(4);
  const [key, setKey] = useState(0);

  const simulate = useCallback(() => {
    setKey((k) => k + 1);
    setState("thinking");
    setContent("");
    setDuration(0);

    let step = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
      step++;
      setContent(thinkingSteps.slice(0, step).join("\n\n"));
      setDuration(Math.round((Date.now() - startTime) / 1000));

      if (step >= thinkingSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDuration(Math.round((Date.now() - startTime) / 1000));
          setState("done");
        }, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <DemoWrapper title="ThinkingBlock — Live Demo" code={liveCode}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={simulate}
            className="rounded-full bg-[#6C5CE7] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#5A4BD1] cursor-pointer"
          >
            Simulate thinking
          </button>
          <button
            onClick={() => setState("error")}
            className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 cursor-pointer"
          >
            Trigger error
          </button>
        </div>

        <ThinkingBlock.Root
          key={key}
          state={state}
          duration={duration}
          collapseOnDone
        >
          <ThinkingBlock.Trigger />
          <ThinkingBlock.Content>
            {content ? (
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line italic">
                {content}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Starting analysis...
              </p>
            )}
          </ThinkingBlock.Content>
        </ThinkingBlock.Root>
      </div>
    </DemoWrapper>
  );
}

export function ThinkingBlockStatesDemo() {
  const [state, setState] = useState<"thinking" | "done" | "error">("thinking");

  return (
    <DemoWrapper title="ThinkingBlock — All States">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["thinking", "done", "error"] as const).map((s) => (
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
          ))}
        </div>

        <ThinkingBlock.Root
          state={state}
          duration={state === "done" ? 4 : null}
          defaultOpen
          collapseOnDone={false}
        >
          <ThinkingBlock.Trigger />
          <ThinkingBlock.Content>
            <p className="text-sm leading-relaxed text-gray-600 italic">
              {state === "thinking" && "Analyzing the request and considering multiple approaches..."}
              {state === "done" && "The analysis is complete. I considered three approaches and determined that the most efficient solution involves using a hash map for O(1) lookups combined with a sliding window technique."}
              {state === "error" && "An error occurred during reasoning. The context window was exceeded."}
            </p>
          </ThinkingBlock.Content>
        </ThinkingBlock.Root>
      </div>
    </DemoWrapper>
  );
}
