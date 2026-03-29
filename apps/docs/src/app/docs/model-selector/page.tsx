import { ModelSelectorDemo } from "@/components/demos/model-selector-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable } from "@/components/props-table";

export default function ModelSelectorDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>ModelSelector</h1>
      <p>
        Dropdown selector for AI models. Shows the selected model with an
        optional badge, and opens a dropdown with descriptions on click.
      </p>

      <ModelSelectorDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { ModelSelector } from "@arclo/react";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`const models = [
  { id: "claude-4", name: "Claude 4 Opus", badge: "New", description: "Most capable" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", description: "Balanced" },
  { id: "claude-3.5-haiku", name: "Claude 3.5 Haiku", badge: "Fast", description: "Fastest" },
];

<ModelSelector
  models={models}
  value={selectedModel}
  onChange={setSelectedModel}
/>`}
      />

      <h2>Model object</h2>
      <PropsTable
        props={[
          { name: "id", type: "string", description: "Unique model identifier (required)" },
          { name: "name", type: "string", description: "Display name (required)" },
          { name: "description", type: "string", description: "Short description shown in dropdown" },
          { name: "badge", type: "string", description: "Badge text (e.g. \"New\", \"Fast\")" },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "models", type: "ModelOption[]", description: "Array of available models (required)" },
          { name: "value", type: "string", description: "Currently selected model id (required)" },
          { name: "onChange", type: "(modelId: string) => void", description: "Called when user selects a model (required)" },
        ]}
      />
    </article>
  );
}
