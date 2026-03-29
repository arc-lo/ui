"use client";

import { useState } from "react";
import { ModelSelector } from "@arclo/react";
import { DemoWrapper } from "../demo-wrapper";

const code = `import { ModelSelector } from "@arclo/react";

const models = [
  { id: "claude-4", name: "Claude 4 Opus", badge: "New", description: "Most capable model for complex tasks" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", description: "Best balance of speed and capability" },
  { id: "claude-3.5-haiku", name: "Claude 3.5 Haiku", badge: "Fast", description: "Fastest model for simple tasks" },
];

<ModelSelector
  models={models}
  value={selectedModel}
  onChange={setSelectedModel}
/>`;

const models = [
  {
    id: "claude-4",
    name: "Claude 4 Opus",
    badge: "New",
    description: "Most capable model for complex tasks",
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Best balance of speed and capability",
  },
  {
    id: "claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    badge: "Fast",
    description: "Fastest model for simple tasks",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "OpenAI multimodal model",
  },
];

export function ModelSelectorDemo() {
  const [value, setValue] = useState("claude-4");

  return (
    <DemoWrapper title="ModelSelector" code={code}>
      <div className="space-y-4">
        <ModelSelector models={models} value={value} onChange={setValue} />
        <p className="text-xs text-gray-500">
          Selected: <code className="text-gray-700">{value}</code>
        </p>
      </div>
    </DemoWrapper>
  );
}
