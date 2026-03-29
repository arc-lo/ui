"use client";

import { useState } from "react";
import { FeedbackBar } from "@arclo/react";
import { DemoWrapper } from "../demo-wrapper";

const fullCode = `<FeedbackBar.Root onFeedback={(value) => trackFeedback(value)}>
  <FeedbackBar.ThumbsUp />
  <FeedbackBar.ThumbsDown />
  <FeedbackBar.Copy text={responseText} />
  <FeedbackBar.Regenerate onRegenerate={() => regenerate()} />
</FeedbackBar.Root>`;

const minimalCode = `{/* Default: renders ThumbsUp + ThumbsDown + Copy */}
<FeedbackBar.Root onFeedback={handleFeedback} />`;

export function FeedbackBarDemo() {
  const [lastAction, setLastAction] = useState<string>("");
  const [regenCount, setRegenCount] = useState(0);

  return (
    <DemoWrapper title="FeedbackBar — Live Demo" code={fullCode}>
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4" data-arclo-copyable>
          <p className="text-sm text-gray-700 mb-3">
            The transformer architecture uses self-attention to process
            sequences in parallel, enabling efficient training on modern GPUs.
            This was a fundamental shift from recurrent approaches.
          </p>
          <FeedbackBar.Root
            onFeedback={(v) =>
              setLastAction(v ? `Feedback: ${v}` : "Feedback cleared")
            }
          >
            <FeedbackBar.ThumbsUp />
            <FeedbackBar.ThumbsDown />
            <FeedbackBar.Copy text="The transformer architecture uses self-attention to process sequences in parallel, enabling efficient training on modern GPUs." />
            <FeedbackBar.Regenerate
              onRegenerate={() => {
                setRegenCount((c) => c + 1);
                setLastAction(`Regenerated (${regenCount + 1}x)`);
              }}
            />
          </FeedbackBar.Root>
        </div>

        {lastAction && (
          <p className="text-xs text-gray-500">Last action: {lastAction}</p>
        )}
      </div>
    </DemoWrapper>
  );
}

export function FeedbackBarMinimalDemo() {
  return (
    <DemoWrapper title="FeedbackBar — Default (no children)" code={minimalCode}>
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-sm text-gray-700 mb-3">
          When no children are provided, FeedbackBar renders ThumbsUp +
          ThumbsDown + Copy by default.
        </p>
        <FeedbackBar.Root onFeedback={(v) => console.log("feedback:", v)} />
      </div>
    </DemoWrapper>
  );
}
