import {
  ThinkingBlockDemo,
  ThinkingBlockStatesDemo,
} from "@/components/demos/thinking-block-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function ThinkingBlockDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>ThinkingBlock</h1>
      <p>
        Collapsible chain-of-thought display for AI reasoning. Shows the
        model&apos;s thinking process with auto-collapse on completion.
      </p>

      <ThinkingBlockDemo />
      <ThinkingBlockStatesDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { ThinkingBlock } from "@arc-lo/ui";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<ThinkingBlock.Root state="thinking" duration={4}>
  <ThinkingBlock.Trigger />
  <ThinkingBlock.Content>
    <p>Analyzing the request...</p>
  </ThinkingBlock.Content>
</ThinkingBlock.Root>`}
      />

      <h2>With streaming content</h2>
      <CodeBlock
        lang="tsx"
        code={`function ThinkingMessage({ thinking, state, duration }) {
  return (
    <ThinkingBlock.Root
      state={state}
      duration={duration}
      collapseOnDone
    >
      <ThinkingBlock.Trigger />
      <ThinkingBlock.Content>
        <StreamingText.Root text={thinking} speed={15}>
          <StreamingText.Content className="text-sm italic text-gray-600" />
          <StreamingText.Cursor />
        </StreamingText.Root>
      </ThinkingBlock.Content>
    </ThinkingBlock.Root>
  );
}`}
      />

      <h2>Parts</h2>
      <InfoTable
        headers={["Part", "Description"]}
        rows={[
          { cells: ["Root", "Container with state management and context"] },
          { cells: ["Trigger", "Clickable header with icon, label, and chevron"] },
          { cells: ["Content", "Collapsible content area"] },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        title="Root"
        props={[
          { name: "state", type: '"thinking" | "done" | "error"', default: '"thinking"', description: "Current thinking state" },
          { name: "defaultOpen", type: "boolean", default: "true", description: "Start expanded" },
          { name: "collapseOnDone", type: "boolean", default: "true", description: "Auto-collapse when done" },
          { name: "duration", type: "number | null", default: "null", description: "Thinking duration in seconds" },
        ]}
      />

      <h2>States</h2>
      <InfoTable
        headers={["State", "Icon", "Border", "Behavior"]}
        rows={[
          { cells: ["thinking", "Spinner", "Purple tint", "Expanded, content updating"] },
          { cells: ["done", "Sparkle", "Gray", "Auto-collapses after 500ms"] },
          { cells: ["error", "X circle", "Red tint", "Stays expanded"] },
        ]}
      />
    </article>
  );
}
