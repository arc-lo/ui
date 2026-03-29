import {
  StatusIndicatorDemo,
  StatusIndicatorCycleDemo,
  StatusIndicatorCustomDemo,
} from "@/components/demos/status-indicator-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function StatusIndicatorDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>StatusIndicator</h1>
      <p>
        Animated status label with pulsing text and spinning icon — the
        heartbeat of your AI interface. Shows what the model is doing right now.
      </p>

      <StatusIndicatorDemo />
      <StatusIndicatorCycleDemo />
      <StatusIndicatorCustomDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { StatusIndicator } from "@arclo/react";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<StatusIndicator state="thinking" />
<StatusIndicator state="streaming" />
<StatusIndicator state="tool-calling" />
<StatusIndicator state="idle" />
<StatusIndicator state="error" />`}
      />

      <h2>Custom labels and colors</h2>
      <CodeBlock
        lang="tsx"
        code={`<StatusIndicator
  state="thinking"
  label="Mulling..."
  color="amber"
/>

<StatusIndicator
  state="thinking"
  label="Searching..."
  color="blue"
  icon={<SearchIcon />}
/>`}
      />

      <h2>With response lifecycle</h2>
      <CodeBlock
        lang="tsx"
        code={`function ChatStatus({ responseState }) {
  const statusMap = {
    waiting: "idle",
    thinking: "thinking",
    calling_tools: "tool-calling",
    generating: "streaming",
    done: "idle",
    failed: "error",
  };

  return (
    <StatusIndicator state={statusMap[responseState]} />
  );
}`}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "state", type: '"idle" | "thinking" | "streaming" | "tool-calling" | "error"', default: '"idle"', description: "Current AI state" },
          { name: "label", type: "string", description: "Override default label" },
          { name: "icon", type: "ReactNode", description: "Custom icon element" },
          { name: "color", type: '"purple" | "amber" | "blue" | "red" | "gray"', description: "Override color scheme" },
        ]}
      />

      <h2>States</h2>
      <InfoTable
        headers={["State", "Default label", "Color", "Animation"]}
        rows={[
          { cells: ["idle", "Ready", "Gray", "None"] },
          { cells: ["thinking", "Thinking...", "Amber", "Pulse + spin"] },
          { cells: ["streaming", "Writing...", "Purple", "Pulse + spin"] },
          { cells: ["tool-calling", "Using tools...", "Blue", "Pulse + spin"] },
          { cells: ["error", "Error", "Red", "None"] },
        ]}
      />
    </article>
  );
}
