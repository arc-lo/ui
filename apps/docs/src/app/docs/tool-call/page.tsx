import {
  ToolCallDemo,
  ToolCallMultiDemo,
} from "@/components/demos/tool-call-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function ToolCallDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>ToolCall</h1>
      <p>
        Display AI tool invocations with status indicators, collapsible inputs
        and outputs. Essential for agent and function-calling UIs.
      </p>

      <ToolCallDemo />
      <ToolCallMultiDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { ToolCall } from "@arc-lo/ui";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<ToolCall.Root toolName="web_search" status="success">
  <ToolCall.Header />
  <ToolCall.Input>
    {JSON.stringify({ query: "React 19 features" }, null, 2)}
  </ToolCall.Input>
  <ToolCall.Output>
    {JSON.stringify(results, null, 2)}
  </ToolCall.Output>
</ToolCall.Root>`}
      />

      <h2>With description in header</h2>
      <CodeBlock
        lang="tsx"
        code={`<ToolCall.Root toolName="read_file" status="running">
  <ToolCall.Header>
    <p className="text-xs text-gray-500 mt-0.5">
      Reading src/config.ts
    </p>
  </ToolCall.Header>
</ToolCall.Root>`}
      />

      <h2>Agent with multiple tool calls</h2>
      <CodeBlock
        lang="tsx"
        code={`function AgentSteps({ steps }) {
  return (
    <div className="space-y-3">
      {steps.map((step) => (
        <ToolCall.Root
          key={step.id}
          toolName={step.tool}
          status={step.status}
        >
          <ToolCall.Header>
            <p className="text-xs text-gray-500 mt-0.5">
              {step.description}
            </p>
          </ToolCall.Header>
          <ToolCall.Input>
            {JSON.stringify(step.input, null, 2)}
          </ToolCall.Input>
          <ToolCall.Output>
            {JSON.stringify(step.output, null, 2)}
          </ToolCall.Output>
        </ToolCall.Root>
      ))}
    </div>
  );
}`}
      />

      <h2>Parts</h2>
      <InfoTable
        headers={["Part", "Description"]}
        rows={[
          { cells: ["Root", "Container with status and tool name context"] },
          { cells: ["Header", "Clickable row with status icon, tool name, and badge"] },
          { cells: ["Input", "Collapsible tool arguments display"] },
          { cells: ["Output", "Collapsible result (hidden while pending/running)"] },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        title="Root"
        props={[
          { name: "toolName", type: "string", description: "Name of the tool (required)" },
          { name: "status", type: '"pending" | "running" | "success" | "error"', default: '"pending"', description: "Current execution status" },
          { name: "defaultOpen", type: "boolean", default: "false", description: "Start with details expanded" },
        ]}
      />

      <h2>Statuses</h2>
      <InfoTable
        headers={["Status", "Icon", "Badge", "Color"]}
        rows={[
          { cells: ["pending", "Gray dot", "Queued", "Gray"] },
          { cells: ["running", "Spinner", "Running", "Blue"] },
          { cells: ["success", "Checkmark", "Done", "Emerald"] },
          { cells: ["error", "X mark", "Failed", "Red"] },
        ]}
      />
    </article>
  );
}
