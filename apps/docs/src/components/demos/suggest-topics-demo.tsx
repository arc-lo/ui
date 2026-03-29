"use client";

import { useState } from "react";
import { SuggestTopics, TopicCard } from "@arclo/react";
import { DemoWrapper } from "../demo-wrapper";

const code = `import { SuggestTopics, TopicCard } from "@arclo/react";

<SuggestTopics columns={2}>
  <TopicCard
    icon="✍️"
    title="Help me write a blog post"
    description="About AI design systems and component libraries"
    onSelect={(title) => setPrompt(title)}
  />
  <TopicCard
    icon="🔍"
    title="Explain how transformers work"
    description="In simple terms with analogies"
    onSelect={(title) => setPrompt(title)}
  />
  <TopicCard
    icon="💻"
    title="Debug my React component"
    description="It's re-rendering too often"
    onSelect={(title) => setPrompt(title)}
  />
  <TopicCard
    icon="📊"
    title="Analyze this dataset"
    description="Find patterns and anomalies"
    onSelect={(title) => setPrompt(title)}
  />
</SuggestTopics>`;

export function SuggestTopicsDemo() {
  const [selected, setSelected] = useState<string>("");

  return (
    <DemoWrapper title="SuggestTopics — Live Demo" code={code}>
      <div className="space-y-4">
        <SuggestTopics columns={2}>
          <TopicCard
            icon="✍️"
            title="Help me write a blog post"
            description="About AI design systems and component libraries"
            onSelect={setSelected}
          />
          <TopicCard
            icon="🔍"
            title="Explain how transformers work"
            description="In simple terms with analogies"
            onSelect={setSelected}
          />
          <TopicCard
            icon="💻"
            title="Debug my React component"
            description="It's re-rendering too often"
            onSelect={setSelected}
          />
          <TopicCard
            icon="📊"
            title="Analyze this dataset"
            description="Find patterns and anomalies"
            onSelect={setSelected}
          />
        </SuggestTopics>

        {selected && (
          <p className="text-xs" style={{ color: "var(--docs-muted)" }}>
            Selected: &quot;{selected}&quot;
          </p>
        )}
      </div>
    </DemoWrapper>
  );
}

export function SuggestTopicsCompactDemo() {
  const [selected, setSelected] = useState("");

  return (
    <DemoWrapper
      title="SuggestTopics — Compact (horizontal scroll)"
      code={`<SuggestTopics variant="compact">
  <TopicCard variant="compact" icon="✍️" title="Write a blog post" onSelect={handle} />
  <TopicCard variant="compact" icon="🐛" title="Debug my code" onSelect={handle} />
  <TopicCard variant="compact" icon="📝" title="Summarize this" onSelect={handle} />
  <TopicCard variant="compact" icon="🔍" title="Research a topic" onSelect={handle} />
  <TopicCard variant="compact" icon="💡" title="Brainstorm ideas" onSelect={handle} />
  <TopicCard variant="compact" icon="📊" title="Analyze data" onSelect={handle} />
</SuggestTopics>`}
    >
      <div className="space-y-4">
        <SuggestTopics variant="compact">
          <TopicCard variant="compact" icon="✍️" title="Write a blog post" onSelect={setSelected} />
          <TopicCard variant="compact" icon="🐛" title="Debug my code" onSelect={setSelected} />
          <TopicCard variant="compact" icon="📝" title="Summarize this" onSelect={setSelected} />
          <TopicCard variant="compact" icon="🔍" title="Research a topic" onSelect={setSelected} />
          <TopicCard variant="compact" icon="💡" title="Brainstorm ideas" onSelect={setSelected} />
          <TopicCard variant="compact" icon="📊" title="Analyze data" onSelect={setSelected} />
        </SuggestTopics>

        {selected && (
          <p className="text-xs" style={{ color: "var(--docs-muted)" }}>
            Selected: &quot;{selected}&quot;
          </p>
        )}
      </div>
    </DemoWrapper>
  );
}

export function SuggestTopicsMinimalDemo() {
  return (
    <DemoWrapper
      title="SuggestTopics — No Icons, 3 Columns"
      code={`<SuggestTopics columns={3}>
  <TopicCard title="Summarize this document" onSelect={handle} />
  <TopicCard title="Write unit tests" onSelect={handle} />
  <TopicCard title="Explain this error" onSelect={handle} />
</SuggestTopics>`}
    >
      <SuggestTopics columns={3}>
        <TopicCard title="Summarize this document" onSelect={() => {}} />
        <TopicCard title="Write unit tests" onSelect={() => {}} />
        <TopicCard title="Explain this error" onSelect={() => {}} />
      </SuggestTopics>
    </DemoWrapper>
  );
}
