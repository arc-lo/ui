"use client";

import { useState } from "react";
import { PromptBox } from "@arclo/react";
import { DemoWrapper } from "../demo-wrapper";

const basicCode = `<PromptBox.Root onSubmit={(value) => sendToAI(value)} isSubmitting={loading}>
  <PromptBox.Input placeholder="Try typing a message..." />
  <PromptBox.Footer>
    <span className="text-xs text-gray-400">Enter to send</span>
    <PromptBox.SubmitButton />
  </PromptBox.Footer>
</PromptBox.Root>`;

const fullCode = `<PromptBox.Root onSubmit={handleSubmit} isSubmitting={loading}>
  <PromptBox.Chips>
    <PromptBox.Chip onRemove={() => remove("model")}>Claude 3.5</PromptBox.Chip>
    <PromptBox.Chip onRemove={() => remove("file")}>report.pdf</PromptBox.Chip>
  </PromptBox.Chips>
  <PromptBox.Input placeholder="Ask about your document..." />
  <PromptBox.Suggestions
    suggestions={[
      "Summarize the key findings",
      "What are the main risks?",
      "Compare with last quarter",
    ]}
  />
  <PromptBox.Footer>
    <button onClick={addContext}>+ Add context</button>
    <PromptBox.SubmitButton />
  </PromptBox.Footer>
</PromptBox.Root>`;

export function PromptBoxBasicDemo() {
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (value: string) => {
    setLoading(true);
    setSubmitted((prev) => [...prev, value]);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <DemoWrapper title="PromptBox — Live Demo" code={basicCode}>
      <div className="space-y-4">
        <PromptBox.Root onSubmit={handleSubmit} isSubmitting={loading}>
          <PromptBox.Input placeholder="Try typing a message and press Enter..." />
          <PromptBox.Footer>
            <span className="text-xs text-gray-400">
              {loading ? "Sending..." : "Enter to send, Shift+Enter for newline"}
            </span>
            <PromptBox.SubmitButton />
          </PromptBox.Footer>
        </PromptBox.Root>

        {submitted.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">Submitted:</p>
            {submitted.map((msg, i) => (
              <div
                key={i}
                className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                {msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </DemoWrapper>
  );
}

export function PromptBoxFullDemo() {
  const [chips, setChips] = useState(["Claude 3.5", "report.pdf"]);
  const [loading, setLoading] = useState(false);
  const [lastSubmit, setLastSubmit] = useState("");

  const handleSubmit = (value: string) => {
    setLoading(true);
    setLastSubmit(value);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <DemoWrapper title="PromptBox — With Chips & Suggestions" code={fullCode}>
      <div className="space-y-4">
        <PromptBox.Root onSubmit={handleSubmit} isSubmitting={loading}>
          {chips.length > 0 && (
            <PromptBox.Chips>
              {chips.map((chip) => (
                <PromptBox.Chip
                  key={chip}
                  onRemove={() => setChips((c) => c.filter((x) => x !== chip))}
                >
                  {chip}
                </PromptBox.Chip>
              ))}
            </PromptBox.Chips>
          )}
          <PromptBox.Input placeholder="Ask about your document..." />
          <PromptBox.Suggestions
            suggestions={[
              "Summarize the key findings",
              "What are the main risks?",
              "Compare with last quarter",
            ]}
          />
          <PromptBox.Footer>
            <button
              type="button"
              onClick={() =>
                setChips((c) => [...c, `file-${c.length + 1}.txt`])
              }
              className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              + Add context
            </button>
            <PromptBox.SubmitButton />
          </PromptBox.Footer>
        </PromptBox.Root>

        {lastSubmit && (
          <p className="text-xs text-gray-500">
            Last sent: &quot;{lastSubmit}&quot; with context: [{chips.join(", ")}]
          </p>
        )}
      </div>
    </DemoWrapper>
  );
}
